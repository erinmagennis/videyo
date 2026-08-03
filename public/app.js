const graphNodes = [...document.querySelectorAll(".graph-node")];
const graphCanvas = document.querySelector("#graph-canvas");
const graphLines = [...document.querySelectorAll("#graph-lines line[data-from]")];
const yoTether = document.querySelector("#yo-tether");
const yoFloater = document.querySelector("#yo-floater");
const yoTitle = document.querySelector("#yo-title");
const yoThread = document.querySelector("#yo-thread");
const yoInput = document.querySelector("#yo-input");
const unwindButton = document.querySelector("#unwind-button");
const toast = document.querySelector("#toast");
let selectedNode = "mira";
let graphMode = "graph";
let liveMode = false;
let graphAnimationFrame = null;

const nodeNotes = {
  mira: "Mira maps what exists. Echo maps what might. They share six scenes, but only disagree in one.",
  echo: "Echo appears whenever Mira avoids a choice. Four of those appearances happen at the Glass Shore.",
  shore: "The Glass Shore holds three scenes and both characters. It is where the mirror motif first becomes part of the plot.",
  mirror: "The mirror starts as an image, becomes a choice in Scene 06, and returns as proof in the ending.",
  turn: "This is the only scene where Mira and Echo disagree. Changing it will affect the Reveal and Return quests.",
  city: "The City Below appears twice. Echo knows it before Mira does, which makes the Reveal feel earned.",
  return: "The ending reconnects Mira, the city, and the mirror choice. The opening signal can return here as sound.",
};

function positionGraph() {
  const story = graphMode === "story";
  graphNodes.forEach((node) => {
    node.style.left = `${node.dataset[story ? "storyX" : "graphX"]}%`;
    node.style.top = `${node.dataset[story ? "storyY" : "graphY"]}%`;
  });
  followMovingNodes(story ? 900 : 80);
  window.setTimeout(() => moveYo(selectedNode), story ? 860 : 40);
}

function followMovingNodes(duration) {
  if (graphAnimationFrame !== null) window.cancelAnimationFrame(graphAnimationFrame);
  const startedAt = performance.now();
  function drawFrame(now) {
    updateLines();
    if (now - startedAt < duration) {
      graphAnimationFrame = window.requestAnimationFrame(drawFrame);
    } else {
      graphAnimationFrame = null;
      updateLines();
    }
  }
  graphAnimationFrame = window.requestAnimationFrame(drawFrame);
}

function updateLines() {
  const canvasBox = graphCanvas.getBoundingClientRect();
  graphLines.forEach((line) => {
    const from = document.querySelector(`[data-id="${line.dataset.from}"] .node-orb`).getBoundingClientRect();
    const to = document.querySelector(`[data-id="${line.dataset.to}"] .node-orb`).getBoundingClientRect();
    line.setAttribute("x1", from.left + from.width / 2 - canvasBox.left);
    line.setAttribute("y1", from.top + from.height / 2 - canvasBox.top);
    line.setAttribute("x2", to.left + to.width / 2 - canvasBox.left);
    line.setAttribute("y2", to.top + to.height / 2 - canvasBox.top);
  });
  updateYoPosition(canvasBox);
}

function updateYoPosition(canvasBox = graphCanvas.getBoundingClientRect()) {
  const orb = document.querySelector(`[data-id="${selectedNode}"] .node-orb`).getBoundingClientRect();
  const nodeX = orb.left + orb.width / 2 - canvasBox.left;
  const nodeY = orb.top + orb.height / 2 - canvasBox.top;
  const chatWidth = yoFloater.offsetWidth;
  const chatHeight = yoFloater.offsetHeight;
  const placeRight = nodeX < canvasBox.width * 0.55;
  const left = Math.max(16, Math.min(canvasBox.width - chatWidth - 16, placeRight ? nodeX + 82 : nodeX - chatWidth - 82));
  const top = Math.max(16, Math.min(canvasBox.height - chatHeight - 16, nodeY - chatHeight / 2));
  yoFloater.style.left = `${left}px`;
  yoFloater.style.top = `${top}px`;
  yoTether.setAttribute("x1", nodeX);
  yoTether.setAttribute("y1", nodeY);
  yoTether.setAttribute("x2", placeRight ? left : left + chatWidth);
  yoTether.setAttribute("y2", top + Math.min(72, chatHeight / 2));
}

function selectNode(id) {
  const node = document.querySelector(`[data-id="${id}"]`);
  if (!node) return;
  selectedNode = id;
  graphNodes.forEach((item) => item.classList.toggle("active", item === node));
  yoTitle.textContent = `Looking at ${node.querySelector("strong").textContent}`;
  yoThread.innerHTML = `<p>${nodeNotes[id]}</p>`;
  moveYo(id);
}

