import "./style.css";
const res = await fetch("http://localhost:5174");
const data = await res.json();
document.getElementById("app").innerHTML = data.status;
