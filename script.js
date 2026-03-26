// DARK MODE
const toggleBtn = document.getElementById("themeToggle");

if(localStorage.getItem("theme") === "dark"){
 document.body.classList.add("dark");
 toggleBtn.innerText = "☀️ Light Mode";
}

toggleBtn.addEventListener("click", () => {
 document.body.classList.toggle("dark");

 if(document.body.classList.contains("dark")){
   localStorage.setItem("theme","dark");
   toggleBtn.innerText = "☀️ Light Mode";
 } else {
   localStorage.setItem("theme","light");
   toggleBtn.innerText = "🌙 Dark Mode";
 }
});


// ADD ENTRY
function addEntry(){

 let date = document.getElementById("date").value;
 let cycle = document.getElementById("cycle").value;
 let mood = document.getElementById("mood").value;
 let symptom = document.getElementById("symptom").value;

 if(!date || !cycle){
   alert("Please fill all fields");
   return;
 }

 if(cycle < 21 || cycle > 35){
   alert("Cycle length should be between 21–35 days");
   return;
 }

 let entry = {date, cycle, mood, symptom};

 let data = JSON.parse(localStorage.getItem("tracker")) || [];
 data.push(entry);

 localStorage.setItem("tracker", JSON.stringify(data));

 displayHistory();
}


// DISPLAY HISTORY
function displayHistory(){
 let list = document.getElementById("history");
 list.innerHTML = "";

 let data = JSON.parse(localStorage.getItem("tracker")) || [];

 data.forEach(item => {
   let li = document.createElement("li");
   li.innerText = `${item.date} | ${item.mood} | ${item.symptom}`;
   list.appendChild(li);
 });
}


// PREDICT CYCLE
function predict(){

 let lastDate = new Date(document.getElementById("date").value);
 let cycle = parseInt(document.getElementById("cycle").value);

 if(!lastDate || !cycle){
   alert("Enter valid data first");
   return;
 }

 let nextPeriod = new Date(lastDate);
 nextPeriod.setDate(nextPeriod.getDate() + cycle);

 let ovulation = new Date(nextPeriod);
 ovulation.setDate(ovulation.getDate() - 14);

 let fertileStart = new Date(ovulation);
 fertileStart.setDate(fertileStart.getDate() - 5);

 let fertileEnd = new Date(ovulation);
 fertileEnd.setDate(fertileEnd.getDate() + 1);

 document.getElementById("period").innerText =
 "Next Period: " + nextPeriod.toDateString();

 document.getElementById("ovulation").innerText =
 "Ovulation: " + ovulation.toDateString();

 document.getElementById("fertile").innerText =
 "Fertile Window: " +
 fertileStart.toDateString() + " to " + fertileEnd.toDateString();
}


// LOAD HISTORY ON START
displayHistory();