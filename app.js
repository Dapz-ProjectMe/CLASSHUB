const students=["Aditya Pratama","Ahmad Fauzan","Aldi Saputra","Andika Wijaya","Bagas Ramadhan","Bima Setiawan","Cahyo Nugroho","Daffa Nurkhalish","Dani Kurniawan","Dimas Saputra","Fajar Ramadhan","Fauzan Akbar","Galang Pratama","Hafiz Maulana","Ilham Saputra","Joko Susanto","Kevin Alvaro","Lukman Hakim","M. Rizky","M. Fadli","Nanda Putra","Naufal Ramadhan","Noval Ardiansyah","Putra Wijaya","Raka Aditya","Rangga Saputra","Reza Fahlevi","Rizal Maulana","Salsa Putri","Siti Aisyah","Tasya Amelia","Vina Lestari","Wahyu Hidayat","Yogi Prasetyo","Zaki Ramadhan","Zulfan Akbar"];

const schedules={
senin:[["07:00","08:30","Bahasa Indonesia","Bapak/Ibu Guru","X APAT 1"],["08:30","10:00","Matematika","Bapak/Ibu Guru","X APAT 1"],["10:15","11:45","Produktif APAT","Bapak/Ibu Guru","Lab APAT"],["12:30","14:00","Pendidikan Agama","Bapak/Ibu Guru","X APAT 1"]],
selasa:[["07:00","08:30","Bahasa Inggris","Bapak/Ibu Guru","X APAT 1"],["08:30","10:00","Produktif APAT","Bapak/Ibu Guru","Lab APAT"],["10:15","11:45","IPAS","Bapak/Ibu Guru","X APAT 1"],["12:30","14:00","PJOK","Bapak/Ibu Guru","Lapangan"]],
rabu:[["07:00","08:30","Matematika","Bapak/Ibu Guru","X APAT 1"],["08:30","10:00","Bahasa Inggris","Bapak/Ibu Guru","X APAT 1"],["10:15","11:45","Produktif APAT","Bapak/Ibu Guru","Lab APAT"],["12:30","14:00","Sejarah","Bapak/Ibu Guru","X APAT 1"]],
kamis:[["07:00","08:30","Bahasa Indonesia","Bapak/Ibu Guru","X APAT 1"],["08:30","10:00","Produktif APAT","Bapak/Ibu Guru","Lab APAT"],["10:15","11:45","Pendidikan Pancasila","Bapak/Ibu Guru","X APAT 1"],["12:30","14:00","Seni Budaya","Bapak/Ibu Guru","X APAT 1"]],
jumat:[["07:00","08:30","Pendidikan Agama","Bapak/Ibu Guru","X APAT 1"],["08:30","10:00","Bahasa Inggris","Bapak/Ibu Guru","X APAT 1"],["10:15","11:45","Produktif APAT","Bapak/Ibu Guru","Lab APAT"]]};

const announcements=[
{title:"Selamat Datang di CLASSHUB",content:"CLASSHUB merupakan pusat informasi digital untuk seluruh anggota X APAT 1.",type:"info",label:"INFO",date:"14 Agustus 2026"},
{title:"Persiapan Kegiatan Kelas",content:"Mohon seluruh siswa memperhatikan informasi kegiatan kelas yang akan datang.",type:"important",label:"PENTING",date:"14 Agustus 2026"},
{title:"Jaga Kebersihan Kelas",content:"Jangan lupa melaksanakan jadwal piket sesuai pembagian masing-masing.",type:"info",label:"INFO",date:"13 Agustus 2026"}];

const dutySchedule={
senin:["Aditya Pratama","Daffa Nurkhalish","Fajar Ramadhan","Galang Pratama","Hafiz Maulana","Rizal Maulana","Salsa Putri"],
selasa:["Ahmad Fauzan","Bima Setiawan","Dani Kurniawan","Ilham Saputra","Nanda Putra","Tasya Amelia","Wahyu Hidayat"],
rabu:["Aldi Saputra","Bagas Ramadhan","Dimas Saputra","Joko Susanto","Naufal Ramadhan","Vina Lestari","Yogi Prasetyo"],
kamis:["Andika Wijaya","Cahyo Nugroho","Fauzan Akbar","Kevin Alvaro","Noval Ardiansyah","Raka Aditya","Zaki Ramadhan"],
jumat:["M. Rizky","M. Fadli","Lukman Hakim","Putra Wijaya","Reza Fahlevi","Siti Aisyah"]};

const dayNames={senin:"Senin",selasa:"Selasa",rabu:"Rabu",kamis:"Kamis",jumat:"Jumat"};

function initials(name){const w=name.split(" ");return (w.length===1?w[0].slice(0,2):w[0][0]+w[1][0]).toUpperCase()}
function todayKey(){return {1:"senin",2:"selasa",3:"rabu",4:"kamis",5:"jumat"}[new Date().getDay()]||"senin"}

function updateClock(){const n=new Date();document.getElementById("currentDate").textContent=n.toLocaleDateString("id-ID",{weekday:"long",day:"numeric",month:"long",year:"numeric"});document.getElementById("currentTime").textContent=n.toLocaleTimeString("id-ID",{hour:"2-digit",minute:"2-digit",second:"2-digit"})+" WIB";const h=n.getHours();document.getElementById("greeting").textContent=h<11?"Selamat pagi":h<15?"Selamat siang":h<18?"Selamat sore":"Selamat malam"}
updateClock();setInterval(updateClock,1000);

