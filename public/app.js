let graphNodes = [...document.querySelectorAll(".graph-node")];
const graphCanvas = document.querySelector("#graph-canvas");
let graphLines = [...document.querySelectorAll("#graph-lines line[data-from]")];
const yoTether = document.querySelector("#yo-tether");
const yoFloater = document.querySelector("#yo-floater");
const yoTitle = document.querySelector("#yo-title");
const yoThread = document.querySelector("#yo-thread");
const yoInput = document.querySelector("#yo-input");
const stageVideo = document.querySelector("#stage-video");
const unwindButton = document.querySelector("#unwind-button");
const storyTimeline = document.querySelector("#story-timeline");
const toast = document.querySelector("#toast");
let selectedNode = "mira";
let graphMode = "graph";
let liveMode = false;
let graphAnimationFrame = null;

const extraGraphNodes = [
  ["scene-01", "White House", "Scene", 6, 10, 7, 18, "01", "Scene 01: A breaking-news emergency opens over the White House."],
  ["scene-02", "The bouncer", "Scene", 17, 8, 17, 15, "02", "Scene 02: The camera walks toward a human bouncer, then pivots away."],
  ["scene-03", "Dumpster senate", "Scene", 31, 14, 28, 20, "03", "Scene 03: Boss calls order inside the raccoon senate."],
  ["scene-04", "Empty diner", "Scene", 7, 53, 35, 25, "04", "Scene 04: Joe's Diner is dark and the grease traps are empty."],
  ["scene-05", "Ozempic", "Scene", 29, 58, 44, 30, "05", "Scene 05: Squeak names the mythical appetite killer."],
  ["scene-06", "Policy change", "Scene", 37, 37, 56, 36, "06", "Scene 06: Boss changes policy and orders the raid."],
  ["scene-07", "Suiting up", "Scene", 12, 70, 68, 43, "07", "Scene 07: The raccoons gear up with masks and a grappling hook."],
  ["scene-08", "The clinic", "Scene", 30, 76, 80, 50, "08", "Scene 08: The hot-pink Spa & Clinic sign reveals the target."],
  ["signal", "Food crisis", "Idea", 10, 18, 18, 26, "03", "The city's trash has gone dry."],
  ["map", "D.C. map", "Idea", 42, 18, 38, 24, "04", "Crossed-out food landmarks show the crisis spreading."],
  ["archive", "The dumpster", "Location", 10, 70, 18, 72, "03", "The dumpster is a senate, a bunker, and a home."],
  ["reflection", "The prophecy", "Idea", 61, 20, 58, 28, "05", "The raccoons decide the carbs are vanishing."],
  ["threshold", "The vent", "Scene", 82, 64, 82, 54, "10", "Boss loads the appetite stimulant into a water gun."],
  ["undertow", "The alley", "Motif", 56, 78, 58, 80, "02", "The human world and raccoon world run beside each other."],
  ["beacon", "The raid", "Location", 90, 22, 90, 22, "10", "The raid begins under the clinic."]
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
  mira: "Boss runs the dumpster senate. His job is to keep the colony fed, whatever it takes.",
  iris: "Squeak is the rookie who brings the bad news and says the word nobody wants to hear.",
  shore: "The dumpster is the story's main room: senate chamber, bunker, and home.",
  mirror: "Joe's Diner is the clue that shows the food crisis is real.",
  turn: "This is where Boss turns panic into a plan: Operation Midnight Snack.",
  city: "The White House opening sells a political thriller before the camera reveals the raccoons.",
  return: "The vent raid carries the story into the credits with the raccoons inside the walls.",
};

function positionGraph() {
  const story = graphMode === "story";
  graphCanvas.classList.toggle("timeline-mode", story);
  if (story) renderStoryTimeline();
  graphNodes.forEach((node) => {
    node.style.left = `${node.dataset[story ? "storyX" : "graphX"]}%`;
    node.style.top = `${node.dataset[story ? "storyY" : "graphY"]}%`;
  });
  followMovingNodes(story ? 900 : 80);
  window.setTimeout(() => moveYo(selectedNode), story ? 860 : 40);
}

