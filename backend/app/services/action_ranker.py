def rank_clusters(clusters):
    severity_weight = {
        "fire_door_mismatch": 1.0,
        "wall_thickness_conflict": 0.9,
        "missing_reference": 0.7,
    }

    for cluster in clusters:
        issue = cluster["representative"].issue_type

        cluster["priority_score"] = round(
            cluster["trust_score"] * severity_weight.get(issue, 0.6),
            2
        )

    return sorted(
        clusters,
        key=lambda x: x["priority_score"],
        reverse=True
    )