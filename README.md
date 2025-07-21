# Timeline Visualizer App

A modern React application for visualizing timelines with both calendar and line views. Built with Vite, TypeScript, and styled with modern CSS.

## Features

### 🗓️ Calendar View
- Displays timeline entries as colored boxes cutting through months and years
- Interactive grid showing years and months
- Hover effects and entry management

### 📏 Line View  
- Horizontal timeline with notched months and years
- Timeline entries displayed as colored bars above the line
- Clean, minimal design for easy scanning

### ✨ Core Functionality
- **Add Timeline Entries**: Name, color, start date, and end date (or ongoing)
- **Switch Views**: Toggle between calendar and line views
- **Edit & Delete**: Manage existing timeline entries

## Timeline Entry Structure

Each timeline entry includes:
- **Name**: Name/Title
- **Color**: Custom color
- **Start Date**: When the entry begins
- **End Date**: When the entry ends (or "ongoing" for current activities)

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd timeline-visualizer-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Modern CSS with Flexbox and Grid
- **Date Handling**: date-fns
- **Icons**: Lucide React
- **Development**: ESLint, TypeScript

## Project Structure

```
src/
├── components/
│   ├── CalendarView.tsx      # Calendar timeline view
│   ├── LineView.tsx          # Line timeline view
│   └── TimelineControls.tsx  # View controls and entry form
├── types/
│   └── timeline.ts           # TypeScript type definitions
├── App.tsx                   # Main application component
├── App.css                   # Application styles
├── index.css                 # Global styles
└── main.tsx                  # Application entry point
```

## Usage

### Adding Timeline Entries

1. Click the "Add Entry" button
2. Fill in the entry details:
   - **Name**: Enter a descriptive name
   - **Color**: Choose a color using the color picker
   - **Start Date**: Select when the entry begins
   - **End Date**: Select when the entry ends (optional)
   - **Ongoing**: Check if the entry continues to present
3. Click "Add Entry" to save

### Switching Views

Use the toggle buttons in the controls section:
- **Calendar View**: Shows entries as boxes across months/years
- **Line View**: Shows entries as bars on a horizontal timeline
- **List View**: ...

### Managing Entries

- **Hover** over entries to see edit and delete buttons
- **Click** the edit button to modify entry details
- **Click** the delete button to remove entries

## Future Enhancements

- [ ] Dark mode support