function renderStoryTimeline() {
  storyTimeline.innerHTML = `
    <div class="timeline-overview"><div><span>STORY ARC</span><strong>Operation Midnight Snack</strong></div><span>MAIN SPINE · 3 ACTS · 11 SCENES</span></div>
    <section class="timeline-chapter"><header><span class="timeline-kicker">ACT 01</span><strong>The Bait</strong></header><div class="timeline-branch"><span class="timeline-branch-label">MAIN SPINE</span><div class="timeline-scenes">${timelineScene("01", "White House", "scene-01")}${timelineScene("02", "The bouncer", "scene-02")}${timelineScene("03", "Dumpster senate", "scene-03")}${timelineScene("04", "Empty diner", "scene-04")}</div></div></section>
    <section class="timeline-chapter"><header><span class="timeline-kicker">ACT 02</span><strong>The Myth</strong></header><div class="timeline-branch"><span class="timeline-branch-label">MAIN SPINE</span><div class="timeline-scenes">${timelineScene("05", "Ozempic", "scene-05")}${timelineScene("06", "Policy change", "scene-06")}</div></div><div class="timeline-branch"><span class="timeline-branch-label">BRANCH · CREATE CONTINUITY</span><div class="timeline-scenes">${timelineScene("V2", "Rectangular dumpster", "shore")}</div></div></section>
    <section class="timeline-chapter"><header><span class="timeline-kicker">ACT 03</span><strong>The Raid</strong></header><div class="timeline-branch"><span class="timeline-branch-label">MAIN SPINE</span><div class="timeline-scenes">${timelineScene("07", "Suiting up", "scene-07")}${timelineScene("08", "The clinic", "scene-08")}${timelineScene("09", "Rooftop drop", "scene-07")}${timelineScene("10", "The vent", "threshold")}${timelineScene("11", "Credits", "return")}</div></div></section>`;
  storyTimeline.querySelectorAll(".timeline-scene").forEach((scene) => scene.addEventListener("click", () => selectNode(scene.dataset.node)));
}

function timelineScene(number, label, node) {
  return `<button class="timeline-scene${selectedNode === node ? " active" : ""}" data-node="${node}" type="button"><span>SCENE ${number}</span><strong>${label}</strong></button>`;
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
  document.querySelector("#transcript-scene").textContent = `${scene} · ${node.querySelector("strong").textContent.toUpperCase()}`;
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
      body: JSON.stringify({ prompt: `${prompt} Preserve Boss, Squeak, the dumpster senate, and the Operation Midnight Snack tone.`, mode: liveMode ? "live" : "demo" }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) throw new Error(payload.error || "The pipeline did not complete.");
    const result = payload.result;
    stageVideo.style.display = "none";
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
  unwindButton.textContent = graphMode === "story" ? "Return to knowledge graph" : "Unwind into story";
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
document.querySelectorAll(".unlock-gem").forEach((gem) => gem.addEventListener("click", () => {
  const unlocked = gem.classList.toggle("unlocked");
  gem.setAttribute("aria-pressed", String(unlocked));
  const status = gem.querySelector("em");
  status.textContent = unlocked ? "UNLOCKED" : "ADD THOUGHT";
  showToast(unlocked ? `${gem.querySelector("strong").textContent} added to your collection.` : "Quest returned to the clarity map.");
  persistProject();
}));
document.querySelectorAll(".transcript-line").forEach((line) => line.addEventListener("click", () => {
  document.querySelectorAll(".transcript-line").forEach((item) => item.classList.toggle("active", item === line));
  document.querySelector("#stage-status").textContent = `PLAYHEAD ${line.dataset.time}`;
  showToast(`Playhead moved to ${line.dataset.time}.`);
}));
window.addEventListener("resize", () => { updateLines(); moveYo(selectedNode); });

positionGraph();
selectNode(selectedNode);
