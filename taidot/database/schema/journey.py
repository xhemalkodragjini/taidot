from pydantic import BaseModel
from typing import  Literal

class Requirements(BaseModel):
    ...

class University(BaseModel):
    name: str
    country: str

class Program(BaseModel):
    title: str
    level: Literal['BSc', 'MSc']
    requirements: Requirements  


class Journey(BaseModel):
    university: University
    program: Program


__all__ = ["Requirements", "University", "Program", "Journey"]