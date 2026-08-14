import { supabase } from "./supabase/client.js";

const ADMIN = supabase;

let currentUser = null;

const modal = document.getElementById("modal");
const modalBox = modal?.querySelector(".modalbox");

const toast = message => {
  const el = document.getElementById("toast");

  if (!el) return;

  el.textContent = message;
  el.classList.add("show");

  setTimeout(() => {
    el.classList.remove("show");
  }, 2500);
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

/* =========================
   ADMIN BUTTON
========================= */

const adminButton =
  document.getElementById("adminBtn");

if (adminButton) {
  adminButton.addEventListener("click", () => {
    openAdmin();
  });
}

/* =========================
   OPEN ADMIN
========================= */

async function openAdmin() {

  if (!modal || !modalBox) return;

  const {
    data: {
      session
    }
  } = await ADMIN.auth.getSession();

  currentUser = session?.user || null;

  modal.classList.add("show");

  if (!currentUser) {
    renderLogin();
  } else {
    renderPanel();
  }
}

/* =========================
   LOGIN
========================= */

function renderLogin() {

  modalBox.innerHTML = `
    <button
      class="close"
      id="adminClose"
    >
      ×
    </button>

    <div class="adminLogo">
      <i class="fa-solid fa-shield-halved"></i>
    </div>

    <small>
      ADMINISTRATOR
    </small>

    <h2>
      Login Admin
    </h2>

    <p>
      Masuk untuk mengelola data CLASSHUB.
    </p>

    <form id="adminLoginForm">

      <label>
        Email Admin
      </label>

      <input
        id="adminEmail"
        type="email"
        placeholder="admin@email.com"
        required
      >

      <label>
        Password
      </label>

      <input
        id="adminPassword"
        type="password"
        placeholder="Password"
        required
      >

      <button
        class="adminPrimary"
        type="submit"
      >
        <i class="fa-solid fa-right-to-bracket"></i>
        Masuk sebagai Admin
      </button>

      <p
        id="loginError"
        class="adminError"
      ></p>

    </form>
  `;

  document
    .getElementById("adminClose")
    .onclick = () => modal.classList.remove("show");

  document
    .getElementById("adminLoginForm")
    .onsubmit = login;
}

/* =========================
   LOGIN ACTION
========================= */

async function login(event) {

  event.preventDefault();

  const email =
    document.getElementById("adminEmail").value.trim();

  const password =
    document.getElementById("adminPassword").value;

  const errorElement =
    document.getElementById("loginError");

  errorElement.textContent = "Memeriksa...";

  const {
    data,
    error
  } = await ADMIN.auth.signInWithPassword({
    email,
    password
  });

  if (error) {

    errorElement.textContent =
      "Login gagal: " + error.message;

    return;
  }

  currentUser = data.user;

  toast("Login admin berhasil");

  renderPanel();
}

/* =========================
   ADMIN PANEL
========================= */

function renderPanel() {

  modalBox.innerHTML = `
    <button
      class="close"
      id="adminClose"
    >
      ×
    </button>

    <div class="adminTop">

      <div>

        <small>
          ADMIN MODE
        </small>

        <h2>
          CLASSHUB Control Center
        </h2>

        <p>
          Kelola seluruh informasi kelas.
        </p>

      </div>

      <button
        id="logoutAdmin"
        class="logoutBtn"
      >
        Keluar
      </button>

    </div>


    <div class="adminTabs">

      <button
        class="adminTab active"
        data-admin-tab="students"
      >
        👥 Siswa
      </button>

      <button
        class="adminTab"
        data-admin-tab="schedule"
      >
        📚 Jadwal
      </button>

      <button
        class="adminTab"
        data-admin-tab="announcements"
      >
        📢 Pengumuman
      </button>

      <button
        class="adminTab"
        data-admin-tab="duty"
      >
        🧹 Piket
      </button>

    </div>


    <div
      id="adminContent"
      class="adminContent"
    ></div>
  `;

  document
    .getElementById("adminClose")
    .onclick = () =>
      modal.classList.remove("show");

  document
    .getElementById("logoutAdmin")
    .onclick = logout;

  document
    .querySelectorAll(".adminTab")
    .forEach(tab => {

      tab.onclick = () => {

        document
          .querySelectorAll(".adminTab")
          .forEach(x =>
            x.classList.remove("active")
          );

        tab.classList.add("active");

        renderAdminSection(
          tab.dataset.adminTab
        );
      };
    });

  renderAdminSection("students");
}

/* =========================
   LOGOUT
========================= */

async function logout() {

  await ADMIN.auth.signOut();

  currentUser = null;

  toast("Admin berhasil keluar");

  renderLogin();
}

/* =========================
   SECTION ROUTER
========================= */

function renderAdminSection(section) {

  if (section === "students") {
    renderStudentsAdmin();
  }

  if (section === "schedule") {
    renderScheduleAdmin();
  }

  if (section === "announcements") {
    renderAnnouncementsAdmin();
  }

  if (section === "duty") {
    renderDutyAdmin();
  }
}

/* =========================
   STUDENTS ADMIN
========================= */

async function renderStudentsAdmin() {

  const content =
    document.getElementById("adminContent");

  content.innerHTML = `
    <div class="adminSectionHead">

      <div>
        <small>
          DATABASE SISWA
        </small>

        <h3>
          Daftar Siswa
        </h3>
      </div>

      <button
        class="adminAdd"
        id="addStudent"
      >
        + Tambah
      </button>

    </div>

    <div id="studentAdminList">
      Memuat...
    </div>
  `;

  document
    .getElementById("addStudent")
    .onclick = () =>
      studentForm();

  const {
    data,
    error
  } = await ADMIN
    .from("students")
    .select("*")
    .order("name");

  if (error) {

    content.querySelector(
      "#studentAdminList"
    ).textContent =
      "Error: " + error.message;

    return;
  }

  const list =
    document.getElementById(
      "studentAdminList"
    );

  list.innerHTML =
    (data || [])
      .map(student => `

        <div class="adminItem">

          <div class="adminAvatar">
            ${esc(
              String(student.name || "?")
                .slice(0, 2)
                .toUpperCase()
            )}
          </div>

          <div class="adminItemInfo">

            <b>
              ${esc(student.name)}
            </b>

            <small>
              ${esc(
                student.class_name ||
                "X APAT 1"
              )}
            </small>

          </div>

          <div class="adminActions">

            <button
              onclick="window.editStudent('${student.id}')"
            >
              ✏️
            </button>

            <button
              onclick="window.deleteStudent('${student.id}')"
            >
              🗑️
            </button>

          </div>

        </div>

      `)
      .join("");
}

/* =========================
   STUDENT FORM
========================= */

function studentForm(student = null) {

  const content =
    document.getElementById("adminContent");

  content.innerHTML = `

    <div class="adminSectionHead">

      <div>

        <small>
          ${student ? "EDIT SISWA" : "SISWA BARU"}
        </small>

        <h3>
          ${student ? "Edit Siswa" : "Tambah Siswa"}
        </h3>

      </div>

      <button
        class="adminBack"
        id="backStudents"
      >
        ← Kembali
      </button>

    </div>


    <form id="studentForm">

      <label>
        Nama lengkap
      </label>

      <input
        id="studentName"
        required
        value="${esc(student?.name || "")}"
        placeholder="Nama siswa"
      >


      <label>
        Kelas
      </label>

      <input
        id="studentClass"
        value="${esc(
          student?.class_name ||
          "X APAT 1"
        )}"
        placeholder="X APAT 1"
      >


      <button
        class="adminPrimary"
        type="submit"
      >
        ${student ? "Simpan Perubahan" : "Tambah Siswa"}
      </button>

    </form>
  `;

  document
    .getElementById("backStudents")
    .onclick = renderStudentsAdmin;

  document
    .getElementById("studentForm")
    .onsubmit = async event => {

      event.preventDefault();

      const payload = {
        name:
          document
            .getElementById("studentName")
            .value
            .trim(),

        class_name:
          document
            .getElementById("studentClass")
            .value
            .trim()
      };

      let result;

      if (student) {

        result =
          await ADMIN
            .from("students")
            .update(payload)
            .eq("id", student.id);

      } else {

        result =
          await ADMIN
            .from("students")
            .insert(payload);
      }

      if (result.error) {

        toast(
          "Gagal: " +
          result.error.message
        );

        return;
      }

      toast(
        student
          ? "Siswa berhasil diperbarui"
          : "Siswa berhasil ditambahkan"
      );

      renderStudentsAdmin();
    };
}

/* =========================
   GLOBAL STUDENT FUNCTIONS
========================= */

window.editStudent = async id => {

  const {
    data,
    error
  } = await ADMIN
    .from("students")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {

    toast(error.message);

    return;
  }

  studentForm(data);
};


window.deleteStudent = async id => {

  if (
    !confirm(
      "Hapus siswa ini dari database?"
    )
  ) return;

  const {
    error
  } = await ADMIN
    .from("students")
    .delete()
    .eq("id", id);

  if (error) {

    toast(
      "Gagal menghapus: " +
      error.message
    );

    return;
  }

  toast("Siswa berhasil dihapus");

  renderStudentsAdmin();
};

/* =========================
   ANNOUNCEMENTS ADMIN
========================= */

async function renderAnnouncementsAdmin() {

  const content =
    document.getElementById("adminContent");

  content.innerHTML = `
    <div class="adminSectionHead">

      <div>

        <small>
          PUSAT INFORMASI
        </small>

        <h3>
          Pengumuman
        </h3>

      </div>

      <button
        class="adminAdd"
        id="addAnnouncement"
      >
        + Tambah
      </button>

    </div>

    <div id="announcementAdminList">
      Memuat...
    </div>
  `;

  document
    .getElementById("addAnnouncement")
    .onclick = () =>
      announcementForm();

  const {
    data,
    error
  } = await ADMIN
    .from("announcements")
    .select("*")
    .order("created_at", {
      ascending: false
    });

  if (error) {

    document
      .getElementById(
        "announcementAdminList"
      )
      .textContent =
      "Error: " + error.message;

    return;
  }

  document
    .getElementById(
      "announcementAdminList"
    )
    .innerHTML =
    (data || [])
      .map(item => `

        <div class="adminItem">

          <div class="adminItemInfo">

            <b>
              ${esc(item.title)}
            </b>

            <small>
              ${esc(item.body)}
            </small>

          </div>

          <div class="adminActions">

            <button
              onclick="window.editAnnouncement('${item.id}')"
            >
              ✏️
            </button>

            <button
              onclick="window.deleteAnnouncement('${item.id}')"
            >
              🗑️
            </button>

          </div>

        </div>

      `)
      .join("");
}

/* =========================
   ANNOUNCEMENT FORM
========================= */

function announcementForm(item = null) {

  const content =
    document.getElementById("adminContent");

  content.innerHTML = `

    <div class="adminSectionHead">

      <div>

        <small>
          PENGUMUMAN
        </small>

        <h3>
          ${item ? "Edit Pengumuman" : "Pengumuman Baru"}
        </h3>

      </div>

      <button
        class="adminBack"
        id="backAnnouncements"
      >
        ← Kembali
      </button>

    </div>


    <form id="announcementForm">

      <label>
        Judul
      </label>

      <input
        id="announcementTitle"
        required
        value="${esc(item?.title || "")}"
        placeholder="Judul pengumuman"
      >


      <label>
        Isi pengumuman
      </label>

      <textarea
        id="announcementBody"
        required
        rows="6"
        placeholder="Tulis pengumuman..."
      >${esc(item?.body || "")}</textarea>


      <button
        class="adminPrimary"
        type="submit"
      >
        ${item ? "Simpan Perubahan" : "Publikasikan"}
      </button>

    </form>
  `;

  document
    .getElementById("backAnnouncements")
    .onclick =
      renderAnnouncementsAdmin;

  document
    .getElementById("announcementForm")
    .onsubmit = async event => {

      event.preventDefault();

      const payload = {
        title:
          document
            .getElementById(
              "announcementTitle"
            )
            .value
            .trim(),

        body:
          document
            .getElementById(
              "announcementBody"
            )
            .value
            .trim()
      };

      let result;

      if (item) {

        result =
          await ADMIN
            .from("announcements")
            .update(payload)
            .eq("id", item.id);

      } else {

        result =
          await ADMIN
            .from("announcements")
            .insert(payload);
      }

      if (result.error) {

        toast(
          "Gagal: " +
          result.error.message
        );

        return;
      }

      toast(
        item
          ? "Pengumuman diperbarui"
          : "Pengumuman diterbitkan"
      );

      renderAnnouncementsAdmin();
    };
}

window.editAnnouncement =
  async id => {

    const {
      data,
      error
    } = await ADMIN
      .from("announcements")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {

      toast(error.message);

      return;
    }

    announcementForm(data);
  };


window.deleteAnnouncement =
  async id => {

    if (
      !confirm(
        "Hapus pengumuman ini?"
      )
    ) return;

    const {
      error
    } = await ADMIN
      .from("announcements")
      .delete()
      .eq("id", id);

    if (error) {

      toast(
        "Gagal menghapus: " +
        error.message
      );

      return;
    }

    toast(
      "Pengumuman berhasil dihapus"
    );

    renderAnnouncementsAdmin();
  };

/* =========================
   SCHEDULE ADMIN
========================= */

async function renderScheduleAdmin() {

  const content =
    document.getElementById("adminContent");

  content.innerHTML = `

    <div class="adminSectionHead">

      <div>

        <small>
          AKADEMIK
        </small>

        <h3>
          Jadwal Pelajaran
        </h3>

      </div>

      <button
        class="adminAdd"
        id="addSchedule"
      >
        + Tambah
      </button>

    </div>

    <div id="scheduleAdminList">
      Memuat...
    </div>
  `;

  document
    .getElementById("addSchedule")
    .onclick = () =>
      scheduleForm();

  const {
    data,
    error
  } = await ADMIN
    .from("schedules")
    .select("*")
    .order("start_time");

  if (error) {

    document
      .getElementById(
        "scheduleAdminList"
      )
      .textContent =
      "Error: " + error.message;

    return;
  }

  document
    .getElementById(
      "scheduleAdminList"
    )
    .innerHTML =
    (data || [])
      .map(item => `

        <div class="adminItem">

          <div class="adminItemInfo">

            <b>
              ${esc(item.subject)}
            </b>

            <small>
              ${esc(item.day)}
              · ${esc(item.start_time)}
              -
              ${esc(item.end_time)}
            </small>

          </div>

          <div class="adminActions">

            <button
              onclick="window.editSchedule('${item.id}')"
            >
              ✏️
            </button>

            <button
              onclick="window.deleteSchedule('${item.id}')"
            >
              🗑️
            </button>

          </div>

        </div>

      `)
      .join("");
}

/* =========================
   SCHEDULE FORM
========================= */

function scheduleForm(item = null) {

  const content =
    document.getElementById("adminContent");

  content.innerHTML = `

    <div class="adminSectionHead">

      <div>

        <small>
          JADWAL
        </small>

        <h3>
          ${item ? "Edit Jadwal" : "Tambah Jadwal"}
        </h3>

      </div>

      <button
        class="adminBack"
        id="backSchedule"
      >
        ← Kembali
      </button>

    </div>


    <form id="scheduleForm">

      <label>
        Hari
      </label>

      <select id="scheduleDay">

        <option value="senin">Senin</option>
        <option value="selasa">Selasa</option>
        <option value="rabu">Rabu</option>
        <option value="kamis">Kamis</option>
        <option value="jumat">Jumat</option>

      </select>


      <label>
        Mata Pelajaran
      </label>

      <input
        id="scheduleSubject"
        required
        value="${esc(item?.subject || "")}"
        placeholder="Contoh: Matematika"
      >


      <label>
        Guru
      </label>

      <input
        id="scheduleTeacher"
        value="${esc(item?.teacher || "")}"
        placeholder="Nama guru"
      >


      <label>
        Jam Mulai
      </label>

      <input
        id="scheduleStart"
        type="time"
        required
        value="${esc(item?.start_time || "")}"
      >


      <label>
        Jam Selesai
      </label>

      <input
        id="scheduleEnd"
        type="time"
        required
        value="${esc(item?.end_time || "")}"
      >


      <label>
        Ruangan
      </label>

      <input
        id="scheduleRoom"
        value="${esc(item?.room || "")}"
        placeholder="X APAT 1 / Lab APAT"
      >


      <button
        class="adminPrimary"
        type="submit"
      >
        ${item ? "Simpan Perubahan" : "Tambah Jadwal"}
      </button>

    </form>
  `;

  document
    .getElementById("scheduleDay")
    .value =
      item?.day || "senin";

  document
    .getElementById("backSchedule")
    .onclick =
      renderScheduleAdmin;

  document
    .getElementById("scheduleForm")
    .onsubmit = async event => {

      event.preventDefault();

      const payload = {

        day:
          document
            .getElementById(
              "scheduleDay"
            )
            .value,

        subject:
          document
            .getElementById(
              "scheduleSubject"
            )
            .value
            .trim(),

        teacher:
          document
            .getElementById(
              "scheduleTeacher"
            )
            .value
            .trim(),

        start_time:
          document
            .getElementById(
              "scheduleStart"
            )
            .value,

        end_time:
          document
            .getElementById(
              "scheduleEnd"
            )
            .value,

        room:
          document
            .getElementById(
              "scheduleRoom"
            )
            .value
            .trim()
      };

      let result;

      if (item) {

        result =
          await ADMIN
            .from("schedules")
            .update(payload)
            .eq("id", item.id);

      } else {

        result =
          await ADMIN
            .from("schedules")
            .insert(payload);
      }

      if (result.error) {

        toast(
          "Gagal: " +
          result.error.message
        );

        return;
      }

      toast(
        item
          ? "Jadwal diperbarui"
          : "Jadwal ditambahkan"
      );

      renderScheduleAdmin();
    };
}

window.editSchedule =
  async id => {

    const {
      data,
      error
    } = await ADMIN
      .from("schedules")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {

      toast(error.message);

      return;
    }

    scheduleForm(data);
  };


window.deleteSchedule =
  async id => {

    if (
      !confirm(
        "Hapus jadwal ini?"
      )
    ) return;

    const {
      error
    } = await ADMIN
      .from("schedules")
      .delete()
      .eq("id", id);

    if (error) {

      toast(
        "Gagal menghapus: " +
        error.message
      );

      return;
    }

    toast(
      "Jadwal berhasil dihapus"
    );

    renderScheduleAdmin();
  };

/* =========================
   DUTY ADMIN
========================= */

async function renderDutyAdmin() {

  const content =
    document.getElementById("adminContent");

  content.innerHTML = `

    <div class="adminSectionHead">

      <div>

        <small>
          KEBERSIHAN KELAS
        </small>

        <h3>
          Jadwal Piket
        </h3>

      </div>

      <button
        class="adminAdd"
        id="addDuty"
      >
        + Tambah
      </button>

    </div>

    <div id="dutyAdminList">
      Memuat...
    </div>
  `;

  document
    .getElementById("addDuty")
    .onclick = () =>
      dutyForm();

  const {
    data,
    error
  } = await ADMIN
    .from("duty_rosters")
    .select(`
      id,
      day,
      student_id,
      students (
        name
      )
    `)
    .order("day");

  if (error) {

    document
      .getElementById(
        "dutyAdminList"
      )
      .textContent =
      "Error: " + error.message;

    return;
  }

  document
    .getElementById(
      "dutyAdminList"
    )
    .innerHTML =
    (data || [])
      .map(item => `

        <div class="adminItem">

          <div class="adminItemInfo">

            <b>
              ${esc(
                item.students?.name ||
                "Siswa"
              )}
            </b>

            <small>
              ${esc(item.day)}
            </small>

          </div>

          <div class="adminActions">

            <button
              onclick="window.deleteDuty('${item.id}')"
            >
              🗑️
            </button>

          </div>

        </div>

      `)
      .join("");
}

/* =========================
   DUTY FORM
========================= */

async function dutyForm() {

  const {
    data: students,
    error
  } = await ADMIN
    .from("students")
    .select("id,name")
    .order("name");

  if (error) {

    toast(error.message);

    return;
  }

  const content =
    document.getElementById(
      "adminContent"
    );

  content.innerHTML = `

    <div class="adminSectionHead">

      <div>

        <small>
          PIKET
        </small>

        <h3>
          Tambah Petugas
        </h3>

      </div>

      <button
        class="adminBack"
        id="backDuty"
      >
        ← Kembali
      </button>

    </div>


    <form id="dutyForm">

      <label>
        Hari
      </label>

      <select id="dutyDay">

        <option value="senin">
          Senin
        </option>

        <option value="selasa">
          Selasa
        </option>

        <option value="rabu">
          Rabu
        </option>

        <option value="kamis">
          Kamis
        </option>

        <option value="jumat">
          Jumat
        </option>

      </select>


      <label>
        Siswa
      </label>

      <select id="dutyStudent">

        ${
          (students || [])
            .map(student => `
              <option value="${student.id}">
                ${esc(student.name)}
              </option>
            `)
            .join("")
        }

      </select>


      <button
        class="adminPrimary"
        type="submit"
      >
        Tambahkan ke Piket
      </button>

    </form>
  `;

  document
    .getElementById("backDuty")
    .onclick =
      renderDutyAdmin;

  document
    .getElementById("dutyForm")
    .onsubmit =
      async event => {

        event.preventDefault();

        const payload = {

          day:
            document
              .getElementById(
                "dutyDay"
              )
              .value,

          student_id:
            document
              .getElementById(
                "dutyStudent"
              )
              .value
        };

        const {
          error
        } = await ADMIN
          .from("duty_rosters")
          .insert(payload);

        if (error) {

          toast(
            "Gagal: " +
            error.message
          );

          return;
        }

        toast(
          "Petugas piket ditambahkan"
        );

        renderDutyAdmin();
      };
}

window.deleteDuty =
  async id => {

    if (
      !confirm(
        "Hapus petugas piket ini?"
      )
    ) return;

    const {
      error
    } = await ADMIN
      .from("duty_rosters")
      .delete()
      .eq("id", id);

    if (error) {

      toast(
        "Gagal menghapus: " +
        error.message
      );

      return;
    }

    toast(
      "Petugas piket dihapus"
    );

    renderDutyAdmin();
  };
