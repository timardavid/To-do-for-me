# To-do-for-me — Ne felejtsd el

Personal task/reminder manager. Laravel API backend + React (Vite) frontend, MySQL via MAMP.

## Stack

- **Backend**: `backend/` — Laravel 13, PHP 8.5 (Homebrew), MySQL via MAMP (port 8889)
- **Frontend**: `frontend/` — React 19 + Vite, Tailwind CSS v4, Framer Motion
- **No auth** — local single-user tool, open API

## Running locally

1. Make sure MAMP's MySQL is running (MAMP.app, or `/Applications/MAMP/bin/startMysql.sh`). Database: `todo_for_me`, user `root` / pass `root`, port `8889`.
2. Backend:
   ```bash
   cd backend
   php artisan serve --port=8000
   ```
3. Frontend:
   ```bash
   cd frontend
   npm install   # first time only
   npm run dev
   ```
4. Reminder emails (runs the scheduler loop so `app:send-due-reminder-emails` fires every minute):
   ```bash
   cd backend
   php artisan schedule:work
   ```
5. Open http://localhost:5173

First run auto-seeds 3 sample tasks. Reminders fire two ways:
- **Browser + in-app banner**: the frontend polls `/api/tasks/due-reminders` every 30s while a tab is open — fires a browser notification (allow the permission prompt) plus an in-app banner. Requires the tab to stay open.
- **Email**: the `schedule:work` process (step 4) sends an email via Gmail SMTP to `REMINDER_EMAIL` (set in `backend/.env`) — works even if no browser tab is open, as long as `schedule:work` is running.

## Resetting the database

```bash
cd backend && php artisan migrate:fresh --seed
```