function moveYo(id) {
  const node = document.querySelector(`[data-id="${id}"]`);
  if (!node) return;
  updateYoPosition();
  yoFloater.classList.add("context-change");
  window.setTimeout(() => yoFloater.classList.remove("context-change"), 360);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 3200);
}

function shortHash(value) {
  if (!value || value.length < 16) return value || "Pending";
  return `${value.slice(0, 8)}…${value.slice(-6)}`;
}

async function generateScene() {
  const button = document.querySelector("#generate-button");
  const stage = document.querySelector("#stage-media");
  const prompt = document.querySelector("#stage-prompt").textContent;
  button.disabled = true;
  button.textContent = "Building this version";
  stage.classList.add("is-loading");
  document.querySelector("#stage-status").textContent = "GENBLAZE RUNNING";

  try {
    const response = await fetch("/api/pipeline", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ prompt: `${prompt} Preserve Mira, Echo, and the mirror motif.`, mode: liveMode ? "live" : "demo" }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) throw new Error(payload.error || "The pipeline did not complete.");
    const result = payload.result;
    stage.style.backgroundImage = `url("${result.asset_url}")`;
    stage.style.backgroundSize = "cover";
    stage.style.backgroundPosition = "center";
    document.querySelector("#record-summary").textContent = `The turn · ${result.mode} run verified`;
    document.querySelector("#record-provider").textContent = `${result.provider} · ${result.model}`;
    document.querySelector("#record-asset").textContent = shortHash(result.asset_sha256);
    document.querySelector("#record-manifest").textContent = result.manifest_verified ? shortHash(result.manifest_hash) : "Verification failed";
    document.querySelector("#record-storage").textContent = result.storage;
    document.querySelector("#stage-status").textContent = "NEW VERSION READY";
    showToast("New version ready. The previous version is preserved.");
  } catch (error) {
    document.querySelector("#stage-status").textContent = "RUN STOPPED SAFELY";
    showToast(error.message);
  } finally {
    button.disabled = false;
    button.textContent = "Regenerate this scene";
    stage.classList.remove("is-loading");
  }
}

graphNodes.forEach((node) => node.addEventListener("click", () => selectNode(node.dataset.id)));
unwindButton.addEventListener("click", () => {
  graphMode = graphMode === "graph" ? "story" : "graph";
  graphCanvas.classList.toggle("story-mode", graphMode === "story");
  unwindButton.setAttribute("aria-pressed", String(graphMode === "story"));
  unwindButton.textContent = graphMode === "story" ? "Return to knowledge" : "Unwind into story";
  positionGraph();
});

document.querySelectorAll("[data-focus]").forEach((button) => button.addEventListener("click", () => {
  document.querySelector("#graph-workspace").scrollIntoView({ behavior: "smooth", block: "center" });
  selectNode(button.dataset.focus);
}));

document.querySelectorAll("[data-commentable]").forEach((item) => item.addEventListener("click", () => {
  const isCharacter = item.classList.contains("character-sheet");
  selectNode(isCharacter ? "mira" : "turn");
  yoTitle.textContent = `Looking at ${item.dataset.commentable}`;
  yoInput.focus();
}));

document.querySelector("#yo-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const comment = yoInput.value.trim();
  if (!comment) return;
  const user = document.createElement("p");
  user.className = "user-comment";
  user.textContent = comment;
  const reply = document.createElement("p");
  reply.className = "yo-reply";
  reply.textContent = `I’m with you. That changes ${document.querySelector(`[data-id="${selectedNode}"] strong`).textContent} and connects to the mirror choice. I’d carry it into the next scene, then compare both versions.`;
  yoThread.append(user, reply);
  yoThread.scrollTop = yoThread.scrollHeight;
  yoInput.value = "";
});

document.querySelector("#mode-button").addEventListener("click", (event) => {
  liveMode = !liveMode;
  event.currentTarget.setAttribute("aria-pressed", String(liveMode));
  event.currentTarget.textContent = liveMode ? "Live generation" : "Demonstration mode";
  showToast(liveMode ? "Live mode uses configured paid services." : "Demonstration mode makes no paid calls.");
});

document.querySelector("#generate-button").addEventListener("click", generateScene);
document.querySelector("#keep-button").addEventListener("click", () => showToast("Current version kept. The next scene is ready when you are."));
document.querySelector(".character-action").addEventListener("click", () => selectNode("mira"));
window.addEventListener("resize", () => { updateLines(); moveYo(selectedNode); });

positionGraph();
selectNode(selectedNode);
