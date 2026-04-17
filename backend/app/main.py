from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

from app.services.triage import triage_findings, confirm_action

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Finding(BaseModel):
    id: str
    issue_type: str
    sheet: str
    discipline: str
    text: str
    cv_confidence: float
    evidence_regions: List[str]


class ConfirmRequest(BaseModel):
    issue_type: str


@app.post("/api/triage")
def triage(findings: List[Finding]):
    return triage_findings([f.model_dump() for f in findings])


@app.post("/api/confirm")
def confirm(req: ConfirmRequest):
    return confirm_action(req.issue_type)