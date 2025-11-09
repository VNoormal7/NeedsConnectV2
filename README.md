# Needs Connect - Charity Platform

A complete React + Vite charity platform for managing needs, volunteers, and donations.

## Features

- **Role-based Authentication**: Login as "admin" for manager role, or any other username for helper role
- **Needs Management**: Browse, create, edit, and delete charity needs with priority sorting
- **Priority Formula**: `(urgency × 100) + ((7 - daysOld) × 10) + (interestedHelpers × 5)`
- **Helper Features**: Browse needs, add to basket, fund needs, view impact dashboard
- **Admin Features**: Full CRUD for needs, aggregate statistics dashboard
- **Volunteer System**: Post volunteer tasks and register volunteers
- **Impact Dashboard**: Visual charts showing funding by category and completion rates

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- React Router
- Lucide React (icons)
- Recharts (charts)
- Local Storage (data persistence)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`)

## Usage

### Login
- Use username "admin" to login as manager/admin
- Use any other username to login as helper

### Helper Role
- Browse needs and filter by category
- Add needs to basket
- Fund needs directly
- View impact dashboard with charts
- Access volunteer system

### Admin Role
- Create, edit, and delete needs
- View aggregate statistics
- See all needs in a table format
- Access volunteer system

### Sample Data
The app comes pre-loaded with 10 sample needs across different categories (Food, Education, Shelter, Health).

## Project Structure

```
src/
├── components/       # Reusable components
├── pages/           # Page components
├── utils/           # Utility functions (storage, calculations)
├── App.jsx          # Main app with routing
├── main.jsx         # Entry point
└── index.css        # Global styles
```

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

