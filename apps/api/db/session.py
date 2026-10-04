import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from neo4j import GraphDatabase
from core.config import settings
from db.models import Base

logger = logging.getLogger(__name__)

# --- PostgreSQL ---
PG_URL = settings.get_database_url()
engine = create_engine(PG_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    """
    Initializes PostgreSQL tables if they don't already exist.
    Fails gracefully if the database is temporarily unreachable during module initialization.
    """
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("PostgreSQL database tables initialized successfully.")
    except Exception as e:
        logger.warning(f"Database initialization deferred (PostgreSQL unreachable: {e})")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Neo4j ---
try:
    neo4j_driver = GraphDatabase.driver(settings.NEO4J_URI, auth=(settings.NEO4J_USER, settings.NEO4J_PASSWORD))
except Exception as e:
    logger.warning(f"Neo4j driver initialization warning: {e}")
    neo4j_driver = None

def get_neo4j():
    if neo4j_driver is None:
        raise ConnectionError("Neo4j database is not configured or unreachable")
    session = neo4j_driver.session()
    try:
        yield session
    finally:
        session.close()

