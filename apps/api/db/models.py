import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, JSON
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class Evidence(Base):
    __tablename__ = 'evidence'

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    investigation_id = Column(String, nullable=True)
    category = Column(String, nullable=False)
    source_id = Column(String, nullable=True)
    first_seen = Column(DateTime, default=datetime.utcnow)
    last_seen = Column(DateTime, default=datetime.utcnow)
    last_scan = Column(DateTime, default=datetime.utcnow)
    reliability = Column(Float, default=1.0)
    data = Column(JSON, nullable=True)

class Source(Base):
    __tablename__ = 'sources'
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    source_type = Column(String, nullable=True)
    url = Column(String, nullable=True)
    reliability_score = Column(Float, default=1.0)
    created_at = Column(DateTime, default=datetime.utcnow)

class Investigation(Base):
    __tablename__ = 'investigations'

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    status = Column(String, default='active')
    created_at = Column(DateTime, default=datetime.utcnow)
