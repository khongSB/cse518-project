import puppeteer, { Frame, Page } from "puppeteer";
import { v4 as uuidv4 } from "uuid";

const CONFIG = {
  URL: "https://www.stonybrook.edu/commcms/studentaffairs/rec/25_live/",
  START_DATE: "2025-09-01",
  END_DATE: "2026-01-01",
  TIMEOUT: 15000,
};

const SELECTORS = {
  FRAME_WRAPPER: ".twWeekTbl",
  NEXT_BTN: ".twPagerArrowRight",
  PREV_BTN: ".twPagerArrowLeft",
  WEEK_HEADING: ".twHeading",
  ROWS: "table.twWeekTbl > tbody > tr",
  DATE_LABEL: ".twWeekGroupLabel, .twWeekGroupTodayLabel",
  EVENT_CELL: ".twWeekEventCell, .twWeekEventTodayCell",
  EVENT_ROW: ".twWeekEventRow",
};

/** Formats date to local ISO string (YYYY-MM-DDTHH:mm:ss) */
const toLocalISO = (d: Date) => {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

/** Parses a time string like "5:00 pm" into components */
const parseTimeComponents = (timeStr: string) => {
  const match = timeStr.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
  if (!match) return null;
  return {
    h: parseInt(match[1]),
    m: parseInt(match[2] || "0"),
    mer: match[3]?.toLowerCase(),
  };
};

/** Parses a time range string (e.g., "5pm - 7pm", "10 - 11am") into Date objects */
const parseTimeRange = (baseDate: Date, rawStr: string) => {
  // Normalize: remove newlines, fix dashes, handle "5pm 7pm" case
  let clean = rawStr
    .replace(/[\n\r]/g, "")
    .replace(/\u2013|\u2014/g, "-")
    .trim();
  if (!clean.includes("-") && /\d.*?\s+\d/.test(clean)) {
    clean = clean.replace(/(\d+(?::\d+)?\s*[ap]m?)\s+(\d+)/i, "$1 - $2");
  }

  const parts = clean.split("-").map((s) => s.trim());
  if (parts.length === 0) return null;

  const startComp = parseTimeComponents(parts[0]);
  const endComp = parts[1] ? parseTimeComponents(parts[1]) : null;

  if (!startComp) return null;

  // Infer meridiem (AM/PM)
  let startMer = startComp.mer;
  let endMer = endComp?.mer;

  if (!startMer && !endMer) {
    startMer = "am";
    if (endComp) endMer = "am";
  } else if (startMer && !endMer && endComp) {
    endMer = startMer;
  } else if (!startMer && endMer) {
    startMer = endMer;
  }

  // Construct Dates
  const buildDate = (h: number, m: number, mer?: string) => {
    let hour = h;
    if (mer === "pm" && hour < 12) hour += 12;
    if (mer === "am" && hour === 12) hour = 0;
    const d = new Date(baseDate);
    d.setHours(hour, m, 0, 0);
    return d;
  };

  const start = buildDate(startComp.h, startComp.m, startMer);
  let end = endComp
    ? buildDate(endComp.h, endComp.m, endMer)
    : new Date(start.getTime() + 3600000);

  // Handle overnight events
  if (end < start) end.setDate(end.getDate() + 1);

  return { start, end };
};

const findScheduleFrame = async (page: Page): Promise<Frame> => {
  await page.waitForNetworkIdle();
  for (const frame of page.frames()) {
    if (await frame.$(SELECTORS.FRAME_WRAPPER)) return frame;
  }
  throw new Error("Schedule frame not found");
};

const getWeekRange = async (frame: Frame) => {
  const heading = await frame
    .$eval(SELECTORS.WEEK_HEADING, (el: any) => el.innerText)
    .catch(() => null);
  if (!heading) throw new Error("Cannot find week heading");

  // Expected format: "Week of Dec 21, 2025"
  const dateStr = heading.replace(/Week of /i, "").trim();
  const start = new Date(dateStr);

  if (isNaN(start.getTime()))
    throw new Error(`Failed to parse date from heading: ${heading}`);

  const end = new Date(start);
  end.setDate(end.getDate() + 6);

  return { start, end };
};

const navigate = async (frame: Frame, direction: "next" | "prev") => {
  const btnSelector =
    direction === "next" ? SELECTORS.NEXT_BTN : SELECTORS.PREV_BTN;
  const oldHref = await frame
    .$eval(btnSelector, (el: any) => el.href)
    .catch(() => null);

  try {
    await frame.click(btnSelector);
    // Wait for href to change
    await frame.waitForFunction(
      (sel, old) => {
        const el = document.querySelector(sel) as HTMLAnchorElement;
        return el && el.href !== old;
      },
      { timeout: CONFIG.TIMEOUT },
      btnSelector,
      oldHref
    );
    return frame;
  } catch {
    // If frame detaches/reloads, find it again
    return findScheduleFrame(frame.page());
  }
};

const scrapeWeekEvents = async (frame: Frame, weekStart: Date) => {
  return frame.evaluate(
    (sel, startIso) => {
      const rows = Array.from(document.querySelectorAll(sel.ROWS));
      const weekStart = new Date(startIso);
      const results: any[] = [];
      let currentDateStr = "";

      rows.forEach((row) => {
        // Update current date context
        const dateLabel = row.querySelector(sel.DATE_LABEL) as HTMLElement;
        if (dateLabel)
          currentDateStr = dateLabel.innerText.replace(/\n/g, " ").trim();

        const eventCell = row.querySelector(sel.EVENT_CELL);
        if (!eventCell) return;

        // Calculate date object for this row
        const dayNum = parseInt(currentDateStr.match(/\d+/)?.[0] || "0");
        const date = new Date(weekStart);
        for (let i = 0; i < 7; i++) {
          const d = new Date(weekStart);
          d.setDate(d.getDate() + i);
          if (d.getDate() === dayNum) {
            date.setTime(d.getTime());
            break;
          }
        }

        // Extract events
        eventCell.querySelectorAll(sel.EVENT_ROW).forEach((evtRow: any) => {
          const timeEl =
            evtRow.querySelector(".txTS, .twWeekTimeCell") ||
            evtRow.querySelector("td");
          const titleEl = evtRow.querySelector(".EventTitle");
          const locEl = evtRow.querySelector(".twLocation");
          const descEl = evtRow.querySelectorAll("td")[1];

          results.push({
            name: titleEl?.innerText.trim() || "Unknown",
            timeStr: timeEl?.innerText.trim() || "",
            location: locEl?.innerText.trim() || "",
            rawDesc: descEl?.innerText || "",
            date: date.toISOString().split("T")[0], // YYYY-MM-DD
          });
        });
      });
      return results;
    },
    SELECTORS,
    weekStart.toISOString()
  );
};

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--start-maximized"],
  });

  try {
    const page = await browser.newPage();
    console.log(`Navigating to ${CONFIG.URL}...`);
    await page.goto(CONFIG.URL, { waitUntil: "networkidle2" });

    let frame = await findScheduleFrame(page);
    // Use T00:00:00 to force local time parsing, matching the browser's behavior for "Month Day, Year"
    const targetStart = new Date(CONFIG.START_DATE + "T00:00:00");
    const targetEnd = new Date(CONFIG.END_DATE + "T00:00:00");

    // 1. Navigate to Start Date
    console.log("Locating target week...");
    const { start: currentStart } = await getWeekRange(frame);

    // Align target date to the Sunday of its week (start of week) to match the calendar's "Week of" format
    const targetWeekStart = new Date(targetStart);
    targetWeekStart.setDate(targetStart.getDate() - targetStart.getDay());
    targetWeekStart.setHours(0, 0, 0, 0);

    // Calculate weeks difference
    const diffTime = targetWeekStart.getTime() - currentStart.getTime();
    const diffWeeks = Math.round(diffTime / (1000 * 60 * 60 * 24 * 7));

    if (diffWeeks !== 0) {
      const dir = diffWeeks > 0 ? "next" : "prev";
      const clicks = Math.abs(diffWeeks);
      console.log(
        `Current week: ${currentStart.toLocaleDateString()}. Target week start: ${targetWeekStart.toLocaleDateString()}.`
      );
      console.log(`Navigating ${clicks} weeks ${dir}...`);

      for (let i = 0; i < clicks; i++) {
        frame = await navigate(frame, dir);
      }
    }

    // 2. Scrape Loop
    const eventsMap = new Map<string, any>();

    while (true) {
      const { start, end } = await getWeekRange(frame);
      if (start > targetEnd) break;

      console.log(
        `Scraping week: ${start.toLocaleDateString()} - ${end.toLocaleDateString()}`
      );
      const rawEvents = await scrapeWeekEvents(frame, start);

      for (const raw of rawEvents) {
        const dateObj = new Date(raw.date + "T00:00:00"); // Force local time parsing
        const range = parseTimeRange(dateObj, raw.timeStr);
        if (!range) continue;

        if (!eventsMap.has(raw.name)) {
          eventsMap.set(raw.name, {
            id: uuidv4(),
            name: raw.name,
            description: raw.rawDesc.replace(/\s+/g, " ").trim(),
            location: raw.location,
            type: "other",
            isFavorited: false,
            instances: [],
          });
        }

        const evt = eventsMap.get(raw.name);
        const startISO = toLocalISO(range.start);

        if (!evt.instances.some((i: any) => i.startDateTime === startISO)) {
          evt.instances.push({
            id: `${evt.id}#${evt.instances.length + 1}`,
            startDateTime: startISO,
            endDateTime: toLocalISO(range.end),
            isRSVPed: false,
          });
        }
      }

      if (end >= targetEnd) break;
      console.log("Next week...");
      frame = await navigate(frame, "next");
    }

    console.log(`Total unique events found: ${eventsMap.size}`);
    console.log(JSON.stringify(Array.from(eventsMap.values()), null, 2));
  } catch (error) {
    console.error("Execution failed:", error);
  } finally {
    await browser.close();
  }
})();
