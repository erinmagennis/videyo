let graphNodes = [...document.querySelectorAll(".graph-node")];
const graphCanvas = document.querySelector("#graph-canvas");
let graphLines = [...document.querySelectorAll("#graph-lines line[data-from]")];
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

const extraGraphNodes = [
  ["scene-01", "Signal", "Scene", 6, 10, 7, 18, "01", "Scene 01: Mira finds the signal under the glass horizon."],
  ["scene-02", "The map", "Scene", 17, 8, 17, 15, "02", "Scene 02: The map redraws itself while Mira is watching."],
  ["scene-03", "Glass shore", "Scene", 31, 14, 28, 20, "03", "Scene 03: Iris appears at the Glass Shore."],
  ["scene-04", "Archive", "Scene", 7, 53, 35, 25, "04", "Scene 04: Mira finds the first record of the other world."],
  ["scene-05", "Reflection", "Scene", 29, 58, 44, 30, "05", "Scene 05: A reflection becomes evidence instead of a warning."],
  ["scene-06", "The turn", "Scene", 37, 37, 56, 36, "06", "Scene 06: Mira and Iris disagree about which world is real."],
  ["scene-07", "City below", "Scene", 12, 70, 68, 43, "07", "Scene 07: The City Below opens beneath the ocean."],
  ["scene-08", "Return", "Scene", 30, 76, 80, 50, "08", "Scene 08: The signal returns with a different meaning."],
  ["signal", "Signal", "Idea", 10, 18, 18, 26, "01", "The signal arrives before Mira understands what it wants."],
  ["map", "The map", "Idea", 42, 18, 38, 24, "02", "The map redraws itself when Iris enters the frame."],
  ["archive", "Archive room", "Location", 10, 70, 18, 72, "04", "The archive holds the first record of the other world."],
  ["reflection", "Reflection", "Idea", 61, 20, 58, 28, "05", "A reflection becomes evidence instead of a warning."],
  ["threshold", "The threshold", "Scene", 82, 64, 82, 54, "07", "Mira chooses which world gets to continue."],
  ["undertow", "Undertow", "Motif", 56, 78, 58, 80, "08", "The ocean keeps the memory of every discarded version."],
  ["beacon", "Beacon field", "Location", 90, 22, 90, 22, "09", "The final signal points back to the beginning."]
];

function buildDynamicGraph() {
  const svg = document.querySelector("#graph-lines");
  extraGraphNodes.forEach(([id, label, type, graphX, graphY, storyX, storyY, scene, note]) => {
    const node = document.createElement("button");
    const isScenePreview = id.startsWith("scene-");
    node.className = `graph-node ${type.toLowerCase()}${isScenePreview ? " scene-preview" : ""}`;
    node.dataset.id = id;
    node.dataset.type = type;
    node.dataset.graphX = graphX;
    node.dataset.graphY = graphY;
    node.dataset.storyX = storyX;
    node.dataset.storyY = storyY;
    node.dataset.scene = scene;
    node.dataset.note = note;
    node.type = "button";
    node.innerHTML = isScenePreview
      ? `<span class="node-orb"><i></i></span><strong>${scene}</strong><small>${label}</small>`
      : `<span class="node-orb">·</span><strong>${label}</strong><small>${type} · Scene ${scene}</small>`;
    graphCanvas.insertBefore(node, document.querySelector(".yo-floater"));
  });
  const edges = [
    ["mira", "scene-01", 2], ["mira", "scene-02", 2], ["mira", "scene-03", 2], ["mira", "scene-04", 2],
    ["mira", "scene-05", 2], ["mira", "scene-06", 3], ["mira", "scene-07", 2], ["mira", "scene-08", 2],
    ["signal", "mira", 3], ["signal", "map", 2], ["map", "iris", 3], ["map", "mirror", 2],
    ["archive", "shore", 2], ["archive", "reflection", 2], ["reflection", "iris", 3],
    ["reflection", "threshold", 2], ["threshold", "turn", 3], ["threshold", "undertow", 2],
    ["undertow", "shore", 2], ["undertow", "return", 2], ["beacon", "iris", 2], ["beacon", "return", 1]
  ];
  edges.forEach(([from, to, weight]) => {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.dataset.from = from;
    line.dataset.to = to;
    line.dataset.weight = weight;
    svg.insertBefore(line, document.querySelector("#yo-tether"));
  });
  graphNodes = [...document.querySelectorAll(".graph-node")];
  graphLines = [...document.querySelectorAll("#graph-lines line[data-from]")];
  graphNodes.forEach((node) => node.addEventListener("click", () => selectNode(node.dataset.id)));
}