function renderStudents(list){const grid=document.getElementById("studentsGrid");grid.innerHTML="";list.forEach((name,i)=>{const c=document.createElement("div");c.className="student-card";c.innerHTML=`<div class="student-avatar">${initials(name)}</div><div><h4>${name}</h4><p>X APAT 1 · Siswa</p></div><span class="student-number">${String(i+1).padStart(2,"0")}</span>`;grid.appendChild(c)});document.getElementById("searchResultCount").textContent=list.length;document.getElementById("studentEmpty").classList.toggle("show",!list.length)}
const search=document.getElementById("studentSearch");const clear=document.getElementById("clearSearch");search.addEventListener("input",()=>{const q=search.value.toLowerCase().trim();renderStudents(students.filter(s=>s.toLowerCase().includes(q)));clear.style.display=q?"block":"none"});clear.addEventListener("click",()=>{search.value="";search.dispatchEvent(new Event("input"));search.focus()});renderStudents(students);

function renderSchedule(day){const data=schedules[day]||[];document.getElementById("scheduleDayTitle").textContent=dayNames[day];document.getElementById("scheduleCount").textContent=data.length;document.getElementById("scheduleList").innerHTML=data.map(x=>`<div class="schedule-row"><div class="schedule-time"><strong>${x[0]}</strong><small>${x[1]}</small></div><div class="timeline-dot"></div><div class="schedule-subject"><strong>${x[2]}</strong><small>${x[3]}</small></div><div class="schedule-room">${x[4]}</div></div>`).join("")}
document.querySelectorAll(".day-tab").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".day-tab").forEach(x=>x.classList.remove("active"));b.classList.add("active");renderSchedule(b.dataset.day)}));renderSchedule("senin");

function renderAnnouncements(){document.getElementById("dashboardAnnouncements").innerHTML=announcements.map(a=>`<div class="announcement-item"><div class="announcement-top"><div><h4>${a.title}</h4><p>${a.content}</p></div><span class="badge ${a.type}">${a.label}</span></div><div class="announcement-date">${a.date}</div></div>`).slice(0,3).join("");document.getElementById("announcementList").innerHTML=announcements.map(a=>`<article class="announcement-large"><span class="badge ${a.type}">${a.label}</span><h3>${a.title}</h3><p>${a.content}</p><div class="announcement-meta"><span><i class="fa-regular fa-calendar"></i> ${a.date}</span><span><i class="fa-solid fa-user-shield"></i> Admin Kelas</span></div></article>`).join("")}
renderAnnouncements();

function renderDuty(){const t=todayKey();const members=dutySchedule[t]||[];document.getElementById("dashboardDuty").innerHTML=members.map(n=>`<div class="duty-member"><div class="duty-avatar">${initials(n)}</div><strong>${n}</strong></div>`).join("");document.getElementById("todayDutyCount").textContent=members.length;document.getElementById("dutyGrid").innerHTML=Object.keys(dutySchedule).map(d=>`<div class="duty-day ${d===t?"today":""}"><div class="duty-day-header"><h3>${dayNames[d]}</h3>${d===t?'<span class="today-label">HARI INI</span>':""}</div><div class="duty-list">${dutySchedule[d].map(n=>`<div class="duty-list-item"><div class="duty-avatar">${initials(n)}</div><div><strong>${n}</strong><small>Petugas piket</small></div></div>`).join("")}</div></div>`).join("")}
renderDuty();

function renderDashboardSchedule(){const d=todayKey(),data=schedules[d]||[];document.getElementById("todayScheduleCount").textContent=data.length;document.getElementById("dashboardSchedule").innerHTML=data.map(x=>`<div class="mini-schedule"><div class="time-box"><strong>${x[0]}</strong><small>${x[1]}</small></div><div class="schedule-dot"></div><div class="mini-schedule-info"><strong>${x[2]}</strong><small>${x[3]}</small></div></div>`).join("")}
renderDashboardSchedule();

const pageNames={dashboard:"Dashboard",students:"Daftar Siswa",schedule:"Jadwal Pelajaran",announcements:"Pengumuman",duty:"Jadwal Piket",about:"Tentang Kelas"};
function openSection(id){document.querySelectorAll(".page-section").forEach(s=>s.classList.toggle("active",s.id===id));document.querySelectorAll(".nav-item").forEach(n=>n.classList.toggle("active",n.dataset.section===id));document.getElementById("pageLabel").textContent=pageNames[id];window.scrollTo({top:0,behavior:"smooth"});closeSidebar()}
document.querySelectorAll(".nav-item").forEach(n=>n.addEventListener("click",()=>openSection(n.dataset.section)));
document.querySelectorAll("[data-target]").forEach(b=>b.addEventListener("click",()=>openSection(b.dataset.target)));

const sidebar=document.getElementById("sidebar"),menu=document.getElementById("menuButton"),overlay=document.getElementById("sidebarOverlay");
function closeSidebar(){sidebar.classList.remove("open");overlay.classList.remove("show")}
menu.addEventListener("click",()=>{sidebar.classList.add("open");overlay.classList.add("show")});overlay.addEventListener("click",closeSidebar);
document.addEventListener("keydown",e=>{if(e.key==="/"&&document.activeElement.tagName!=="INPUT"){e.preventDefault();openSection("students");search.focus()}});
console.log("CLASSHUB V1.0 — X APAT 1");
