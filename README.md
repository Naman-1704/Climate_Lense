# 🌿 ClimateLens — Full Stack Setup Guide

## Project by: Ovee Wakchaure, Naman Gandhi, Avani Mahendrakar, Krishi Mudaliar

---

## 📁 Project Structure

```
climatelens/
│
├── backend/
│   ├── main.py          ← FastAPI app (routes, startup)
│   ├── database.py      ← SQLite + SQLAlchemy engine
│   ├── models.py        ← ORM table definitions
│   ├── schemas.py       ← Pydantic request/response models
│   ├── crud.py          ← All database operations
│   ├── seed.py          ← Sample data (auto-loaded on first run)
│   ├── requirements.txt ← Python dependencies
│   └── climatelens.db   ← SQLite DB file (auto-created)
│
└── frontend/
    ├── index.html                ← Main HTML shell (SPA)
    └── static/
        ├── css/
        │   └── main.css          ← All styles
        └── js/
            ├── api.js            ← API fetch layer
            ├── render.js         ← HTML generation helpers
            └── app.js            ← Router, admin, interactions
```

---

## ⚙️ Prerequisites

- **Python 3.9+** — [download](https://www.python.org/downloads/)
- A terminal (Command Prompt, PowerShell, or bash)

That's it! No Node.js, no Docker needed.

---

## 🚀 Step-by-Step Setup

### Step 1 — Open a terminal in the project folder

```bash
cd climatelens
```

### Step 2 — Create a Python virtual environment

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Mac / Linux
python3 -m venv venv
source venv/bin/activate
```

You should see `(venv)` appear at the start of your terminal line.

### Step 3 — Install dependencies

```bash
cd backend
pip install -r requirements.txt
```

This installs FastAPI, Uvicorn, SQLAlchemy, and Pydantic.

### Step 4 — Start the server

```bash
uvicorn main:app --reload --port 8000
```

You will see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     [ClimateLens] Seeded 6 articles into the database.
```

The `--reload` flag means the server auto-restarts when you edit Python files.

### Step 5 — Open the website

Open your browser and go to:

```
http://127.0.0.1:8000
```

🎉 **ClimateLens is live!**

---

## 🗝️ Admin Panel

- URL: Click **Admin** in the navbar
- Username: `admin`
- Password: `admin123`

Features:
- ➕ Add new articles with full analysis
- ✏️ Edit existing articles
- 🗑️ Delete articles
- ★ Set any article as "Featured"

---

## 🔌 API Reference

The API is auto-documented at: `http://127.0.0.1:8000/docs`

| Method | Endpoint                         | Description           |
|--------|----------------------------------|-----------------------|
| GET    | `/api/articles`                  | List all articles     |
| GET    | `/api/articles?category=flood`   | Filter by category    |
| GET    | `/api/articles?search=kerala`    | Search articles       |
| GET    | `/api/articles/featured`         | Get featured article  |
| GET    | `/api/articles/{id}`             | Get one article       |
| POST   | `/api/articles`                  | Create article        |
| PUT    | `/api/articles/{id}`             | Update article        |
| DELETE | `/api/articles/{id}`             | Delete article        |
| PATCH  | `/api/articles/{id}/feature`     | Set as featured       |
| GET    | `/api/stats`                     | Dashboard statistics  |
| POST   | `/api/auth/login`                | Admin login           |

---

## 🛠️ Development Tips

### View the SQLite database
Install [DB Browser for SQLite](https://sqlitebrowser.org/) and open `backend/climatelens.db` to inspect tables visually.

### Reset the database
```bash
# Inside backend/
rm climatelens.db
# Restart the server — it will re-seed automatically
uvicorn main:app --reload --port 8000
```

### Change admin credentials
Edit `backend/main.py`, find the `/api/auth/login` route and change:
```python
if credentials.username == "admin" and credentials.password == "admin123":
```

### Run on a different port
```bash
uvicorn main:app --reload --port 5000
```
Then update `API_BASE` in `frontend/static/js/api.js` accordingly.

---

## 🏗️ Tech Stack

| Layer      | Technology           |
|------------|----------------------|
| Frontend   | HTML5, CSS3 (custom), Vanilla JS |
| Backend    | Python + FastAPI     |
| Database   | SQLite + SQLAlchemy  |
| API Server | Uvicorn (ASGI)       |
| Fonts      | Cormorant Garamond, Syne, JetBrains Mono |

---

## 📊 Database Schema

**Table: `articles`**

| Column      | Type     | Description                        |
|-------------|----------|------------------------------------|
| id          | INTEGER  | Primary key, auto-increment        |
| title       | VARCHAR  | Article headline                   |
| category    | VARCHAR  | flood/heatwave/pollution/etc.      |
| impact      | VARCHAR  | high/med/low                       |
| description | TEXT     | Short summary (shown on cards)     |
| body        | TEXT     | Full article content               |
| env_impact  | TEXT     | Environmental analysis section     |
| ethics      | TEXT     | Ethical perspective section        |
| actions     | TEXT     | Suggested actions (newline-sep.)   |
| emoji       | VARCHAR  | Display emoji (e.g. 🌊)            |
| color       | VARCHAR  | Hex color for card background      |
| featured    | BOOLEAN  | Whether article is featured        |
| date_added  | DATETIME | Auto-set on creation               |

---

## 🔧 Troubleshooting

**"No module named fastapi"**
→ Make sure your virtual environment is activated: `venv\Scripts\activate` (Windows) or `source venv/bin/activate` (Mac/Linux)

**"Address already in use"**
→ Another process is using port 8000. Try: `uvicorn main:app --reload --port 8001`

**"CORS error" in browser console**
→ Make sure you're accessing via `http://127.0.0.1:8000`, not `file://`

**Blank page / articles not loading**
→ Check that the backend is running. Open `http://127.0.0.1:8000/api/articles` in browser — you should see JSON.

---

*Built with 🌿 for climate awareness*
