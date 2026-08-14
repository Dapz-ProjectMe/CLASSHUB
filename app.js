import { supabase } from "./supabase/client.js";

const SUPABASE = supabase;

const names = {
  senin: "Senin",
  selasa: "Selasa",
  rabu: "Rabu",
  kamis: "Kamis",
  jumat: "Jumat"
};

const keys = Object.keys(names);

let students = [];
let schedules = {
  senin: [],
  selasa: [],
  rabu: [],
  kamis: [],
  jumat: []
};

let duty = {
  senin: [],
  selasa: [],
  rabu: [],
  kamis: [],
  jumat: []
};

let announcements = [];

/* =========================
   HELPER
========================= */

const initials = name => {
  const parts = String(name || "")
    .trim()
    .split(/\s+/);

  if (parts.length > 1) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  return String(parts[0] || "")
    .slice(0, 2)
    .toUpperCase();
};

const esc = value =>
  String(value ?? "").replace(
    /[&<>"']/g,
    char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[char])
  );

const today = () => {
  return {
    1: "senin",
    2: "selasa",
    3: "rabu",
    4: "kamis",
    5: "jumat"
  }[new Date().getDay()] || "senin";
};

const getValue = (obj, fields, fallback = "") => {
  for (const field of fields) {
    if (
      obj &&
      obj[field] !== undefined &&
      obj[field] !== null &&
      obj[field] !== ""
    ) {
      return obj[field];
    }
  }

  return fallback;
};

const normalizeDay = value => {
  const day = String(value || "")
    .toLowerCase()
    .trim();

  if (day.startsWith("sen")) return "senin";
  if (day.startsWith("sel")) return "selasa";
  if (day.startsWith("rab")) return "rabu";
  if (day.startsWith("kam")) return "kamis";
  if (day.startsWith("jum")) return "jumat";

  return day;
};

const formatTime = value => {
  if (!value) return "";
  return String(value).slice(0, 5);
};

const setText = (id, value) => {
  const element = document.getElementById(id);

  if (element) {
    element.textContent = value;
  }
};

/* =========================
   CLOCK
========================= */

function updateClock() {
  const date = new Date();
  const hour = date.getHours();

  setText(
    "date",
    date.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    })
  );

  setText(
    "time",
    date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }) + " WIB"
  );

  let greeting = "☀ SELAMAT PAGI";

  if (hour >= 11 && hour < 15) {
    greeting = "☀ SELAMAT SIANG";
  } else if (hour >= 15 && hour < 18) {
    greeting = "☀ SELAMAT SORE";
  } else if (hour >= 18) {
    greeting = "☾ SELAMAT MALAM";
  }

  setText(
    "greeting",
    greeting + " • CLASS MANAGEMENT SYSTEM"
  );
}

updateClock();
setInterval(updateClock, 1000);

/* =========================
   STUDENTS
========================= */

function renderStudents(list) {
  const grid = document.getElementById("studentsGrid");

  grid.innerHTML = list
    .map((student, index) => {
      const name = student.name || "Tanpa Nama";
      const className = student.class_name || "X APAT 1";

      return `
        <article class="student">
          <i class="avatar">${initials(name)}</i>

          <div>
            <h4>${esc(name)}</h4>
            <p>${esc(className)} · Siswa</p>
          </div>

          <span class="num">
            ${String(index + 1).padStart(2, "0")}
          </span>
        </article>
      `;
    })
    .join("");

  setText("result", list.length);
  setText("totalStudents", students.length);
  setText("studentPill", `${students.length} siswa`);

  document
    .getElementById("empty")
    .classList.toggle("show", list.length === 0);
}

async function loadStudents() {
  const { data, error } = await SUPABASE
    .from("students")
    .select("*")
    .order("name", {
      ascending: true
    });

  if (error) {
    throw new Error(
      "Gagal mengambil data siswa: " + error.message
    );
  }

  students = (data || []).map(student => ({
    id: student.id,

    name: getValue(
      student,
      ["name", "full_name", "student_name"],
      "Tanpa Nama"
    ),

    class_name: getValue(
      student,
      ["class_name", "class", "kelas"],
      "X APAT 1"
    ),

    student_number: getValue(
      student,
      ["student_number", "number", "no"],
      ""
    )
  }));

  renderStudents(students);
}

/* =========================
   SCHEDULE
========================= */

function renderSchedule(day) {
  const data = schedules[day] || [];

  setText("dayTitle", names[day] || day);
  setText("schedCount", data.length);

  document.getElementById("scheduleList").innerHTML =
    data
      .map(item => {
        return `
          <div class="scheduleRow">

            <time>
              <b>${esc(item.start)}</b>
              <small>${esc(item.end)}</small>
            </time>

            <i class="dot"></i>

            <div class="subject">
              <b>${esc(item.subject)}</b>
              <small>${esc(item.teacher)}</small>
            </div>

            <span class="room">
              ${esc(item.room)}
            </span>

          </div>
        `;
      })
      .join("");
}

