# Rec on the Go

A mobile application for the university recreation and gym center, designed to provide a seamless and intuitive user experience for accessing gym resources, viewing events, and tracking workouts.

## How to Run

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Start the Application**
    ```bash
    npx expo start
    ```

3.  **View the App**
    *   **Web Browser**: Press `w` in the terminal to open the app in your default web browser. Change the browser viewport in the 
    developer tools to iPhone 12 Pro.
    *   **Mobile Device**: Download the **Expo Go** app on your iOS device and scan the QR code displayed in the terminal.

## Project Structure

The project follows a standard Expo Router structure with additional organization for components and data.

*   **`app/`**: The core of the application using file-based routing.
    *   **`(tabs)/`**: Contains the main tab navigation screens (`index`, `upcoming`, `events`, `gym_planner`).
    *   **`_layout.tsx`**: The root layout file defining the navigation structure.
*   **`components/`**: Reusable UI components used throughout the application.
    *   **`header-modals/`**: Specific modal components for features like Sign In, Profile, Barcode, etc.
*   **`constants/`**: Configuration files for the app's theme and colors (e.g., `Colors.ts`).
*   **`context/`**: React Context providers for global state management.
    *   **`DataContext.tsx`**: Manages application state including user sessions, events, workouts, and exercises.
*   **`data/`**: Contains static data and TypeScript interfaces.
    *   **`mockData.ts`**: Defines the initial data set and types for the application.
    *   **`events.json`**: Raw event data used to populate the application.
*   **`assets/`**: Static assets like images and fonts.
*   **`scripts/`**: Contains miscellaneous scripts used in development.
    *   **`scripts/scrape_gym_data.ts`**: Scrapes Stony Brook University's event calendar and outputs the data as a .json file.
    
### Key Interactions
*   The **`DataContext`** wraps the application in `app/_layout.tsx`, providing data access to all screens and components.
*   **Screens** in `app/(tabs)/` consume this context to display and modify data (e.g., RSVPing to events, creating workouts).
*   **Modals** in `components/` handle specific user interactions like editing workouts or viewing event details, often triggered from the main screens or the custom header.
