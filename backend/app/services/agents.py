def cv_agent(cluster):
    return "Visual mismatch detected across related evidence regions."


def schedule_agent(cluster):
    return "Door schedule and sheet annotation are inconsistent."


def revision_agent(cluster):
    return "Recent sheet revision likely did not propagate to all disciplines."


def risk_agent(cluster):
    if cluster["trust_score"] >= 0.9:
        return "High permit blocker risk."
    return "Moderate review risk."


def run_multi_agent_reasoning(cluster):
    insights = [
        cv_agent(cluster),
        schedule_agent(cluster),
        revision_agent(cluster),
        risk_agent(cluster),
    ]

    return " | ".join(insights)