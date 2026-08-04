const graphCanvas = document.querySelector("#graph-canvas");
const graphSvg = document.querySelector("#graph-lines");
const yoFloater = document.querySelector("#yo-floater");
const yoTether = document.querySelector("#yo-tether");
const yoTitle = document.querySelector("#yo-title");
const yoThread = document.querySelector("#yo-thread");
const yoInput = document.querySelector("#yo-input");
const storySpine = document.querySelector("#story-spine");
const stageVideo = document.querySelector("#stage-video");
const stageMedia = document.querySelector("#stage-media");
const toast = document.querySelector("#toast");
let selectedId = "boss";
let selectedScene = "03";
let liveMode = false;
let liveConfig = { provider: null, apiKey: null, files: [] };

const characters = {
  boss: { label: "Boss", note: "Boss runs the dumpster senate. He turns a food shortage into a black-ops plan.", scenes: ["03", "06", "07", "10"], progress: 80 },
  squeak: { label: "Squeak", note: "Squeak brings the bad news and spots the clue nobody else wants to say out loud.", scenes: ["03", "05", "07", "10"], progress: 64 },
  med: { label: "Dr. Med", note: "Dr. Med is the scientist behind the appetite fix. The white coat makes that read faster.", scenes: ["08"], progress: 42 },
  guard: { label: "Guard", note: "The human guard is the first weak point in the raccoons' plan.", scenes: ["02", "11"], progress: 28 },
};

const yoConversations = {
  boss: "Should Boss show more authority in scene 03? That could make his turn with Squeak feel sharper.",
  squeak: "Should we plant Squeak’s clue earlier? I can trace it back to the diner without giving away the reveal.",
  med: "Could Dr. Med read as a scientist sooner? The white coat may make the clinic reveal clearer.",
  guard: "Is the guard a real obstacle yet? We could give him one beat that makes the raid feel riskier.",
};

const scenes = [
  { id: "01", act: "01 · THE BAIT", title: "White House opening", chars: ["boss"], start: 0, progress: 52, thumb: "white-house-thumb", note: "A breaking-news emergency opens over the White House." },
  { id: "02", act: "01 · THE BAIT", title: "The bouncer", chars: ["guard", "squeak"], start: 14, progress: 31, thumb: "guard-thumb", note: "A human guard becomes the first weak point." },
  { id: "03", act: "01 · THE BAIT", title: "Dumpster senate", chars: ["boss", "squeak"], start: 35, progress: 78, thumb: "boss-thumb", note: "Boss calls order inside the dumpster senate." },
  { id: "04", act: "01 · THE BAIT", title: "Empty diner", chars: ["squeak"], start: 47, progress: 39, thumb: "diner-thumb", note: "Joe's Diner is dark and the grease traps are empty." },
  { id: "05", act: "02 · THE MYTH", title: "Ozempic reveal", chars: ["squeak"], start: 58, progress: 61, thumb: "diner-thumb", note: "Squeak names the mythical appetite killer." },
  { id: "06", act: "02 · THE MYTH", title: "Policy change", chars: ["boss", "squeak"], start: 68, progress: 48, thumb: "boss-thumb", note: "Boss turns panic into Operation Midnight Snack." },
  { id: "07", act: "03 · THE RAID", title: "Suiting up", chars: ["boss", "squeak"], start: 76, progress: 35, thumb: "boss-thumb", note: "The raccoons gear up with masks and a grappling hook." },
  { id: "08", act: "03 · THE RAID", title: "The clinic", chars: ["med"], start: 84, progress: 42, thumb: "med-thumb", note: "The hot-pink Spa & Clinic sign reveals the target." },
  { id: "09", act: "03 · THE RAID", title: "Rooftop drop", chars: ["boss"], start: 91, progress: 24, thumb: "boss-thumb", note: "The raid crosses from plan into motion." },
  { id: "10", act: "03 · THE RAID", title: "The vent", chars: ["boss", "squeak"], start: 97, progress: 29, thumb: "vent-thumb", note: "Boss loads the appetite stimulant into a water gun." },
  { id: "11", act: "03 · THE RAID", title: "Credits", chars: ["guard"], start: 103, progress: 18, thumb: "guard-thumb", note: "The human world catches up with the raccoons in the walls." },
];

const relationshipLines = [
  ["boss", "squeak", 4], ["boss", "med", 2], ["squeak", "guard", 2],
];

