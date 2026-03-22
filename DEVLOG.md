# Development Log

This file tracks the major changes, fixes, and updates made to the Cornell Dragon Boat Club Fundraiser application.

## [2026-03-21] - Backend Fixes & Error Handling
*   **Vercel Serverless Crash Fix:** Changed `api/submit.js` to use ES Modules (`import` / `export default`) instead of CommonJS (`require` / `module.exports`). Because `package.json` specifies `"type": "module"`, the old syntax was causing a fatal `ReferenceError` before the function could even execute, resulting in a silent 500 error from Vercel.
*   **MongoDB Connection Update:** Updated `api/submit.js` to use the modern `new MongoClient(uri)` syntax instead of the deprecated `MongoClient.connect()`, fixing compatibility issues with the v7 MongoDB Node.js driver.
*   **Enhanced Error Handling (Backend):** Modified the serverless function to return detailed error messages (`error.message`) instead of generic 500 errors.
*   **Enhanced Error Handling (Frontend):** Added a global `window.onerror` handler in `index.html` for debugging. Updated the form submission `catch` block to display the specific backend error message in an alert box. Also added fallback logic to display raw HTML error pages if Vercel crashes entirely.
*   **Documentation:** Created `DEVELOP.md` to document the tech stack, local development setup (using Vercel CLI), and deployment instructions.

## [2026-03-21] - UI/UX Improvements & Consolidation
*   **Z-Index Fixes:** Added `relative z-20` to all navigation buttons ("Start Order", "Next", "Back", "Submit Order") in `index.html` to ensure they are clickable and not obstructed by other overlapping elements (like the animated dragon container).
*   **Code Consolidation:** Moved all JavaScript logic and custom CSS directly into `index.html`. This prevents issues with Vercel's static deployments failing to link separate `.js` and `.css` files correctly depending on the directory structure.

## [2026-03-21] - Initial Project Setup
*   **Frontend Creation:** Built the main user interface in `index.html` using HTML5 and Tailwind CSS (via CDN).
*   **Wizard Form:** Implemented a multi-step form flow (Welcome -> Personal Info -> Order -> Payment/Pickup -> Success) using Vanilla JavaScript.
*   **Dynamic Cart:** Added JavaScript logic to dynamically calculate the total cost based on the selected quantity of Chè Thái cups ($5/cup).
*   **Mascot Animation:** Created a CSS/SVG-based animated cartoon dragon that guides the user through the form with changing expressions and speech bubbles.
*   **Backend Creation:** Created the initial Vercel Serverless Function (`api/submit.js`) to handle POST requests, validate form data, and insert records into a MongoDB Atlas database (`Fundraisers` database, `CheThaiOrders` collection).
