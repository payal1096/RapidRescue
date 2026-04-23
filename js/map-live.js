// Frontend/js/map-live.js
// NEXT STEP = SMART AMBULANCE TRACKER
// PURA FILE REPLACE KARO

const map = L.map("map").setView([19.0760,72.8777],13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
maxZoom:19
}).addTo(map);

/* =========================
   ICONS
========================= */
const ambulanceIcon = L.icon({
iconUrl:"https://cdn-icons-png.flaticon.com/512/2966/2966485.png",
iconSize:[38,38]
});

const accidentIcon = L.icon({
iconUrl:"https://cdn-icons-png.flaticon.com/512/684/684908.png",
iconSize:[34,34]
});

/* =========================
   LOCATIONS
========================= */
let accidentLat = 19.0822;
let accidentLng = 72.8840;

let ambLat = 19.0600;
let ambLng = 72.8500;

/* =========================
   MARKERS
========================= */
const accident = L.marker(
[accidentLat,accidentLng],
{icon:accidentIcon}
).addTo(map).bindPopup("🚨 Accident Reported");

const ambulance = L.marker(
[ambLat,ambLng],
{icon:ambulanceIcon}
).addTo(map).bindPopup("🚑 Ambulance Moving");

/* USER LIVE LOCATION */
if(navigator.geolocation){

navigator.geolocation.getCurrentPosition((pos)=>{

const lat = pos.coords.latitude;
const lng = pos.coords.longitude;

L.marker([lat,lng])
.addTo(map)
.bindPopup("📍 Your Location");

map.setView([lat,lng],14);

document.getElementById("status").innerHTML =
"📍 Live Location Active";

});

}

/* =========================
   ROUTE LINE
========================= */
let route = L.polyline([
[ambLat,ambLng],
[accidentLat,accidentLng]
],{
color:"red",
weight:4
}).addTo(map);

/* =========================
   DISTANCE FUNCTION
========================= */
function getDistance(lat1,lng1,lat2,lng2){

const R = 6371;

const dLat = (lat2-lat1)*Math.PI/180;
const dLng = (lng2-lng1)*Math.PI/180;

const a =
Math.sin(dLat/2)**2 +
Math.cos(lat1*Math.PI/180) *
Math.cos(lat2*Math.PI/180) *
Math.sin(dLng/2)**2;

const c = 2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));

return R*c;
}

/* =========================
   UPDATE ETA
========================= */
function updatePanel(){

const km = getDistance(
ambLat,ambLng,
accidentLat,accidentLng
).toFixed(2);

const mins = Math.max(1,Math.round(km*2));

document.getElementById("distance").innerHTML =
`🚑 Ambulance Nearby: ${km} KM`;

document.getElementById("eta").innerHTML =
`⏱ ETA: ${mins} Minutes`;

if(km < 0.20){

document.getElementById("eta").innerHTML =
"✅ Ambulance Arrived";

document.getElementById("distance").innerHTML =
"🚑 At Accident Location";

}

}

/* =========================
   MOVE AMBULANCE
========================= */
function moveAmbulance(){

if(ambLat < accidentLat) ambLat += 0.0012;
if(ambLng < accidentLng) ambLng += 0.0012;

ambulance.setLatLng([ambLat,ambLng]);

route.setLatLngs([
[ambLat,ambLng],
[accidentLat,accidentLng]
]);

updatePanel();
}

setInterval(moveAmbulance,2000);

updatePanel();