const transcriptData = {
  "01": [[0, "YO", "A breaking-news emergency opens over the White House."], [5, "NEWS", "Something is wrong with Washington's trash." ]],
  "02": [[14, "GUARD", "Keep moving. Nothing to see here."], [20, "SQUEAK", "That door is our way in." ]],
  "03": [[35, "BOSS", "Order! Order in the dumpster!"], [43, "SQUEAK", "The district's food supply has suffered a total systemic collapse."], [59, "SQUEAK · WHISPER", "It's... Ozempic."], [80, "YO · CONTEXT", "This is the gap that opens the Operation Midnight Snack quest."]],
  "04": [[47, "SQUEAK", "The diner is empty."], [52, "BOSS", "Then we find out why." ]],
  "05": [[58, "SQUEAK", "Ozempic."], [64, "BOSS", "Say that again." ]],
  "06": [[68, "BOSS", "We stop waiting. We take the route under the clinic."], [73, "SQUEAK", "Operation Midnight Snack." ]],
  "07": [[76, "SQUEAK", "Masks on."], [80, "BOSS", "Nobody gets left behind." ]],
  "08": [[84, "MED", "The sign says clinic."], [88, "BOSS", "Then we found the target." ]],
  "09": [[91, "SQUEAK", "Rooftop clear."], [94, "BOSS", "Drop." ]],
  "10": [[97, "BOSS", "Load the water gun."], [101, "SQUEAK", "The vent is open." ]],
  "11": [[103, "GUARD", "Did you hear that?"], [105, "YO", "The story keeps moving through the walls." ]],
};

const clipLines = [
  ["boss", "clip-boss", 3], ["squeak", "clip-squeak", 2],
  ["med", "clip-med", 2], ["guard", "clip-guard", 2],
];

const characterAssets = {
  boss: { current: "/operation-midnight-snack/final/boss.png", previous: "/operation-midnight-snack/v1/boss v1.png", wants: "Keep the colony fed", fears: "The trash bins stay empty", changes: "From senate leader to black-ops commander" },
  squeak: { current: "/operation-midnight-snack/final/squeak.png", previous: "/operation-midnight-snack/final/squeak.png", wants: "Find the clue", fears: "Being ignored", changes: "From rookie messenger to sharp-eyed scout" },
  med: { current: "/operation-midnight-snack/final/med.png", previous: "/operation-midnight-snack/v1/med v1.png", wants: "Make the fix work", fears: "The clinic gets found", changes: "From scientist to part of the plan" },
  guard: { current: "/operation-midnight-snack/final/guard.png", previous: "/operation-midnight-snack/final/guard.png", wants: "Protect the door", fears: "Missing the signal", changes: "From obstacle to accidental accomplice" },
};

function buildRelationshipLines() {
  [...relationshipLines, ...clipLines].forEach(([from, to, weight]) => {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.dataset.from = from;
    line.dataset.to = to;
    line.dataset.weight = weight;
    line.dataset.kind = to.startsWith("clip-") ? "clip" : "relationship";
    graphSvg.insertBefore(line, yoTether);
  });
}

function updateLines() {
  if (!graphCanvas) return;
  const bounds = graphCanvas.getBoundingClientRect();
  graphSvg.setAttribute("viewBox", `0 0 ${bounds.width} ${bounds.height}`);
  graphSvg.setAttribute("preserveAspectRatio", "none");
  graphSvg.querySelectorAll("line[data-from]").forEach((line) => {
    const from = document.querySelector(`[data-id="${line.dataset.from}"] .node-orb, [data-id="${line.dataset.from}"] .clip-thumb`);
    const to = document.querySelector(`[data-id="${line.dataset.to}"] .node-orb, [data-id="${line.dataset.to}"] .clip-thumb`);
    if (!from || !to) return;
    const a = from.getBoundingClientRect();
    const b = to.getBoundingClientRect();
    line.setAttribute("x1", a.left + a.width / 2 - bounds.left);
    line.setAttribute("y1", a.top + a.height / 2 - bounds.top);
    line.setAttribute("x2", b.left + b.width / 2 - bounds.left);
    line.setAttribute("y2", b.top + b.height / 2 - bounds.top);
  });
  positionYo(bounds);
}

