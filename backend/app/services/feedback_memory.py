feedback_store = {}


def store_feedback(cluster_id: str, feedback: str):
    feedback_store[cluster_id] = feedback


def get_feedback(cluster_id: str):
    return feedback_store.get(cluster_id)


def get_feedback_adjustment(cluster_id: str):
    feedback = feedback_store.get(cluster_id)

    if feedback == "false_positive":
        return -0.15

    if feedback == "confirmed":
        return 0.05

    return 0