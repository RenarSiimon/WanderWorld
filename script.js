const URL = "https://tinkr.tech/sdb/poly/wander";

let playerKey = localStorage.getItem("playerKey");
let myUsername = localStorage.getItem("myUsername");
let updateInterval = null;

function showWorld() {
    document.getElementById("login").style.display = "none";
    document.getElementById("game").style.display = "block";
}
 
function hideWorld() {
    document.getElementById("login").style.display = "flex";
    document.getElementById("game").style.display = "none";
}

async function renderWorld() {
    const res = await fetch(URL);
    const state = await res.json();
 
    const world = document.getElementById("world");
    world.innerHTML = "";
 
    for (const player of state.players) {
        const div = document.createElement("div");
        div.className = "player";
        div.style.left = player.x + "px";
        div.style.top = player.y + "px";
 
        if (player.message) {
            const bubble = document.createElement("div");
            bubble.className = "bubble";
            bubble.textContent = player.message;
            div.appendChild(bubble);
        }
 
        const img = document.createElement("img");
        img.src = "player.png";
        img.width = 32;
        img.height = 32;
        div.appendChild(img);
 
        const label = document.createElement("div");
        label.className = "label";
        label.textContent = player.username;
        if (player.username === myUsername) label.classList.add("me");
        div.appendChild(label);
 
        world.appendChild(div);
    }
}

function startUpdating() {
    renderWorld();
    updateInterval = setInterval(renderWorld, 1000);
}
 
function stopUpdating() {
    clearInterval(updateInterval);
}
 
if (playerKey) {
    showWorld();
    startUpdating();
}
 


document.getElementById("join").addEventListener("click", async () => {
  const username = document.getElementById("name").value.trim();
    if (!username) return alert("Sisesta nimi!");
 
    const res = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "join", username })
    });
    const data = await res.json();
 
    playerKey = data.player_key;
    myUsername = username;
    localStorage.setItem("playerKey", playerKey);
    localStorage.setItem("myUsername", myUsername);
 
    showWorld();
    startUpdating();
});

document.getElementById("say").addEventListener("click", async () => {
    const message = document.getElementById("talk").value.trim();
    if (!message || !playerKey) return;
 
    await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "talk", player_key: playerKey, message })
    });
    document.getElementById("talk").value = "";
});

document.getElementById("leave").addEventListener("click", () => {
    localStorage.removeItem("playerKey");
    localStorage.removeItem("myUsername");
    playerKey = null;
    myUsername = null;
    hideWorld();
    stopUpdating();
});

document.getElementById("world").addEventListener("click", async (e) => {
    if (!playerKey) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);
 
    await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "move", player_key: playerKey, x, y })
    });
});