function positionYo(bounds = graphCanvas.getBoundingClientRect()) {
  const orb = document.querySelector(`[data-id="${selectedId}"] .node-orb`);
  if (!orb || !yoFloater) return;
  const point = orb.getBoundingClientRect();
  const x = point.left + point.width / 2 - bounds.left;
  const y = point.top + point.height / 2 - bounds.top;
  const right = x < bounds.width * 0.52;
  const left = Math.max(16, Math.min(bounds.width - yoFloater.offsetWidth - 16, right ? x + 72 : x - yoFloater.offsetWidth - 72));
  const top = Math.max(16, Math.min(bounds.height - yoFloater.offsetHeight - 16, y - yoFloater.offsetHeight / 2));
  yoFloater.style.left = `${left}px`;
  yoFloater.style.top = `${top}px`;
  yoTether.setAttribute("x1", x);
  yoTether.setAttribute("y1", y);
  yoTether.setAttribute("x2", right ? left : left + yoFloater.offsetWidth);
  yoTether.setAttribute("y2", top + 38);
}

function sceneFor(id) {
  const scene = scenes.find((item) => item.id === id);
  return scene || scenes.find((item) => item.chars.includes(id)) || scenes[2];
}

function selectNode(id, sceneId = null) {
  const node = document.querySelector(`[data-id="${id}"]`);
  const character = characters[id];
  if (!node || !character) return;
  selectedId = id;
  document.querySelectorAll(".graph-node, .clip-node, .relationship-label").forEach((item) => item.classList.remove("active"));
  node.classList.add("active");
  document.querySelectorAll(`.clip-node[data-focus="${id}"]`).forEach((item) => item.classList.add("active"));
  yoTitle.textContent = `Looking at ${character.label}`;
  yoThread.innerHTML = `<p>${yoConversations[id]}</p><p class="yo-context">Yo suggestion · ${character.label} · scene ${character.scenes[0]}</p>`;
  renderCharacterCard(id);
  const targetScene = sceneId || (character.scenes.includes(selectedScene) ? selectedScene : character.scenes[0]);
  selectScene(targetScene, false);
  positionYo();
}

function renderCharacterCard(id) {
  const card = document.querySelector("#character-card");
  const character = characters[id];
  const assets = characterAssets[id];
  if (!card || !character || !assets) return;
  card.hidden = false;
  card.innerHTML = `<button class="character-card-close" type="button" aria-label="Close character card">×</button><div class="character-card-heading"><div><span class="eyebrow">CHARACTER CARD</span><h3>${character.label}</h3></div><strong>${character.progress}% developed</strong></div><p class="character-card-note">${character.note}</p><div class="character-card-body"><div class="character-card-image"><img src="${assets.current}" alt="Current ${character.label} design" /><span>CURRENT VERSION</span></div><div class="character-card-image previous"><img src="${assets.previous}" alt="Previous ${character.label} design" /><span>PREVIOUS VERSION</span></div><div class="character-card-facts"><p><small>WANTS</small><strong>${assets.wants}</strong></p><p><small>FEARS</small><strong>${assets.fears}</strong></p><p><small>CHANGES</small><strong>${assets.changes}</strong></p><p><small>CONNECTED SCENES</small><strong>${character.scenes.join(" · ")}</strong></p></div></div>`;
  card.querySelector(".character-card-close").addEventListener("click", () => { card.hidden = true; });
}

function highlightStat(stat) {
  document.querySelectorAll(".stat-item").forEach((item) => item.classList.toggle("active", item.dataset.stat === stat));
  document.querySelectorAll(".graph-node.character, .clip-node").forEach((item) => {
    const isCharacter = item.classList.contains("character");
    const isClip = item.classList.contains("clip-node");
    const isScene = item.dataset.scenes?.includes(selectedScene);
    const match = stat === "characters" ? isCharacter : stat === "scenes" ? isScene : stat === "relationships" ? isCharacter && item.dataset.id !== "guard" : stat === "story" ? true : isCharacter;
    item.classList.toggle("stat-highlight", match);
    item.classList.toggle("stat-dim", !match);
  });
}

function selectScene(id, scroll = true) {
  const scene = sceneFor(id);
  selectedScene = scene.id;
  document.querySelectorAll(".timeline-scene").forEach((item) => item.classList.toggle("active", item.dataset.scene === scene.id));
  document.querySelectorAll(".graph-node, .clip-node").forEach((item) => item.classList.toggle("scene-linked", item.dataset.scenes?.split(",").includes(scene.id)));
  document.querySelector("#selected-label").textContent = `${scene.title.toUpperCase()} · SCENE ${scene.id}`;
  document.querySelector("#transcript-scene").textContent = `${scene.id} · ${scene.title.toUpperCase()}`;
  document.querySelector("#stage-prompt").textContent = scene.note;
  document.querySelector("#stage-status").textContent = `SCENE ${scene.id} READY`;
  renderTranscript(scene.id);
  if (stageVideo) {
    stageVideo.style.display = "block";
    stageVideo.currentTime = scene.start;
  }
  if (stageMedia) stageMedia.style.backgroundImage = "none";
  if (scroll) document.querySelector("#workspace").scrollIntoView({ behavior: "smooth", block: "start" });
}

