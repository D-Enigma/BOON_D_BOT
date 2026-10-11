const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const chatLog = document.getElementById("chatLog");
const sosDialog = document.getElementById("sosDialog");
const sosResult = document.getElementById("sosResult");
let lastLocation = null;

function addMessage(text, who = "bot") {
  const row = document.createElement("div");
  row.className = who === "user" ? "message user-message" : "message bot-message";
  if (who === "user") {
    const body = document.createElement("div");
    body.className = "message-body";
    body.textContent = text;
    row.appendChild(body);
  } else {
    const avatar = document.createElement("div");
    avatar.className = "avatar";
    avatar.textContent = "B";
    const content = document.createElement("div");
    const label = document.createElement("small");
    label.textContent = "BDB · DEMO ASSISTANT";
    const p = document.createElement("p");
    p.textContent = text;
    content.append(label, p);
    row.append(avatar, content);
  }
  chatLog.appendChild(row);
  chatLog.scrollTop = chatLog.scrollHeight;
}

async function sendChat(message) {
  const clean = message.trim();
  if (!clean) return;
  addMessage(clean, "user");
  chatInput.value = "";
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({message: clean})
    });
    const data = await res.json();
    addMessage(data.reply || "I couldn't process that message. If there is immediate danger, contact local emergency services directly.");
  } catch {
    addMessage("The demo backend could not be reached. If there is immediate danger, contact local emergency services directly.");
  }
}

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  sendChat(chatInput.value);
});

document.querySelectorAll("[data-prompt]").forEach((button) => {
  button.addEventListener("click", () => sendChat(button.dataset.prompt));
});

document.getElementById("sosButton").addEventListener("click", () => {
  sosResult.classList.remove("show");
  sosResult.textContent = "";
  document.getElementById("confirmSos").disabled = false;
  sosDialog.showModal();
});

document.getElementById("cancelSos").addEventListener("click", () => sosDialog.close());

document.getElementById("confirmSos").addEventListener("click", async () => {
  const button = document.getElementById("confirmSos");
  button.disabled = true;
  try {
    const res = await fetch("/api/sos-demo", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({confirmed: true, location: lastLocation})
    });
    const data = await res.json();
    sosResult.textContent = data.message || "Demo event recorded.";
  } catch {
    sosResult.textContent = "Could not reach the demo backend. No real alert was sent.";
  }
  sosResult.classList.add("show");
});

document.getElementById("locationButton").addEventListener("click", () => {
  const output = document.getElementById("locationText");
  if (!navigator.geolocation) {
    output.textContent = "This browser does not support geolocation.";
    return;
  }
  output.textContent = "Requesting location permission…";
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      lastLocation = {
        latitude: Number(pos.coords.latitude.toFixed(5)),
        longitude: Number(pos.coords.longitude.toFixed(5)),
        accuracy_m: Math.round(pos.coords.accuracy),
        captured_at: new Date().toISOString()
      };
      output.textContent = `${lastLocation.latitude}, ${lastLocation.longitude} (±${lastLocation.accuracy_m} m)`;
    },
    (err) => {
      const messages = {
        1: "Location permission denied. You can still explore the demo.",
        2: "Location unavailable. Try again in a place with a better signal.",
        3: "Location request timed out. Try again."
      };
      output.textContent = messages[err.code] || "Could not obtain location.";
    },
    {enableHighAccuracy: true, timeout: 12000, maximumAge: 30000}
  );
});

async function loadServices() {
  const list = document.getElementById("serviceList");
  try {
    const res = await fetch("/api/services");
    const data = await res.json();
    list.textContent = "";
    const symbols = {"Hospital": "＋", "Police": "◇", "Rescue": "⌁"};
    data.services.forEach((service) => {
      const item = document.createElement("div");
      item.className = "service-item";
      const symbol = document.createElement("div");
      symbol.className = "service-symbol";
      symbol.textContent = symbols[service.category] || "⌖";
      const info = document.createElement("div");
      info.className = "service-info";
      const name = document.createElement("strong");
      name.textContent = service.name;
      const meta = document.createElement("small");
      meta.textContent = `${service.category} · ${service.area}`;
      info.append(name, meta);
      const badge = document.createElement("span");
      badge.className = "service-status";
      badge.textContent = "SAMPLE";
      item.append(symbol, info, badge);
      list.appendChild(item);
    });
  } catch {
    list.textContent = "Could not load sample resources.";
  }
}
loadServices();