function renderDays() {
  document.getElementById("days").innerHTML =
    keys
      .map(day => {
        return `
          <button
            class="day"
            data-day="${day}"
          >
            <b>${names[day].slice(0, 3)}</b>
            <small>${names[day]}</small>
          </button>
        `;
      })
      .join("");

  document
    .querySelectorAll(".day")
    .forEach(button => {
      button.onclick = () => {

        document
          .querySelectorAll(".day")
          .forEach(item =>
            item.classList.remove("active")
          );

        button.classList.add("active");

        renderSchedule(
          button.dataset.day
        );
      };
    });

  const currentDay = today();

  const activeButton =
    document.querySelector(
      `[data-day="${currentDay}"]`
    );

  if (activeButton) {
    activeButton.classList.add("active");
  }

  renderSchedule(currentDay);
}

async function loadSchedules() {
  const { data, error } = await SUPABASE
    .from("schedules")
    .select("*");

  if (error) {
    throw new Error(
      "Gagal mengambil jadwal: " + error.message
    );
  }

  schedules = {
    senin: [],
    selasa: [],
    rabu: [],
    kamis: [],
    jumat: []
  };

  (data || []).forEach(item => {

    const day = normalizeDay(
      getValue(
        item,
        ["day", "day_name", "hari"],
        ""
      )
    );

    if (!schedules[day]) return;

    schedules[day].push({
      start: formatTime(
        getValue(
          item,
          ["start_time", "start", "mulai"],
          ""
        )
      ),

      end: formatTime(
        getValue(
          item,
          ["end_time", "end", "selesai"],
          ""
        )
      ),

      subject: getValue(
        item,
        [
          "subject",
          "subject_name",
          "lesson",
          "mata_pelajaran"
        ],
        "Pelajaran"
      ),

      teacher: getValue(
        item,
        [
          "teacher",
          "teacher_name",
          "guru"
        ],
        "Bapak/Ibu Guru"
      ),

      room: getValue(
        item,
        [
          "room",
          "room_name",
          "ruangan"
        ],
        "X APAT 1"
      )
    });
  });

  keys.forEach(day => {
    schedules[day].sort(
      (a, b) =>
        a.start.localeCompare(b.start)
    );
  });

  renderDays();
}

/* =========================
   ANNOUNCEMENTS
========================= */

function renderAnnouncements() {

  document.getElementById(
    "dashAnnouncements"
  ).innerHTML = announcements
    .slice(0, 2)
    .map(item => {

      return `
        <div class="announcement">
          <h4>${esc(item.title)}</h4>
          <p>${esc(item.body)}</p>
          <small>${esc(item.date)}</small>
        </div>
      `;

    })
    .join("");

  document.getElementById(
    "announceList"
  ).innerHTML = announcements
    .map(item => {

      return `
        <article class="largeAnn">

          <span class="badge">
            INFO
          </span>

          <h2>
            ${esc(item.title)}
          </h2>

          <p>
            ${esc(item.body)}
          </p>

          <div class="meta">
            <i class="fa-regular fa-calendar"></i>
            ${esc(item.date)}
            · Admin Kelas
          </div>

        </article>
      `;

    })
    .join("");
}

async function loadAnnouncements() {

  const { data, error } =
    await SUPABASE
      .from("announcements")
      .select("*")
      .order("created_at", {
        ascending: false
      });

  if (error) {
    throw new Error(
      "Gagal mengambil pengumuman: " +
      error.message
    );
  }

  announcements = (data || []).map(item => {

    const rawDate = getValue(
      item,
      [
        "date",
        "published_at",
        "created_at"
      ],
      ""
    );

    return {
      title: getValue(
        item,
        ["title", "judul"],
        "Pengumuman"
      ),

      body: getValue(
        item,
        [
          "body",
          "content",
          "description",
          "isi"
        ],
        ""
      ),

      date: String(rawDate).slice(0, 10)
    };
  });

  renderAnnouncements();
}

/* =========================
   DUTY
========================= */

function renderDashboard() {

  const currentDay = today();

  const scheduleToday =
    schedules[currentDay] || [];

  const dutyToday =
    duty[currentDay] || [];

  setText(
    "todayCount",
    scheduleToday.length
  );

  setText(
    "dutyCount",
    dutyToday.length
  );

  document.getElementById(
    "dashSchedule"
  ).innerHTML = scheduleToday
    .map(item => {

      return `
        <div class="minirow">

          <time>
            <b>${esc(item.start)}</b>
            <small>${esc(item.end)}</small>
          </time>

          <i class="dot"></i>

          <div>
            <strong>
              ${esc(item.subject)}
            </strong>

            <p>
              ${esc(item.teacher)}
            </p>
          </div>

        </div>
      `;

    })
    .join("");

  document.getElementById(
    "dashDuty"
  ).innerHTML = dutyToday
    .map(name => {

      return `
        <div class="person">
          <i>${initials(name)}</i>
          <b>${esc(name)}</b>
        </div>
      `;

    })
    .join("");

  document.getElementById(
    "dutyGrid"
  ).innerHTML = keys
    .map(day => {

      return `
        <article
          class="dutyday ${day === currentDay ? "today" : ""}"
        >

          <div class="dutyhead">

            <h3>
              ${names[day]}
            </h3>

            ${
              day === currentDay
                ? `<span class="today">HARI INI</span>`
                : ""
            }

          </div>

          ${(duty[day] || [])
            .map(name => {

              return `
                <div class="dutyitem">
                  <i>${initials(name)}</i>
                  <b>${esc(name)}</b>
                </div>
              `;

            })
            .join("")}

        </article>
      `;

    })
    .join("");
}