function seekVideo(time) {
  if (!stageVideo) return;
  const move = () => {
    stageVideo.currentTime = Math.max(0, Math.min(Number(time), stageVideo.duration || Number(time)));
    stageVideo.play().catch(() => {});
  };
  if (stageVideo.readyState >= 1) move();
  else stageVideo.addEventListener("loadedmetadata", move, { once: true });
}

function renderTranscript(sceneId) {
  const list = document.querySelector("#transcript-list");
  if (!list) return;
  const rows = transcriptData[sceneId] || [];
  list.innerHTML = rows.map(([time, speaker, text], index) => `<button class="transcript-line${index === 0 ? " active" : ""}" data-time="${time}" type="button"><span>${formatTime(time)}</span><strong>${speaker}</strong><p>${text}</p></button>`).join("");
  list.querySelectorAll(".transcript-line").forEach((line) => line.addEventListener("click", () => {
    list.querySelectorAll(".transcript-line").forEach((item) => item.classList.toggle("active", item === line));
    document.querySelector("#stage-status").textContent = `PLAYHEAD ${formatTime(line.dataset.time)}`;
    seekVideo(line.dataset.time);
  }));
}

function formatTime(seconds) {
  const value = Number(seconds);
  return `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`;
}

function renderTimeline() {
  let currentAct = "";
  storySpine.innerHTML = scenes.map((scene) => {
    const act = scene.act !== currentAct ? `<div class="timeline-act"><span>${scene.act}</span></div>` : "";
    currentAct = scene.act;
    const tags = scene.chars.map((id) => `<span class="timeline-character" data-character="${id}" role="button" tabindex="0">${characters[id].label}</span>`).join("");
    return `${act}<button class="timeline-scene${scene.id === selectedScene ? " active" : ""}" data-scene="${scene.id}" type="button"><span class="timeline-thumb ${scene.thumb}"></span><span class="timeline-scene-number">SCENE ${scene.id}</span><strong>${scene.title}</strong><small>${scene.progress}% clear</small><i style="--progress:${scene.progress}%"></i><span class="timeline-tags">${tags}</span></button>`;
  }).join("");
  storySpine.querySelectorAll(".timeline-scene").forEach((item) => item.addEventListener("click", (event) => { if (!event.target.closest(".timeline-character")) selectScene(item.dataset.scene); }));
  storySpine.querySelectorAll(".timeline-character").forEach((item) => item.addEventListener("click", (event) => { event.stopPropagation(); selectNode(item.dataset.character, item.closest(".timeline-scene").dataset.scene); }));
}

function addClip() {
  const label = window.prompt("Name this clip or note:", "New clip");
  if (!label?.trim()) return;
  const clip = document.createElement("button");
  clip.className = "clip-node custom-clip active";
  clip.dataset.id = `custom-${Date.now()}`;
  clip.dataset.focus = selectedId;
  clip.dataset.scenes = selectedScene;
  clip.type = "button";
  clip.innerHTML = `<span class="clip-thumb"></span><strong>${label.trim()}</strong><small>NEW CLIP · ${characters[selectedId].label.toUpperCase()}</small>`;
  graphCanvas.insertBefore(clip, yoFloater);
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.dataset.from = selectedId;
  line.dataset.to = clip.dataset.id;
  line.dataset.weight = "2";
  line.dataset.kind = "clip";
  graphSvg.insertBefore(line, yoTether);
  clip.addEventListener("click", () => selectNode(selectedId, selectedScene));
  updateLines();
  showToast(`${label.trim()} orbiting ${characters[selectedId].label}.`);
}

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2800);
}

function shortHash(value) { return value && value.length > 16 ? `${value.slice(0, 8)}…${value.slice(-6)}` : value || "Pending"; }

