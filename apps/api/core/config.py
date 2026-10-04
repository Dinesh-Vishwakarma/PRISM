import os
import urllib.parse
from typing import Optional, List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "PRISM API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Direct database URLs (e.g., Railway injected DATABASE_URL)
    DATABASE_URL: Optional[str] = None
    PG_URL: Optional[str] = None
    
    # Postgres component parameters (with Railway PG* fallbacks)
    POSTGRES_USER: Optional[str] = None
    POSTGRES_PASSWORD: Optional[str] = None
    POSTGRES_DB: Optional[str] = None
    POSTGRES_HOST: Optional[str] = None
    POSTGRES_PORT: Optional[str] = None
    
    PGUSER: Optional[str] = None
    PGPASSWORD: Optional[str] = None
    PGDATABASE: Optional[str] = None
    PGHOST: Optional[str] = None
    PGPORT: Optional[str] = None

    # Neo4j
    NEO4J_URI: str = "bolt://localhost:7687"
    NEO4J_USER: str = "neo4j"
    NEO4J_PASSWORD: str = "prism_password"

    # CORS
    CORS_ORIGINS: str = ""
    
    def get_database_url(self) -> str:
        """
        Resolves the PostgreSQL connection URL with proper driver and encoding.
        Supports DATABASE_URL, PG_URL, or component variables.
        """
        url = self.DATABASE_URL or self.PG_URL
        if url:
            # SQLAlchemy requires 'postgresql://' or 'postgresql+psycopg://' instead of legacy 'postgres://'
            if url.startswith("postgres://"):
                url = "postgresql+psycopg://" + url[len("postgres://"):]
            elif url.startswith("postgresql://") and not url.startswith("postgresql+"):
                url = "postgresql+psycopg://" + url[len("postgresql://"):]
            return url
        
        # Component-based assembly with safe URL encoding
        user = self.POSTGRES_USER or self.PGUSER or "prism_user"
        password = self.POSTGRES_PASSWORD or self.PGPASSWORD or "prism_password"
        host = self.POSTGRES_HOST or self.PGHOST or "localhost"
        port = self.POSTGRES_PORT or self.PGPORT or "5432"
        db = self.POSTGRES_DB or self.PGDATABASE or "prism_db"
        
        safe_user = urllib.parse.quote_plus(user)
        safe_pass = urllib.parse.quote_plus(password)
        return f"postgresql+psycopg://{safe_user}:{safe_pass}@{host}:{port}/{db}"

    @property
    def cors_origin_list(self) -> List[str]:
        origins = [
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            "http://localhost:8000",
        ]
        if self.CORS_ORIGINS:
            for o in self.CORS_ORIGINS.split(","):
                o = o.strip()
                if o and o not in origins:
                    origins.append(o)
        return origins
    
    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8'
        extra = "ignore"

settings = Settings()

