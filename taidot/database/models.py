from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, Table, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker
from sqlalchemy.ext.mutable import MutableDict

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    profile = Column(MutableDict.as_mutable(JSON), default={})
    journeys = relationship('Journey', back_populates='user')

class Journey(Base):
    __tablename__ = 'journeys'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    university = Column(JSON, nullable=False)
    program = Column(JSON, nullable=False)
    completed_steps = Column(JSON, default=list)  # Store completed step indices
    user = relationship('User', back_populates='journeys')

# SQLite for dev, can be changed to PostgreSQL/MySQL
engine = create_engine('sqlite:///taidot.db')
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)
