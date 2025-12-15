import { CustomHeader } from "@/app/components/CustomHeader";
import { CustomTabBar } from "@/app/components/CustomTabBar";
import { BarcodeModal } from "@/app/components/header-modals/BarcodeModal";
import { LinksModal } from "@/app/components/header-modals/LinksModal";
import { ProfileModal } from "@/app/components/header-modals/ProfileModal";
import { SignInModal } from "@/app/components/header-modals/SignInModal";
import { Tabs } from "expo-router";
import React, { useState } from "react";

export default function TabLayout() {
  const [notificationsOn, setNotificationsOn] = useState(false);
  const [showBarcodeModal, setShowBarcodeModal] = useState(false);
  const [showLinksModal, setShowLinksModal] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  return (
    <>
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          header: () => (
            <CustomHeader
              notificationsOn={notificationsOn}
              setNotificationsOn={setNotificationsOn}
              setShowBarcodeModal={setShowBarcodeModal}
              setShowLinksModal={setShowLinksModal}
              setShowSignInModal={setShowSignInModal}
              setShowProfileModal={setShowProfileModal}
            />
          ),
        }}
      >
        <Tabs.Screen name="index" options={{ title: "Today" }} />
        <Tabs.Screen name="upcoming" options={{ title: "Upcoming" }} />
        <Tabs.Screen name="events" options={{ title: "Events" }} />
        <Tabs.Screen name="gym_planner" options={{ title: "Gym Planner" }} />
      </Tabs>

      <ProfileModal
        visible={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />

      <SignInModal
        visible={showSignInModal}
        onClose={() => setShowSignInModal(false)}
      />

      <LinksModal
        visible={showLinksModal}
        onClose={() => setShowLinksModal(false)}
      />

      <BarcodeModal
        visible={showBarcodeModal}
        onClose={() => setShowBarcodeModal(false)}
      />
    </>
  );
}
