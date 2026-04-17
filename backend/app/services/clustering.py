from collections import defaultdict


def cluster_findings(findings):
    clusters = defaultdict(list)

    for f in findings:
        key = f.issue_type + "::" + f.text[:30]
        clusters[key].append(f)

    return [
        {
            "cluster_id": key,
            "raw_count": len(items),
            "items": items,
            "representative": items[0]
        }
        for key, items in clusters.items()
    ]