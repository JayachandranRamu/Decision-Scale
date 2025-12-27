<div align="center">

# ⚖️ DecisionScale

**Stop overthinking. Start weighing.**  
DecisionScale is a dynamic, weighted decision matrix tool that helps you compare options objectively by visualizing pros and cons on a unified vertical meter.
</div>

---

## 🚀 Features

- **Weighted Matrix**: Assign numerical weights (1-99) to every pro and con to reflect their true importance.
- **Dynamic Visualization**: A custom-built vertical "Meter" that scales automatically based on your scores.
- **Decision Templates**: Quick-start templates for common life choices:
  - 💼 Job Search
  - 🏠 Home Buying
  - 🎓 University Selection
  - 🍔 Dining Out
  - 📱 Tech Purchases
- **Server Persistence**: Powered by MongoDB (Atlas/Local) to keep your decisions safe across sessions.
- **Smart Updates**: Real-time debounced saving to ensure data integrity without performance lag.
- **Modern UI**: Built with Tailwind CSS, Lucide icons, and smooth Framer Motion animations.

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, TypeScript, Framer Motion, Tailwind CSS
- **Backend**: Node.js, Express, Mongoose
- **Database**: MongoDB (Supports Local or Atlas Serverless)
- **Icons**: Lucide React

## 🏁 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) (Local instance or an Atlas cluster)

### Installation

1. **Clone the repository** (or download the files).
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory:
   ```env
   # Backend Connection
   MongoURL=your_mongodb_connection_string
   PORT=5000

   # Optional: AI Studio Integration
   GEMINI_API_KEY=your_api_key_here
   ```

### Running Locally

Launch both the frontend and backend with a single command:
```bash
npm run dev
```

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000](http://localhost:5000) (Proxied via `/api`)

## 🏗️ Architecture

- **Client-Side Routing**: The app toggles between `ProfileSelector` and `DecisionWorkspace`.
- **API Proxying**: Vite is configured to proxy `/api` requests to the Express server, avoiding CORS issues during development.
- **Data Persistence**: 
  - `GET /api/profiles`: Fetch all saved decisions.
  - `POST /api/profiles`: Create from template.
  - `PUT /api/profiles/:id`: Auto-save changes (debounced).
  - `DELETE /api/profiles/:id`: Permanent removal.

## 🤝 Contributing

Feel free to open issues or submit pull requests to improve the decision-making logic or UI!

---
<div align="center">
Made with ❤️ for better decisions.
</div>