const nodeNotes = {
  mira: "Mira maps what exists. Iris maps what might. They share six scenes, but only disagree in one.",
  iris: "Iris appears whenever Mira avoids a choice. Four of those appearances happen at the Glass Shore.",
  shore: "The Glass Shore holds three scenes and both characters. It is where the mirror motif first becomes part of the plot.",
  mirror: "The mirror starts as an image, becomes a choice in Scene 06, and returns as proof in the ending.",
  turn: "This is the only scene where Mira and Iris disagree. Changing it will affect the Reveal and Return quests.",
  city: "The City Below appears twice. Iris knows it before Mira does, which makes the Reveal feel earned.",
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
  const note = nodeNotes[id] || node.dataset.note || "This dot is part of the living story. Ask Yo what it changes next.";
  yoThread.innerHTML = `<p>${note}</p>`;
  const scene = node.dataset.scene || ({ mira: "03", iris: "05", shore: "03", mirror: "06", turn: "06", city: "07", return: "09" }[id] || "06");
  document.querySelector("#selected-label").textContent = `SCENE ${scene} · ${node.querySelector("strong").textContent.toUpperCase()}`;
  document.querySelector("#stage-prompt").textContent = note;
  persistProject();
  moveYo(id);
}

function persistProject() {
  const state = { selectedNode, graphMode, nodes: graphNodes.map((node) => ({ id: node.dataset.id, label: node.querySelector("strong").textContent, type: node.dataset.type })) };
  window.localStorage.setItem("videyo-project", JSON.stringify(state));
}

function addDot() {
  const label = window.prompt("Name this idea, character, scene, or place:", "New idea");
  if (!label || !label.trim()) return;
  const id = `custom-${Date.now()}`;
  const node = document.createElement("button");
  node.className = "graph-node idea";
  node.dataset.id = id;
  node.dataset.type = "Idea";
  node.dataset.graphX = 48 + Math.round(Math.random() * 18);
  node.dataset.graphY = 32 + Math.round(Math.random() * 34);
  node.dataset.storyX = 50 + Math.round(Math.random() * 20);
  node.dataset.storyY = 44 + Math.round(Math.random() * 28);
  node.dataset.scene = "new";
  node.dataset.note = `${label.trim()} is now part of the story world. Ask Yo where it belongs.`;
  node.type = "button";
  node.innerHTML = `<span class="node-orb">·</span><strong>${label.trim()}</strong><small>Idea · new thread</small>`;
  graphCanvas.insertBefore(node, yoFloater);
  const nearest = graphNodes.find((item) => item.dataset.id === selectedNode) || graphNodes[0];
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.dataset.from = id;
  line.dataset.to = nearest.dataset.id;
  line.dataset.weight = "2";
  document.querySelector("#graph-lines").insertBefore(line, yoTether);
  graphNodes = [...document.querySelectorAll(".graph-node")];
  graphLines = [...document.querySelectorAll("#graph-lines line[data-from]")];
  node.addEventListener("click", () => selectNode(id));
  positionGraph();
  selectNode(id);
  showToast(`${label.trim()} joined the graph.`);
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
      body: JSON.stringify({ prompt: `${prompt} Preserve Mira, Iris, and the mirror motif.`, mode: liveMode ? "live" : "demo" }),
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

buildDynamicGraph();
document.querySelector("#add-node-button").addEventListener("click", addDot);
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
