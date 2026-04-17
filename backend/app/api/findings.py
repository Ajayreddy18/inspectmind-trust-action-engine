from fastapi import APIRouter
from pydantic import BaseModel
from app.models.finding import Finding
from app.services.clustering import cluster_findings
from app.services.trust_score import calculate_trust_score
from app.services.action_ranker import rank_clusters
from app.services.feedback_memory import store_feedback
from app.services.agents import run_multi_agent_reasoning
from app.services.trend_memory import update_trends, get_trends

router = APIRouter()


class FeedbackRequest(BaseModel):
    cluster_id: str
    feedback: str


@router.post("/triage")
def triage(findings: list[Finding]):
    clusters = cluster_findings(findings)

    for cluster in clusters:
        cluster["trust_score"] = calculate_trust_score(cluster)
        cluster["root_cause"] = run_multi_agent_reasoning(cluster)
        cluster["next_action"] = "Needs architect review"

    ranked = rank_clusters(clusters)

    update_trends(ranked)

    return {
        "raw_findings": len(findings),
        "root_actions": len(ranked),
        "clusters": ranked[:10]
    }


@router.post("/feedback")
def feedback(payload: FeedbackRequest):
    store_feedback(payload.cluster_id, payload.feedback)

    return {
        "status": "saved",
        "cluster_id": payload.cluster_id,
        "feedback": payload.feedback
    }

@router.get("/trends")
def trends():
    return get_trends()