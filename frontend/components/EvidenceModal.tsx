"use client"

export default function EvidenceModal({ cluster }: { cluster: any }) {
  const rep = cluster.representative

  async function sendFeedback(type: string) {
    await fetch("http://localhost:8000/api/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        cluster_id: cluster.cluster_id,
        feedback: type
      })
    })
  }

  return (
    <div className="rounded-2xl border p-6 bg-gray-50 shadow-sm">
      <h2 className="font-semibold text-xl mb-4">
        Visual Evidence & Root Cause
      </h2>

      <p className="mb-4">{cluster.root_cause}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {rep.evidence_regions?.map((region: string, index: number) => (
          <div
            key={index}
            className="rounded-xl border bg-white p-4 shadow-sm"
          >
            <p className="font-medium mb-2">
              Evidence Region {index + 1}
            </p>

            <div className="h-32 rounded-lg border-2 border-dashed flex items-center justify-center text-xs text-gray-500">
              {region}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-white p-4 border mb-4">
        <strong>Suggested action:</strong> {cluster.next_action}
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => sendFeedback("confirmed")}
          className="px-4 py-2 rounded-lg border bg-white"
        >
          👍 Confirm
        </button>

        <button
          onClick={() => sendFeedback("false_positive")}
          className="px-4 py-2 rounded-lg border bg-white"
        >
          👎 False Positive
        </button>
      </div>
    </div>
  )
}