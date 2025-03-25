# Proper Email Rejections

Proper Email Rejections is a Chrome extension that transforms boring, generic email rejection messages into something more brutally honest and motivating. Whether you're tired of the same old "Unfortunatley, blah blah blah" or just want a laugh, this extension rewrites rejection emails with a touch of harshness and humor.

## Features

- **Email Parsing**: Automatically extracts email content from your current tab.
- **Rejection Rewriting**: Uses AI to rewrite rejection emails with a meaner, more direct tone.
- **Submission Tracking**: Save rewritten messages for future reference or submit your own messages!

## How It Works

1. Install the Chrome extension.
2. Open an email rejection in your inbox.
3. Click the "Generate" button in the extension to rewrite the email.
4. Replace the original email with the rewritten version in one click.

## Installation

### Frontend (Chrome Extension)

1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/proper-email-rejections.git
2. Navigate to the project directory:
   ```bash
   cd pr-extension
3. Install the dependencies:
    ```
    npm install
4. Build the project:
    ```
    npm run build
5. Load the extension in Chrome:
    - Open Chrome and go to chrome://extensions/.
    - Enable "Developer mode" (toggle in the top-right corner).
    - Click "Load unpacked" and select the dist folder inside the project directory

Now the extension is ready to use!

### Backend (API Server)
1. Navigate to the backend directory:
    ```bash
    cd backend
2. Install Python dependencies (Windows):
    ```
    venv/Scripts/activate
    pip install -r requirements.txt
3. Create a .env file in the backend directory and add the required environment variables:
    ```
    PORT=8080
    EXTENSION_ID=
    COHERE_API_KEY=
    MONGO_URI=
    DATABASE_NAME=
    COLLECTION_NAME=

    MODEL_NAME=
    PROMPT_1=
    PROMPT_2=
    PROMPT_3=
4. Start the Flask server:
    ```py
    python app.py
The backend will run locally and communicate with the Chrome Extension.