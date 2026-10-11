from datetime import datetime, timezone
from flask import Flask, jsonify, render_template, request

app = Flask(__name__)

# Demo-only resources. Replace these with verified, maintained data before any real-world use.
DEMO_SERVICES = [
    {
        "id": "demo-hospital-1",
        "name": "Demo District Hospital",
        "category": "Hospital",
        "phone": "DEMO ONLY — not a real contact",
        "area": "Demo City",
        "verified": False,
    },
    {
        "id": "demo-police-1",
        "name": "Demo Police Help Desk",
        "category": "Police",
        "phone": "DEMO ONLY — not a real contact",
        "area": "Demo City",
        "verified": False,
    },
    {
        "id": "demo-rescue-1",
        "name": "Demo Rescue & Disaster Desk",
        "category": "Rescue",
        "phone": "DEMO ONLY — not a real contact",
        "area": "Demo City",
        "verified": False,
    },
]


@app.get("/")
def home():
    return render_template("index.html")


@app.get("/api/health")
def health():
    return jsonify({"status": "ok", "app": "BOON D' BOT", "mode": "demo"})


@app.get("/api/services")
def services():
    return jsonify({"mode": "demo", "services": DEMO_SERVICES})


@app.post("/api/chat")
def chat():
    body = request.get_json(silent=True) or {}
    message = str(body.get("message", "")).strip()

    if not message:
        return jsonify({"reply": "Tell me briefly what is happening.", "mode": "demo"})

    msg = message.lower()
    if any(
        word in msg
        for word in [
            "heart attack",
            "collapsed",
            "unconscious",
            "not breathing",
            "cardiac arrest",
        ]
    ):
        reply = (
            "This may be a life-threatening medical emergency. Contact your local emergency medical service now. "
            "If the person is unresponsive and not breathing normally, follow the emergency dispatcher's instructions "
            "and begin CPR if you are trained or guided to do so. This is demo guidance, not a diagnosis."
        )
    elif any(
        word in msg
        for word in ["landslide", "flood", "avalanche", "earthquake", "storm"]
    ):
        reply = (
            "Move away from immediate danger if you can do so safely, follow official local instructions, and contact "
            "emergency services if anyone is in danger. Do not enter floodwater or cross an unstable slope. "
            "This demo cannot verify current hazards or determine a safe route."
        )
    elif any(word in msg for word in ["lost", "stuck", "stranded", "breakdown", "car"]):
        reply = (
            "First check for immediate danger. If it is safe, stay somewhere visible and protected, share your location "
            "with a trusted person, and contact appropriate roadside or emergency assistance. This demo does not contact "
            "any service and cannot verify your location."
        )
    else:
        reply = (
            "I can help triage a demo scenario involving a medical emergency, road incident, disaster, or being lost. "
            "If there is immediate danger, contact your local emergency service directly. This prototype does not contact authorities."
        )

    return jsonify({"reply": reply, "mode": "demo"})


@app.post("/api/sos-demo")
def sos_demo():
    body = request.get_json(silent=True) or {}
    confirmed = bool(body.get("confirmed"))
    if not confirmed:
        return jsonify(
            {"status": "cancelled", "message": "SOS was not activated."}
        ), 400

    # Deliberately simulation-only: no SMS, calls, emails, or authority notifications are sent.
    event = {
        "status": "simulated",
        "message": "Demo SOS recorded locally for this demonstration. No contacts or authorities were notified.",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "location": body.get("location"),
    }
    app.logger.warning("SIMULATED SOS event: %s", event)
    return jsonify(event)


if __name__ == "__main__":
    app.run(debug=True)
