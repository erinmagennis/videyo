const quests = {
  signal: {
    number: "01",
    title: "Signal",
    scene: "Scene 01",
    prompt: "A distant signal appears across a silent ocean of glass.",
    message: "The opening already has scale. Keep the sound small so the world feels even larger.",
  },
  arrival: {
    number: "02",
    title: "Arrival",
    scene: "Scene 03",
    prompt: "The traveler reaches the shore and sees their reflection move first.",
    message: "The mirror motif starts here. It can return later as a choice, not only an image.",
  },
  turn: {
    number: "03",
    title: "The turn",
    scene: "Scene 06",
    prompt: "A glass horizon bends as the traveler chooses a new path.",
    message: "This beat changes the direction of the whole piece. The unused mirror idea from Arrival could make the choice feel inevitable.",
  },
  reveal: {
    number: "04",
    title: "Reveal",
    scene: "Scene 09",
    prompt: "The ocean lifts into the sky and reveals the city underneath.",
    message: "This is the visual promise. The glass tone from Scene 03 can arrive half a second before the image changes.",
  },
  return: {
    number: "05",
    title: "Return",
    scene: "Scene 12",
    prompt: "The traveler returns carrying a small piece of the impossible ocean.",
    message: "Bring one shape from the Signal back here. The ending will feel earned without explaining it.",
  },
};

let selectedKey = "turn";
let liveMode = false;

const $ = (selector) => document.querySelector(selector);
const all = (selector) => [...document.querySelectorAll(selector)];

function selectQuest(key) {
  const quest = quests[key];
  if (!quest) return;
  selectedKey = key;
  all(".quest").forEach((button) => {
    const active = button.dataset.node === key;
    button.classList.toggle("active", active);
    active ? button.setAttribute("aria-current", "step") : button.removeAttribute("aria-current");
  });
  $("#selected-label").textContent = `${quest.title.toUpperCase()} · ${quest.scene.toUpperCase()}`;
  $("#stage-prompt").textContent = quest.prompt;
  $("#yo-title").textContent = `Pointed at: ${quest.title}`;
  $("#yo-message").textContent = quest.message;
  $("#stage-status").textContent = "READY FOR A NEW VERSION";
}

async function generateQuest() {
  const button = $("#generate-button");
  const stage = $("#stage-media");
  const quest = quests[selectedKey];
  button.disabled = true;
  button.textContent = "Building this version";
  stage.classList.add("is-loading");
  $("#stage-status").textContent = "GENBLAZE RUNNING";

  try {
    const response = await fetch("/api/pipeline", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ prompt: `${quest.prompt} Story beat: ${quest.title}.`, mode: liveMode ? "live" : "demo" }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) throw new Error(payload.error || "The pipeline did not complete.");
    const result = payload.result;
    stage.style.backgroundImage = `url("${result.asset_url}")`;
    stage.style.backgroundSize = "cover";
    stage.style.backgroundPosition = "center";
    $("#record-summary").textContent = `${quest.title} · ${result.mode} run verified`;
    $("#record-provider").textContent = `${result.provider} · ${result.model}`;
    $("#record-asset").textContent = shortHash(result.asset_sha256);
    $("#record-manifest").textContent = result.manifest_verified ? shortHash(result.manifest_hash) : "Verification failed";
    $("#record-storage").textContent = result.storage;
    $("#stage-status").textContent = "NEW VERSION READY";
    showToast("New version ready. The previous version is preserved.");
  } catch (error) {
    $("#stage-status").textContent = "RUN STOPPED SAFELY";
    showToast(error.message);
  } finally {
    button.disabled = false;
    button.textContent = "Regenerate this quest";
    stage.classList.remove("is-loading");
  }
}

function shortHash(value) {
  if (!value || value.length < 16) return value || "Pending";
  return `${value.slice(0, 8)}…${value.slice(-6)}`;
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 3200);
}

all(".quest").forEach((button) => button.addEventListener("click", () => selectQuest(button.dataset.node)));
all("[data-memory]").forEach((button) => button.addEventListener("click", () => {
  $("#yo-input").value = `What about the ${button.firstChild.textContent.trim().toLowerCase()} here?`;
  $("#yo-input").focus();
}));

$("#mode-button").addEventListener("click", (event) => {
  liveMode = !liveMode;
  event.currentTarget.setAttribute("aria-pressed", String(liveMode));
  event.currentTarget.textContent = liveMode ? "Live generation" : "Demonstration mode";
  showToast(liveMode ? "Live mode uses configured paid services." : "Demonstration mode makes no paid calls.");
});

$("#generate-button").addEventListener("click", generateQuest);
$("#keep-button").addEventListener("click", () => showToast("Current version kept. The next quest is ready when you are."));
$("#yo-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = $("#yo-input");
  if (!input.value.trim()) return;
  $("#yo-message").textContent = `I’m looking at ${quests[selectedKey].title}. That question connects to the mirror motif and the choice note. I’d test the mirror first.`;
  input.value = "";
});

selectQuest(selectedKey);
