# Nature's Light

A website to explore the wonders of the night sky.

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Firebase CLI

### Installation

1.  Clone the repository:
    ```bash
    git clone <your-repository-url>
    ```
2.  Navigate to the project directory:
    ```bash
    cd natures-light
    ```
3.  Install the dependencies:
    ```bash
    npm install
    ```

### Running Locally

To run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Firebase Integration

### Connecting to Firebase

1.  **Create a Firebase Project:**
    Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.

2.  **Get Firebase Config:**
    In your Firebase project, go to **Project settings** > **General**.
    Under "Your apps", click on the web icon (`</>`) to create a new web app.
    Copy the `firebaseConfig` object.

3.  **Update Firebase Config in the Code:**
    Open `src/lib/firebase.ts` and replace the placeholder `firebaseConfig` with your own.

4.  **Update Firebase Project ID:**
    Open `.firebaserc` and replace `"YOUR_FIREBASE_PROJECT_ID"` with your Firebase project ID.

5.  **Initialize Firebase:**
    Run the following command to log in to Firebase:
    ```bash
    firebase login
    ```
    Then, initialize Firebase in the project:
    ```bash
    firebase init
    ```
    When prompted, choose the following options:
    - **Which Firebase features do you want to set up?**
      - `Firestore: Configure security rules and indexes for Firestore`
      - `Hosting: Configure and deploy Firebase Hosting sites`
      - `Functions: Configure and deploy Cloud Functions`
    - **Please select an option:** `Use an existing project`
    - **Select a default Firebase project for this directory:** Choose the project you created.
    - **What file should be used for Firestore Rules?** `firestore.rules`
    - **What file should be used for Firestore indexes?** (press Enter for default)
    - **What language would you like to use to write Cloud Functions?** `JavaScript`
    - **Do you want to use ESLint to catch probable bugs and enforce style?** `Yes`
    - **Do you want to install dependencies with npm now?** `Yes`
    - **What do you want to use as your public directory?** `public`
    - **Configure as a single-page app (rewrite all urls to /index.html)?** `No`
    - **Set up automatic builds and deploys with GitHub?** `No`

### Deploying to Firebase

To deploy the website to Firebase Hosting:

```bash
firebase deploy
```

This will deploy the site and you will get a URL to view it live.

## Firestore Structure

The Firestore database has a collection called `events`. Each document in this collection represents a celestial event and has the following fields:

-   `title` (string): The title of the event.
-   `date` (timestamp): The date of the event.
-   `description` (string): A description of the event.
-   `location` (string): The location where the event is visible.
-   `visibility` (string): The visibility of the event (e.g., "Excellent", "Good", "Poor").

### Adding/Editing Events Manually

You can add or edit events directly in the Firebase Console.

1.  Go to your Firebase project in the Firebase Console.
2.  In the left menu, click on **Firestore Database**.
3.  You will see the `events` collection.
4.  To add a new event, click on **Add document**.
5.  To edit an existing event, click on the document, and you can edit the fields.

## GitHub Integration

### Connecting to GitHub

1.  **Create a new repository on GitHub.**
2.  **Link the local repository to the remote repository:**
    ```bash
    git remote add origin git@github.com:Anasmtaweh/Nature-Light.git
    git branch -M main
    git push -u origin main
    ```

### (Optional) GitHub Actions for Auto-deployment

You can set up a GitHub Action to automatically deploy the website to Firebase Hosting whenever you push to the `main` branch.

1.  In your GitHub repository, go to the **Actions** tab.
2.  Set up a new workflow. You can use a pre-made template for Firebase Hosting.
3.  You will need to add your Firebase token as a secret in your GitHub repository.
    You can generate a token by running:
    ```bash
    firebase login:ci
    ```
    Add this token as a secret called `FIREBASE_TOKEN` in your GitHub repository settings.
