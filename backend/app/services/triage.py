from collections import defaultdict
from app.services.agents import run_multi_agent_reasoning

# simple in-memory trust memory
feedback_memory = defaultdict(int)


def generate_root_cause(issue_type: str, representative: dict) -> str:
    evidence = representative.get("evidence_regions", [])
    sheet = representative.get("sheet", "unknown sheet")

    if issue_type == "fire_door_mismatch":
        return (
            f"Door specification conflict detected on {sheet}. "
            f"Architectural tag disagrees with fire-rated schedule entry. "
            f"This likely indicates revision propagation failure between sheets. "
            f"Evidence traced from: {', '.join(evidence)}."
        )

    if issue_type == "wall_thickness_conflict":
        return (
            f"Wall thickness mismatch detected on {sheet}. "
            f"Structural dimensions differ from architectural baseline, "
            f"suggesting cross-discipline coordination drift. "
            f"Evidence traced from: {', '.join(evidence)}."
        )

    if issue_type == "beam_alignment_conflict":
        return (
            f"Beam centerline deviation detected on {sheet}. "
            f"This likely stems from reflected ceiling coordination drift."
        )

    if issue_type == "hvac_clearance_violation":
        return (
            f"HVAC maintenance clearance risk detected on {sheet}. "
            f"Likely caused by late structural beam depth revision."
        )

    if issue_type == "sprinkler_head_collision":
        return (
            f"Sprinkler and lighting overlap detected on {sheet}. "
            f"Likely due to unsynced fire protection and reflected ceiling plans."
        )

    return (
        f"Cross-sheet inconsistency detected on {sheet}. "
        f"Evidence: {', '.join(evidence)}."
    )


def triage_findings(findings: list[dict]):
    grouped = defaultdict(list)

    for finding in findings:
        grouped[finding["issue_type"]].append(finding)

    clusters = []

    for idx, (issue_type, items) in enumerate(grouped.items(), start=1):
        representative = items[0]
        avg_confidence = sum(i["cv_confidence"] for i in items) / len(items)

        # 🚀 trust uplift from historical human confirmations
        historical_boost = min(feedback_memory[issue_type] * 0.02, 0.08)

        trust_score = round(min(0.99, avg_confidence + 0.05 + historical_boost), 2)

        priority_score = round(
            trust_score * (1.0 if len(items) > 1 else 0.9),
            2
        )

        cluster = {
            "cluster_id": f"cluster_{idx}",
            "trust_score": trust_score,
            "priority_score": priority_score,
            "raw_count": len(items),
            "next_action": (
                "Escalate permit blocker"
                if priority_score >= 0.9
                else "Needs architect review"
            ),
            "root_cause": generate_root_cause(issue_type, representative),
            "historically_validated": feedback_memory[issue_type] > 0,
            "validation_count": feedback_memory[issue_type],
            "representative": representative,
        }

        clusters.append(cluster)

    clusters.sort(key=lambda x: x["priority_score"], reverse=True)
    return {"clusters": clusters}


def confirm_action(issue_type: str):
    feedback_memory[issue_type] += 1
    return {
        "message": f"{issue_type} confirmation stored",
        "validation_count": feedback_memory[issue_type],
    }