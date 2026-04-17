from pydantic import BaseModel
from typing import List


class Finding(BaseModel):
    id: str
    issue_type: str
    sheet: str
    discipline: str
    text: str
    cv_confidence: float
    evidence_regions: List[str]