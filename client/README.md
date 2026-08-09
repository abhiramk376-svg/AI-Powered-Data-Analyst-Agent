# DataAnalyst Pro - React Frontend

A modern, conversational AI-powered data analysis dashboard built with **React**, **Tailwind CSS**, and **Vite**.

## 🏗️ Architecture

```
DataAnalyst Pro
├── Sidebar.jsx          ← Left navigation (New Analysis, History, User Profile)
├── Chat.jsx             ← Center conversational interface
│   ├── MessageBubble.jsx
│   └── InputBar.jsx
├── ArtifactPanel.jsx    ← Right split-pane artifact/editor panel
│   ├── ArtifactHeader.jsx  (Tabs: Visualizations | Data Preview)
│   ├── ChartCard.jsx
│   ├── StatCard.jsx        (Bento grid stats)
│   └── DataTable.jsx       (CSV preview)
└── App.jsx              ← Root layout orchestrator
```

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open http://localhost:5173
```

## 📦 Tech Stack

| Technology | Purpose |
|------------|---------|
| React 19 | UI Framework |
| Tailwind CSS 3.4 | Utility-first styling |
| Vite 6 | Build tool & dev server |
| Lucide React | Icon library |
| clsx + tailwind-merge | Conditional class utilities |

## 🎨 Design System

The UI follows a **Material Design 3** inspired color system with custom tokens:

- **Primary**: `#3525cd` — Brand accent
- **Surface**: `#f7f9fb` — Background
- **Surface Container**: `#eceef0` — Elevated cards
- **Outline Variant**: `#c7c4d8` — Borders

## 🧩 Key Features

### 1. Three-Pane Layout
- **Left Sidebar** (280px): Navigation, user profile, quick actions
- **Center Chat** (flex-1): Conversational interface with message bubbles
- **Right Artifact Panel** (450–550px): Split-pane editor for visualizations & data

### 2. Chat Interface
- Auto-scrolling message history
- Glass-morphism input bar with focus ring
- File upload button (Paperclip)
- Send button with hover animation

### 3. Artifact Panel
- **Tab switching**: Visualizations ↔ Data Preview
- **Chart Card**: Displays generated matplotlib/seaborn charts
- **Stat Cards**: Bento-grid KPI cards (Growth, Forecast)
- **Data Table**: Scrollable CSV preview with hover states

### 4. Interactions
- Button scale feedback on click
- Input focus ring animation
- Smooth scroll to bottom on new messages
- Tab-based content switching in Artifact Panel

## 🔌 Integration with Backend

Connect the frontend to your FastAPI + LangGraph backend:

```jsx
// In App.jsx, replace the simulated response:
const handleSendMessage = async (text) => {
  const userMsg = { role: 'user', content: text };
  setMessages((prev) => [...prev, userMsg]);

  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: text, session_id: sessionId }),
  });

  const data = await response.json();
  setMessages((prev) => [...prev, { role: 'agent', content: data.reply }]);
};
```

## 📁 File Structure

```
data-analyst-pro-react/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    └── components/
        ├── Sidebar.jsx
        ├── Chat.jsx
        ├── MessageBubble.jsx
        ├── InputBar.jsx
        ├── ArtifactPanel.jsx
        ├── ArtifactHeader.jsx
        ├── ChartCard.jsx
        ├── StatCard.jsx
        └── DataTable.jsx
```

## 📝 Customization

### Adding New Artifact Types

Extend the `ArtifactPanel` to support additional tabs:

```jsx
const tabs = [
  { id: 'visualizations', label: 'Visualizations' },
  { id: 'data', label: 'Data Preview' },
  { id: 'code', label: 'Generated Code' },  // NEW
];
```

### Theming

Toggle dark mode by adding/removing the `dark` class on `<html>`:

```js
document.documentElement.classList.toggle('dark');
```

All colors are defined with `dark:` variants in Tailwind config.

## 📄 License

MIT
