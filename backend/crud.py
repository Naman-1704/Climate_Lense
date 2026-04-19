"""
crud.py — Database CRUD operations
"""

from sqlalchemy.orm import Session
from sqlalchemy import or_
import models, schemas
from datetime import datetime


def get_articles(db: Session, category: str = None, search: str = None):
    q = db.query(models.Article)
    if category and category != "all":
        q = q.filter(models.Article.category == category)
    if search:
        term = f"%{search}%"
        q = q.filter(or_(
            models.Article.title.ilike(term),
            models.Article.description.ilike(term),
            models.Article.body.ilike(term)
        ))
    return q.order_by(models.Article.date_added.desc()).all()


def get_featured_article(db: Session):
    a = db.query(models.Article).filter(models.Article.featured == True).first()
    if not a:
        a = db.query(models.Article).order_by(models.Article.date_added.desc()).first()
    return a


def get_article(db: Session, article_id: int):
    return db.query(models.Article).filter(models.Article.id == article_id).first()


def create_article(db: Session, data: schemas.ArticleCreate):
    article = models.Article(**data.dict())
    db.add(article)
    db.commit()
    db.refresh(article)
    return article


def update_article(db: Session, article_id: int, data: schemas.ArticleCreate):
    article = db.query(models.Article).filter(models.Article.id == article_id).first()
    if not article:
        return None
    for key, value in data.dict().items():
        setattr(article, key, value)
    db.commit()
    db.refresh(article)
    return article


def delete_article(db: Session, article_id: int):
    article = db.query(models.Article).filter(models.Article.id == article_id).first()
    if not article:
        return False
    db.delete(article)
    db.commit()
    return True


def set_featured(db: Session, article_id: int):
    # Unfeature all
    db.query(models.Article).update({"featured": False})
    # Feature the chosen one
    article = db.query(models.Article).filter(models.Article.id == article_id).first()
    if not article:
        db.commit()
        return None
    article.featured = True
    db.commit()
    db.refresh(article)
    return article


def get_stats(db: Session):
    from sqlalchemy import func
    total = db.query(models.Article).count()
    by_category = db.query(
        models.Article.category,
        func.count(models.Article.id).label("count")
    ).group_by(models.Article.category).all()
    by_impact = db.query(
        models.Article.impact,
        func.count(models.Article.id).label("count")
    ).group_by(models.Article.impact).all()
    return {
        "total_articles": total,
        "categories": {row.category: row.count for row in by_category},
        "impact_levels": {row.impact: row.count for row in by_impact},
    }
