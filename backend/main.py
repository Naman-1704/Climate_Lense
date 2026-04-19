"""
ClimateLens — FastAPI Backend
Database: SQLite via SQLAlchemy
Run: uvicorn main:app --reload --port 8000
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List, Optional
import models, schemas, crud
from database import SessionLocal, engine, Base
from seed import seed_data
import os

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ClimateLens API",
    description="Backend API for ClimateLens – Climate Impact Explainer",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.on_event("startup")
def startup_event():
    db = SessionLocal()
    try:
        if db.query(models.Article).count() == 0:
            seed_data(db)
    finally:
        db.close()

# ── Articles ──────────────────────────────────

@app.get("/api/articles", response_model=List[schemas.ArticleOut])
def list_articles(category: Optional[str] = None, search: Optional[str] = None, db: Session = Depends(get_db)):
    return crud.get_articles(db, category=category, search=search)

@app.get("/api/articles/featured", response_model=schemas.ArticleOut)
def get_featured(db: Session = Depends(get_db)):
    article = crud.get_featured_article(db)
    if not article:
        raise HTTPException(404, "No featured article")
    return article

@app.get("/api/articles/{article_id}", response_model=schemas.ArticleOut)
def get_article(article_id: int, db: Session = Depends(get_db)):
    a = crud.get_article(db, article_id)
    if not a:
        raise HTTPException(404, "Article not found")
    return a

@app.post("/api/articles", response_model=schemas.ArticleOut, status_code=201)
def create_article(article: schemas.ArticleCreate, db: Session = Depends(get_db)):
    return crud.create_article(db, article)

@app.put("/api/articles/{article_id}", response_model=schemas.ArticleOut)
def update_article(article_id: int, article: schemas.ArticleCreate, db: Session = Depends(get_db)):
    updated = crud.update_article(db, article_id, article)
    if not updated:
        raise HTTPException(404, "Article not found")
    return updated

@app.delete("/api/articles/{article_id}")
def delete_article(article_id: int, db: Session = Depends(get_db)):
    if not crud.delete_article(db, article_id):
        raise HTTPException(404, "Article not found")
    return {"message": "Deleted"}

@app.patch("/api/articles/{article_id}/feature", response_model=schemas.ArticleOut)
def feature_article(article_id: int, db: Session = Depends(get_db)):
    a = crud.set_featured(db, article_id)
    if not a:
        raise HTTPException(404, "Article not found")
    return a

# ── Stats ─────────────────────────────────────

@app.get("/api/stats")
def get_stats(db: Session = Depends(get_db)):
    return crud.get_stats(db)

# ── Auth ──────────────────────────────────────

@app.post("/api/auth/login")
def login(credentials: schemas.LoginRequest):
    if credentials.username == "admin" and credentials.password == "admin123":
        return {"token": "climatelens-admin-2025", "message": "Login successful"}
    raise HTTPException(401, "Invalid credentials")

# ── Serve Frontend ────────────────────────────

frontend_path = os.path.join(os.path.dirname(__file__), "..", "frontend")
if os.path.exists(os.path.join(frontend_path, "static")):
    app.mount("/static", StaticFiles(directory=os.path.join(frontend_path, "static")), name="static")

@app.get("/", include_in_schema=False)
@app.get("/{full_path:path}", include_in_schema=False)
def serve_frontend(full_path: str = ""):
    index = os.path.join(frontend_path, "index.html")
    if os.path.exists(index):
        return FileResponse(index)
    return {"message": "ClimateLens API — visit /docs"}
