from app.services.feedback_memory import get_feedback_adjustment


def calculate_trust_score(cluster):
    confidences = [item.cv_confidence for item in cluster["items"]]
    avg_cv = sum(confidences) / len(confidences)

    agreement_bonus = min(len(cluster["items"]) * 0.05, 0.2)

    feedback_adjustment = get_feedback_adjustment(
        cluster["cluster_id"]
    )

    final_score = avg_cv + agreement_bonus + feedback_adjustment

    return round(max(min(final_score, 0.99), 0.1), 2)