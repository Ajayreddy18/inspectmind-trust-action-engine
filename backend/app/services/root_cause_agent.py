def infer_root_cause(cluster):
    issue = cluster["representative"].issue_type

    if issue == "fire_door_mismatch":
        return (
            "Door schedule revision was updated "
            "but architectural tag remained stale."
        )

    if issue == "wall_thickness_conflict":
        return (
            "Structural revision not propagated "
            "to architectural wall schedule."
        )

    return "Cross-sheet inconsistency requires discipline review."