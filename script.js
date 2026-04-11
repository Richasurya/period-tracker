/* =========================
   GLOBAL VARIABLES
========================= */
let history = document.getElementById("history");
let chart, moodChart;

/* =========================
   AUTH SYSTEM
========================= */
function register(){
    if(!username.value || !password.value){
        return alert("Enter username & password");
    }

    localStorage.setItem("user", username.value);
    localStorage.setItem("pass", password.value);

    alert("Registered Successfully!");
}

function login(){
    if(
        username.value === localStorage.getItem("user") &&
        password.value === localStorage.getItem("pass")
    ){
        loginPage.style.display = "none";
        mainApp.style.display = "block";
    } else {
        alert("Invalid Credentials");
    }
}

function logout(){
    mainApp.style.display = "none";
    loginPage.style.display = "flex";
}

/* =========================
   DARK MODE
========================= */
function toggleDarkMode(){
    document.body.classList.toggle("dark");
}

/* =========================
   ADD ENTRY
========================= */
function addEntry(){

    if(!date.value){
        return alert("Select a date");
    }

    let data = {
        date: date.value,
        mood: mood.value,
        symptom: symptom.value
    };

    let saved = JSON.parse(localStorage.getItem("cycles")) || [];

    saved.push(data);

    localStorage.setItem("cycles", JSON.stringify(saved));

    displayHistory();
    updateGraph();
    updateMoodGraph();
}

/* =========================
   DISPLAY HISTORY
========================= */
function displayHistory(){

    history.innerHTML = "";

    let saved = JSON.parse(localStorage.getItem("cycles")) || [];

    /* 🔥 SORT DATA */
    saved.sort((a, b) => new Date(a.date) - new Date(b.date));

    saved.forEach((item, i) => {

        let li = document.createElement("li");

        li.innerHTML = `
        📅 ${item.date} | ${item.mood}
        <button onclick="deleteEntry(${i})">❌</button>
        `;

        history.appendChild(li);
    });
}

/* =========================
   DELETE ENTRY
========================= */
function deleteEntry(i){

    let saved = JSON.parse(localStorage.getItem("cycles")) || [];

    /* 🔥 SORT BEFORE DELETE (IMPORTANT) */
    saved.sort((a, b) => new Date(a.date) - new Date(b.date));

    saved.splice(i, 1);

    localStorage.setItem("cycles", JSON.stringify(saved));

    displayHistory();
    updateGraph();
    updateMoodGraph();
}

/* =========================
   PREDICT NEXT PERIOD
========================= */
function predict(){

    let saved = JSON.parse(localStorage.getItem("cycles")) || [];

    if(saved.length < 2){
        return alert("Add at least 2 entries");
    }

    /* 🔥 STEP 1: SORT */
    saved.sort((a, b) => new Date(a.date) - new Date(b.date));

    let diff = [];

    for(let i = 1; i < saved.length; i++){

        let d1 = new Date(saved[i].date);
        let d2 = new Date(saved[i-1].date);

        let days = (d1 - d2) / (1000 * 60 * 60 * 24);

        /* Ignore invalid cycles */
        if(days > 0 && days < 60){
            diff.push(days);
        }
    }

    if(diff.length === 0){
        return alert("Not enough valid data");
    }

    /* 🔥 STEP 2: AVERAGE */
    let avg = Math.round(
        diff.reduce((a, b) => a + b, 0) / diff.length
    );

    /* 🔥 STEP 3: LAST DATE */
    let last = new Date(saved[saved.length - 1].date);

    let next = new Date(last);
    next.setDate(last.getDate() + avg);

    period.innerText = "Next Period: " + next.toDateString();

    checkRegularity(diff, avg);
}

/* =========================
   REGULARITY CHECK
========================= */
function checkRegularity(diff, avg){

    let regular = diff.every(d => Math.abs(d - avg) <= 3);

    status.innerText = regular ? "Regular" : "Irregular";
}

/* =========================
   CYCLE GRAPH
========================= */
function updateGraph(){

    let saved = JSON.parse(localStorage.getItem("cycles")) || [];

    if(saved.length < 2) return;

    /* 🔥 SORT */
    saved.sort((a, b) => new Date(a.date) - new Date(b.date));

    let labels = [];
    let data = [];

    for(let i = 1; i < saved.length; i++){

        let d1 = new Date(saved[i].date);
        let d2 = new Date(saved[i-1].date);

        let days = (d1 - d2) / (1000 * 60 * 60 * 24);

        labels.push("Cycle " + i);
        data.push(days);
    }

    if(chart) chart.destroy();

    chart = new Chart(cycleChart, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: "Cycle Length",
                data: data
            }]
        }
    });
}

/* =========================
   MOOD GRAPH
========================= */
function updateMoodGraph(){

    let saved = JSON.parse(localStorage.getItem("cycles")) || [];

    let count = {
        Happy: 0,
        Sad: 0,
        Irritated: 0,
        Tired: 0
    };

    saved.forEach(x => {
        if(count[x.mood] !== undefined){
            count[x.mood]++;
        }
    });

    let ctx = document.getElementById("moodChart");

    if(moodChart) moodChart.destroy();

    moodChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(count),
            datasets: [{
                label: "Mood Count",
                data: Object.values(count),
                backgroundColor: [
                    "#ff6384",
                    "#36a2eb",
                    "#ffce56",
                    "#4bc0c0"
                ]
            }]
        }
    });
}

/* =========================
   DOCTOR BOT
========================= */
function askDoctor(){

    let q = question.value.toLowerCase();

    doctorReply.innerText = q.includes("pain")
        ? "Take rest, hydration & mild medication"
        : "Consult a doctor for better guidance";
}

/* =========================
   ON LOAD
========================= */
window.onload = () => {

    if(localStorage.getItem("user")){
        loginPage.style.display = "none";
        mainApp.style.display = "block";
    }

    displayHistory();
    updateGraph();
    updateMoodGraph();
};