async function generateScene() {
  const button = document.querySelector("#generate-button");
  const prompt = document.querySelector("#stage-prompt").textContent;
  button.disabled = true;
  button.textContent = "Building this version";
  document.querySelector("#stage-status").textContent = "GENBLAZE RUNNING";
  stageMedia.classList.add("is-loading");
  try {
    const response = await fetch("/api/pipeline", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ prompt: `${prompt} Preserve Boss, Squeak, the dumpster senate, and the Operation Midnight Snack tone.`, mode: liveMode ? "live" : "demo", provider: liveConfig.provider, providerKey: liveConfig.apiKey, content: liveConfig.files }) });
    const payload = await response.json();
    if (!response.ok || !payload.ok) throw new Error(payload.error || "The pipeline did not complete.");
    const result = payload.result;
    stageVideo.style.display = "none";
    stageMedia.style.background = `url("${result.asset_url}") center / cover`;
    document.querySelector("#record-summary").textContent = `Scene ${selectedScene} · ${result.mode} run verified`;
    document.querySelector("#record-provider").textContent = `${result.provider} · ${result.model}`;
    document.querySelector("#record-asset").textContent = "Version ready";
    document.querySelector("#record-manifest").textContent = result.manifest_verified ? "Provenance attached" : "Needs review";
    document.querySelector("#record-storage").textContent = liveConfig.files.length ? `${liveConfig.files.length} files connected` : "No folder connected";
    document.querySelector("#stage-status").textContent = "NEW VERSION READY";
    showToast("New version ready. The previous version is preserved.");
  } catch (error) { document.querySelector("#stage-status").textContent = "RUN STOPPED SAFELY"; showToast(error.message); }
  finally { button.disabled = false; button.textContent = "Regenerate this scene"; stageMedia.classList.remove("is-loading"); }
}

buildRelationshipLines();
renderTimeline();
document.querySelectorAll(".graph-node").forEach((node) => node.addEventListener("click", () => selectNode(node.dataset.id)));
document.querySelectorAll(".clip-node").forEach((clip) => clip.addEventListener("click", () => clip.dataset.focus ? selectNode(clip.dataset.focus, clip.dataset.scenes?.split(",")[0]) : selectScene(clip.dataset.scenes?.split(",")[0])));
document.querySelectorAll(".relationship-label").forEach((label) => label.addEventListener("click", () => { const relation = label.dataset.relation.split("-"); selectNode(relation[0]); showToast(label.querySelector("strong").textContent); }));
document.querySelector("#add-node-button").addEventListener("click", addClip);
document.querySelector("#unwind-button")?.addEventListener("click", () => document.querySelector("#unwind-section").scrollIntoView({ behavior: "smooth", block: "start" }));
document.querySelector("#yo-form").addEventListener("submit", (event) => { event.preventDefault(); const comment = yoInput.value.trim(); if (!comment) return; const user = document.createElement("p"); user.className = "user-comment"; user.textContent = comment; const reply = document.createElement("p"); reply.className = "yo-reply"; reply.textContent = `I’ll keep that in view for ${characters[selectedId].label} and the connected scenes.`; yoThread.append(user, reply); yoInput.value = ""; });
const connectPanel = document.querySelector("#connect-panel");
const connectForm = document.querySelector("#connect-form");
const folderInput = document.querySelector("#content-folder");
const folderNote = document.querySelector("#connect-file-note");
document.querySelector("#mode-button").addEventListener("click", () => { connectPanel.hidden = false; document.querySelector("#mode-button").setAttribute("aria-expanded", "true"); });
document.querySelector("#connect-close").addEventListener("click", () => { connectPanel.hidden = true; document.querySelector("#mode-button").setAttribute("aria-expanded", "false"); });
folderInput.addEventListener("change", () => { const count = folderInput.files?.length || 0; folderNote.textContent = count ? `${count} files ready for Yo to map.` : "No folder connected yet."; });
connectForm.addEventListener("submit", (event) => { event.preventDefault(); const key = document.querySelector("#provider-key").value.trim(); const provider = document.querySelector("#provider-select").value; const files = [...(folderInput.files || [])].map((file) => ({ name: file.name, type: file.type, size: file.size })); const count = files.length; if (!key) { folderNote.textContent = "Add a key to connect this provider."; return; } liveConfig = { provider, apiKey: key, files }; liveMode = true; document.querySelector("#mode-button").textContent = "Live setup ready"; document.querySelector("#mode-button").setAttribute("aria-expanded", "false"); connectPanel.hidden = true; showToast(`${provider.toUpperCase()} connected${count ? ` · ${count} files mapped` : ""}.`); });
document.querySelector("#generate-button").addEventListener("click", generateScene);
document.querySelector("#keep-button").addEventListener("click", () => showToast("Current version kept. The next scene is ready."));
document.querySelectorAll(".stat-item").forEach((item) => item.addEventListener("click", () => highlightStat(item.dataset.stat)));
window.addEventListener("resize", updateLines);
selectNode("boss", "03");
renderTranscript("03");
window.setTimeout(updateLines, 80);
