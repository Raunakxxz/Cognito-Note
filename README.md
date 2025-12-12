# 🧠 CognitoNote

## The Multi-Workspace, Real-time Note-Taking App

[](https://opensource.org/licenses/MIT)
[](https://nextjs.org/)
[](https://firebase.google.com/)
[](https://www.google.com/search?q=https://vercel.com/new/clone%3Frepository-url%3D%5BYOUR_REPOSITORY_URL_HERE%5D)

**CognitoNote** is a modern, responsive note-taking application designed for organized users. It leverages **Next.js 15** for a high-performance frontend and **Firebase** (Auth + Firestore) for a robust, real-time backend. The core feature is the ability to organize thoughts and projects into distinct, focused **Workspaces**.

-----

## ✨ Core Features

  * **🧱 Multi-Workspace Organization:** Create and switch between distinct workspaces to organize notes by project, client, or topic.
  * **👤 Flexible Authentication:** Secure user login via Firebase Auth, featuring a **Guest Mode** for quick, anonymous testing.
  * **⚡ Real-time Sync:** Notes and workspace changes update instantly across all sessions using Firebase Firestore.
  * **📱 Fully Responsive Design:** Flawless user experience on both desktop and mobile devices.
  * **🎨 Modern UI:** Built with **Tailwind CSS** and **Radix UI** for speed and accessibility, including Dark Mode support.
  * **🔍 Search Functionality:** Quickly find the specific notes you need within your selected workspace.

-----

## 💻 Tech Stack

CognitoNote is built with a modern, performance-focused stack:

  * **Frontend Framework:** Next.js 15 (App Router) + React 18
  * **Backend/Database:** Firebase (Authentication and Firestore)
  * **Styling:** Tailwind CSS (Utility-first framework)
  * **Components:** Radix UI (Unstyled, accessible primitives)
  * **Language:** TypeScript

-----

## 📂 Project Structure & Key Files

This structure highlights the key organizational patterns within the repository:

### `src/app/` (Routing & Layouts)

  * **`page.tsx`**: The root landing page. Checks user authentication (`useAuth`) and redirects to `/app` or `/login`.
  * **`app/layout.tsx`**: Main layout wrapper for authenticated routes. Provides the necessary `NotesProvider` context.
  * **`notes/`**: Contains routes for note viewing. Its `layout.tsx` splits the page into the Note List sidebar and the main content area.
  * **`onboarding/page.tsx`**: Multi-step flow for new users to create their initial workspace.

### `src/components/` (Reusable UI)

  * **`app-header.tsx`**: The top navigation bar, incorporating the Workspace Switcher, search, and New Note button.
  * **`user-nav.tsx`**: User avatar dropdown for settings and handling the sign-out logic.
  * **`note-list.tsx`**: The sidebar component that displays and manages all notes for the active workspace.
  * **`workspace-switcher.tsx`**: Dropdown component for seamless switching between the user's multiple workspaces.

### `src/contexts/` (Global State)

  * **`auth-context.tsx`**: Manages all authentication logic: user object, `isGuest` status, and `login`/`logout` functions.
  * **`notes-context.tsx`**: Manages UI state related to note display, specifically `activeNoteId` and `isNoteListVisible` (sidebar toggle).

-----

## 🏃 Application Flow (How It Works)

1.  **Initial Visit:** User navigates to the site root (`/`). `src/app/page.tsx` checks the authentication status.
2.  **Auth Check:**
      * **New User:** Redirected to `/onboarding`.
      * **Existing User:** Redirected to the main application area (`/app/notes`).
3.  **Onboarding:** New users interact with `onboarding/page.tsx` to create their first workspace, which is persisted in Firestore.
4.  **Main View:** In `/app/notes`, the UI is divided: the `note-list.tsx` sidebar shows the notes for the currently selected workspace, and the main panel displays the selected note's content.
5.  **Interaction:** Users use components like `workspace-switcher.tsx` and the New Note button to manage their data, all synchronized via Firebase.

-----

## ⚙️ Getting Started

### Prerequisites

  * Node.js (LTS version recommended)
  * npm or yarn

### Installation Steps

1.  **Clone the Repository:**

    ```bash
    git clone [YOUR_REPOSITORY_URL_HERE]
    cd CognitoNote
    ```

2.  **Install Dependencies:**

    ```bash
    npm install
    # or yarn install
    ```

3.  **Configure Environment Variables:**
    Create a file named **`.env.local`** in the root directory and add your Firebase configuration details:

    ```bash
    # .env.local

    # Firebase Project Configuration (Replace with your actual keys)
    NEXT_PUBLIC_FIREBASE_API_KEY="..."
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="..."
    NEXT_PUBLIC_FIREBASE_PROJECT_ID="..."
    # ... include all necessary Firebase variables ...
    ```

4.  **Run the Server:**

    ```bash
    npm run dev
    # or yarn dev
    ```

    The application will be accessible at [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000).

-----

## 🤝 Contribution

We welcome and appreciate all contributions\!

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/new-feature-name`).
3.  Commit your changes (`git commit -m 'feat: Add a descriptive commit message'`).
4.  Push to the branch (`git push origin feature/new-feature-name`).
5.  Open a Pull Request.

-----