async function loadDuty() {

  const { data, error } =
    await SUPABASE
      .from("duty_rosters")
      .select("*");

  if (error) {
    throw new Error(
      "Gagal mengambil jadwal piket: " +
      error.message
    );
  }

  duty = {
    senin: [],
    selasa: [],
    rabu: [],
    kamis: [],
    jumat: []
  };

  const studentMap =
    new Map(
      students.map(student => [
        String(student.id),
        student.name
      ])
    );

  (data || []).forEach(item => {

    const day =
      normalizeDay(
        getValue(
          item,
          ["day", "day_name", "hari"],
          ""
        )
      );

    if (!duty[day]) return;

    let name =
      getValue(
        item,
        [
          "name",
          "student_name",
          "student"
        ],
        ""
      );

    const studentId =
      getValue(
        item,
        [
          "student_id",
          "studentId",
          "id_student"
        ],
        ""
      );

    if (!name && studentId) {
      name =
        studentMap.get(
          String(studentId)
        ) || "";
    }

    if (name) {
      duty[day].push(
        String(name)
      );
    }
  });

  renderDashboard();
}

/* =========================
   SEARCH
========================= */

const searchInput =
  document.getElementById("search");

const clearButton =
  document.getElementById("clear");

searchInput.addEventListener(
  "input",
  () => {

    const query =
      searchInput.value
        .toLowerCase()
        .trim();

    const result =
      students.filter(
        student =>
          student.name
            .toLowerCase()
            .includes(query)
      );

    renderStudents(result);

    clearButton.style.display =
      query ? "block" : "none";
  }
);

clearButton.onclick = () => {

  searchInput.value = "";

  searchInput.dispatchEvent(
    new Event("input")
  );

  searchInput.focus();
};

/* =========================
   NAVIGATION
========================= */

const titles = {
  dashboard: "Dashboard",
  students: "Daftar Siswa",
  schedule: "Jadwal Pelajaran",
  announcements: "Pengumuman",
  duty: "Jadwal Piket",
  about: "Tentang"
};

function go(page) {

  document
    .querySelectorAll(".page")
    .forEach(element => {

      element.classList.toggle(
        "active",
        element.id === page
      );

    });

  document
    .querySelectorAll(".nav")
    .forEach(element => {

      element.classList.toggle(
        "active",
        element.dataset.page === page
      );

    });

  setText(
    "pageTitle",
    titles[page] || page
  );

  closeMenu();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

document
  .querySelectorAll(".nav")
  .forEach(button => {

    button.onclick = () =>
      go(button.dataset.page);

  });

document
  .querySelectorAll("[data-go]")
  .forEach(button => {

    button.onclick = () =>
      go(button.dataset.go);

  });

/* =========================
   MOBILE MENU
========================= */

const sidebar =
  document.getElementById("sidebar");

const backdrop =
  document.getElementById("backdrop");

function closeMenu() {

  sidebar.classList.remove("open");

  backdrop.classList.remove("show");
}

document
  .getElementById("menuBtn")
  .onclick = () => {

    sidebar.classList.add("open");

    backdrop.classList.add("show");

  };

backdrop.onclick =
  closeMenu;

/* =========================
   ADMIN MODAL
========================= */

const modal =
  document.getElementById("modal");

document
  .getElementById("adminBtn")
  .onclick = () =>
    modal.classList.add("show");

document
  .getElementById("closeModal")
  .onclick = () =>
    modal.classList.remove("show");

modal.onclick = event => {

  if (event.target === modal) {
    modal.classList.remove("show");
  }

};

function showToast(message) {

  modal.classList.remove("show");

  const toast =
    document.getElementById("toast");

  toast.textContent =
    message + " siap dikembangkan.";

  toast.classList.add("show");

  setTimeout(
    () =>
      toast.classList.remove("show"),
    2200
  );
}

/* =========================
   LOAD DATABASE
========================= */

async function loadAll() {

  try {

    await loadStudents();

    await Promise.all([
      loadSchedules(),
      loadAnnouncements()
    ]);

    await loadDuty();

    console.log(
      "CLASSHUB berhasil terhubung ke Supabase."
    );

  } catch (error) {

    console.error(
      "CLASSHUB DATABASE ERROR:",
      error
    );

    const toast =
      document.getElementById("toast");

    toast.textContent =
      "Database error: " +
      error.message;

    toast.classList.add("show");

    setTimeout(
      () =>
        toast.classList.remove("show"),
      6000
    );
  }
}

loadAll();
