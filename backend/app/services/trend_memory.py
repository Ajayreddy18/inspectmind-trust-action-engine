trend_store = {}


def update_trends(clusters):
    for cluster in clusters:
        issue = cluster["representative"].issue_type

        if issue not in trend_store:
            trend_store[issue] = {
                "count": 0,
                "avg_trust": 0
            }

        trend_store[issue]["count"] += 1
        previous_avg = trend_store[issue]["avg_trust"]

        trend_store[issue]["avg_trust"] = round(
            (previous_avg + cluster["trust_score"]) / 2,
            2
        )


def get_trends():
    return trend_store