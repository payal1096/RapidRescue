// Frontend/js/app.js
// FINAL NEXT STEP = LOADER + TOAST + AUTO REFRESH
// PURA FILE REPLACE KARO

const API = "http://localhost:5000/api";

/* =========================
   TOAST
========================= */
function showMsg(msg){

const old = document.getElementById("toast");
if(old) old.remove();

const box = document.createElement("div");
box.id = "toast";
box.innerText = msg;

box.style.position = "fixed";
box.style.top = "20px";
box.style.right = "20px";
box.style.background = "#ef4444";
box.style.color = "white";
box.style.padding = "14px 18px";
box.style.borderRadius = "12px";
box.style.fontWeight = "bold";
box.style.zIndex = "9999";
box.style.boxShadow = "0 10px 25px rgba(0,0,0,0.35)";

document.body.appendChild(box);

setTimeout(()=>{
box.remove();
},2500);

}

/* =========================
   BUTTON LOADING
========================= */
function setLoading(btn,text){
btn.disabled = true;
btn.innerText = text;
}

function removeLoading(btn,text){
btn.disabled = false;
btn.innerText = text;
}

/* =========================
   SIGNUP
========================= */
async function signupUser(){

const btn = document.querySelector("button");

const name = document.getElementById("name")?.value.trim();
const email = document.getElementById("email")?.value.trim();
const phone = document.getElementById("phone")?.value.trim();
const password = document.getElementById("password")?.value.trim();

if(!name || !email || !phone || !password){
return showMsg("Please fill all fields");
}

setLoading(btn,"Creating...");

const res = await fetch(`${API}/signup`,{
method:"POST",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify({ name,email,phone,password })
});

const data = await res.json();

removeLoading(btn,"Create Secure Account");

showMsg(data.message);

if(data.success){
setTimeout(()=>{
window.location.href = "index.html";
},1000);
}

}

/* =========================
   LOGIN
========================= */
async function loginUser(){

const btn = document.querySelector("button");

const email = document.getElementById("email")?.value.trim();
const password = document.getElementById("password")?.value.trim();

if(!email || !password){
return showMsg("Enter email & password");
}

setLoading(btn,"Logging in...");

const res = await fetch(`${API}/login`,{
method:"POST",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify({ email,password })
});

const data = await res.json();

removeLoading(btn,"Login Securely");

showMsg(data.message);

if(data.success){

localStorage.setItem("rapidLoggedIn","true");
localStorage.setItem("rapidUserEmail",email);

setTimeout(()=>{
window.location.href = "dashboard.html";
},1000);

}

}

/* =========================
   LOGOUT
========================= */
function logoutUser(){

localStorage.removeItem("rapidLoggedIn");
localStorage.removeItem("rapidUserEmail");

window.location.href = "index.html";
}

/* =========================
   REPORT
========================= */
async function reportAccident(){

const btn = document.querySelector(".submit-btn");

const name = document.getElementById("name")?.value.trim();
const contact = document.getElementById("contact")?.value.trim();
const type = document.getElementById("type")?.value;
const location = document.getElementById("location")?.value.trim();
const description = document.getElementById("description")?.value.trim();

if(!name || !contact || !type || !location || !description){
return showMsg("Please fill all fields");
}

let photo = "";

const file = document.getElementById("photo")?.files[0];

if(file){

photo = await new Promise((resolve)=>{

const reader = new FileReader();

reader.onload = ()=>resolve(reader.result);

reader.readAsDataURL(file);

});

}

setLoading(btn,"Submitting...");

const res = await fetch(`${API}/report`,{
method:"POST",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify({
name,
contact,
type,
location,
description,
photo
})
});

const data = await res.json();

removeLoading(btn,"🚑 Submit Emergency Report");

showMsg(data.message);

if(data.success){
setTimeout(()=>{
window.location.href = "dashboard.html";
},1000);
}

}

/* =========================
   STATS
========================= */
async function loadStats(){

if(!document.getElementById("total")) return;

const res = await fetch(`${API}/stats`);
const data = await res.json();

document.getElementById("total").innerText = data.total;
document.getElementById("critical").innerText = data.critical;
document.getElementById("major").innerText = data.major;
document.getElementById("minor").innerText = data.minor;

}

/* =========================
   REPORTS
========================= */
async function loadReports(){

const box = document.getElementById("recentReports");
if(!box) return;

const res = await fetch(`${API}/reports`);
const data = await res.json();

box.innerHTML = "";

if(data.length === 0){
box.innerHTML = `<div class="item">No reports yet</div>`;
return;
}

data.forEach(item=>{

box.innerHTML += `
<div class="item">
<strong>${item.name}</strong><br>
${item.type} - ${item.location}<br>
${item.status}
</div>
`;

});

}

/* =========================
   PROTECT
========================= */
function protectDashboard(){

if(document.getElementById("total")){

const logged = localStorage.getItem("rapidLoggedIn");

if(logged !== "true"){
window.location.href = "index.html";
}

}

}

/* =========================
   AUTO LOAD
========================= */
protectDashboard();
loadStats();
loadReports();

setInterval(()=>{
loadStats();
loadReports();
},5000);