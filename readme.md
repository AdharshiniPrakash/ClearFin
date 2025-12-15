Project Overview

Description: ClearFin — a small client-side transaction tracker that stores transactions in localStorage and displays them in a responsive list. It demonstrates CRUD (Create, Read, Update, Delete) operations to manage transaction data using HTML, Tailwind CSS, and vanilla JavaScript.

Purpose
Goal: Teach and showcase how to build a responsive UI that persists data in the browser and implements full CRUD flows without a backend.

Tech Stack
Frontend: HTML + Tailwind CSS
Logic: Plain JavaScript (DOM manipulation, event handlers)
Storage: Browser localStorage (key: transactions)

Features
Create: Add transaction form saves new entries to localStorage.
Read: Transactions listed responsively in the UI with date, category, and amount.
Update: Edit opens a styled modal pre-filled with data — Save updates localStorage and UI.
Delete: Delete via options popup removes the item from localStorage and refreshes the list.
Filters: View All / Income / Expense.
Persistent: Data stored in browser localStorage under the transactions key.
Responsive UI: Uses Tailwind CSS utility classes.

Files
HTML: index.html
JS: script.js
Assets: resources (icons)

Quick Start
Open index.html directly in a modern browser.

Usage
Add: Fill Amount, Description, Category and Save.
Options: Click the options icon on a transaction to open the Edit/Delete popup.
Edit: Opens a styled modal pre-filled with transaction data; Save updates localStorage and the list.
Clear data: In the browser console, run: localStorage.removeItem('transactions')

Development
Edit code: UI logic is in script.js. Styling changes may require Tailwind or replacing utility classes with your CSS.
Modal behaviour: Closes on Cancel, outside click, or Esc.

Troubleshooting
Empty list: Ensure transactions exist in localStorage or add a transaction via UI.
Styles missing: If Tailwind is not included, utility classes will not render — either add Tailwind or convert classes to your CSS.

Contributing
Fork, modify script.js for behaviour changes, and submit improvements.
