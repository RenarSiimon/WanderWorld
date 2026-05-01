const URL = "https://tinkr.tech/sdb/poly/wander";

let playerKey = localStorage.getItem("playerKey");
let myUsername = localStorage.getItem("myUsername");

async function renderWorld(){
    
}

document.getElementById("join").addEventListener("click", async () => {
    const username = document.getElementById("name").value.trim();

    if (!username) return;

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
