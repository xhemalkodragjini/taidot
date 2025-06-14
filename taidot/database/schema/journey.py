from pydantic import BaseModel
from typing import Literal, List, Optional

class AdmissionPipelineStep(BaseModel):
    description: str
    completed: bool = False

class Requirements(BaseModel):
    admission_requirements: List[str] = []
    application_procedure: str = ""
    deadline: str = ""
    pipeline: List[AdmissionPipelineStep] = []

class University(BaseModel):
    name: str
    country: str

class Program(BaseModel):
    title: str
    level: Literal['BSc', 'MSc', 'PhD']
    requirements: Requirements  


class Journey(BaseModel):
    university: University
    program: Program


__all__ = ["Requirements", "University", "Program", "Journey", "AdmissionPipelineStep"]