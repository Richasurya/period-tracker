let history = document.getElementById("history");
let chart, moodChart;

/* LOGIN */
function register(){
localStorage.setItem("user", username.value);
localStorage.setItem("pass", password.value);
alert("Registered!");
}

function login(){
if(username.value===localStorage.getItem("user") &&
password.value===localStorage.getItem("pass")){
loginPage.style.display="none";
mainApp.style.display="block";
}
else alert("Invalid");
}

function logout(){
mainApp.style.display="none";
loginPage.style.display="flex";
}

/* DARK MODE */
function toggleDarkMode(){
document.body.classList.toggle("dark");
}

/* ADD ENTRY */
function addEntry(){

let data={
date:date.value,
mood:mood.value,
symptom:symptom.value
};

let saved=JSON.parse(localStorage.getItem("cycles"))||[];
saved.push(data);
localStorage.setItem("cycles",JSON.stringify(saved));

displayHistory();
updateGraph();
updateMoodGraph();
}

/* DISPLAY + DELETE */
function displayHistory(){
history.innerHTML="";
let saved=JSON.parse(localStorage.getItem("cycles"))||[];

saved.forEach((item,i)=>{
let li=document.createElement("li");
li.innerHTML=`📅 ${item.date} | ${item.mood}
<button onclick="deleteEntry(${i})">❌</button>`;
history.appendChild(li);
});
}

function deleteEntry(i){
let saved=JSON.parse(localStorage.getItem("cycles"));
saved.splice(i,1);
localStorage.setItem("cycles",JSON.stringify(saved));
displayHistory();
updateGraph();
}

/* AI PREDICTION */
function predict(){

let saved=JSON.parse(localStorage.getItem("cycles"));
if(saved.length<2) return alert("Add more data");

let diff=[];
for(let i=1;i<saved.length;i++){
diff.push((new Date(saved[i].date)-new Date(saved[i-1].date))/(1000*60*60*24));
}

let avg=Math.round(diff.reduce((a,b)=>a+b)/diff.length);

let last=new Date(saved[saved.length-1].date);
let next=new Date(last);
next.setDate(last.getDate()+avg);

period.innerText="Next Period: "+next.toDateString();

checkRegularity(diff,avg);
}

/* REGULARITY */
function checkRegularity(diff,avg){
let reg=diff.every(d=>Math.abs(d-avg)<=3);
status.innerText=reg?"Regular":"Irregular";
}

/* GRAPH */
function updateGraph(){

let saved=JSON.parse(localStorage.getItem("cycles"))||[];
if(saved.length<2) return;

let labels=[],data=[];

for(let i=1;i<saved.length;i++){
labels.push("Cycle "+i);
data.push((new Date(saved[i].date)-new Date(saved[i-1].date))/(1000*60*60*24));
}

if(chart) chart.destroy();

chart=new Chart(cycleChart,{
type:'line',
data:{labels,datasets:[{data}]}
});
}

/* MOOD GRAPH */
function updateMoodGraph(){

let saved = JSON.parse(localStorage.getItem("cycles")) || [];

let count = {
Happy:0,
Sad:0,
Irritated:0,
Tired:0
};

saved.forEach(x => {
if(count[x.mood] !== undefined){
count[x.mood]++;
}
});

/* 👉 FIX: get canvas context properly */
let ctx = document.getElementById("moodChart");

if(moodChart) moodChart.destroy();

/* 👉 FIX: use ctx instead of moodChart */
moodChart = new Chart(ctx,{
type:'bar',
data:{
labels:Object.keys(count),
datasets:[{
label:"Mood Count",
data:Object.values(count),
backgroundColor: [
"#ff6384","#36a2eb","#ffce56","#4bc0c0"
]
}]
}
});
}
/* DOCTOR */
function askDoctor(){
let q=question.value.toLowerCase();
doctorReply.innerText=q.includes("pain")?
"Take rest & hydration":
"Consult doctor";
}

/* LOAD */
window.onload=()=>{
if(localStorage.getItem("user")){
loginPage.style.display="none";
mainApp.style.display="block";
}
displayHistory();
updateGraph();
updateMoodGraph();
};
