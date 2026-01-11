let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let selected = null;
let view = "today";
let dragged = null;

const list = document.getElementById("task-list");
const title = document.getElementById("view-title");
const empty = document.getElementById("empty");

const detail = document.getElementById("detail");
const dTitle = document.getElementById("detail-title");
const dNotes = document.getElementById("detail-notes");
const dDate = document.getElementById("detail-date");
const dateWrapper = document.getElementById("date-wrapper");

/* ============================= */
/* NEW TASK */
/* ============================= */

document.getElementById("new-task-btn").onclick = () => {
  createTask();
};

function createTask() {
  const t = {
    id: Date.now(),
    title: "New task",
    notes: "",
    date: view === "today" ? today() : "",
    completed: false,
    order: Date.now()
  };
  tasks.unshift(t);
  save();
  open(t.id);

  setTimeout(() => {
    const el = document.querySelector(".task span");
    if (el) {
      el.focus();
      document.execCommand("selectAll", false, null);
    }
  }, 0);
}

/* ============================= */
/* VIEW SWITCH */
/* ============================= */

document.querySelectorAll(".menu li").forEach(li => {
  li.onclick = () => {
    document.querySelector(".menu .active").classList.remove("active");
    li.classList.add("active");
    view = li.dataset.view;
    title.textContent = li.textContent;
    detail.classList.add("hidden");
    render();
  };
});

/* ============================= */
/* RENDER */
/* ============================= */

function render() {
  list.innerHTML = "";

  let filtered = tasks.filter(t => {
    if (view === "today") return t.date === today();
    if (view === "upcoming") return t.date && t.date !== today();
  });

  filtered.sort((a, b) => a.order - b.order);

  empty.textContent =
    view === "today"
      ? "Your mind is clear. Nothing for today."
      : "Nothing planned yet.";

  empty.style.display = filtered.length ? "none" : "block";

  filtered.forEach(t => {
    const li = document.createElement("li");
    li.className = `task ${t.completed ? "completed" : ""}`;
    li.draggable = true;

    const span = document.createElement("span");
    span.textContent = t.title;
    span.contentEditable = true;

    span.oninput = () => {
      t.title = span.textContent.trim() || "Untitled";
      save(false);
    };

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = t.completed;

    checkbox.onchange = () => {
      t.completed = checkbox.checked;
      save();
    };

    li.appendChild(checkbox);
    li.appendChild(span);

    li.onclick = e => {
      if (e.target !== checkbox) open(t.id);
    };

    /* DRAG */
    li.ondragstart = () => {
      dragged = t;
      li.classList.add("dragging");
    };

    li.ondragend = () => {
      dragged = null;
      li.classList.remove("dragging");
      save();
    };

    li.ondragover = e => e.preventDefault();

    li.ondrop = () => {
      if (!dragged) return;
      const temp = t.order;
      t.order = dragged.order;
      dragged.order = temp;
      save();
    };

    list.appendChild(li);
  });
}

/* ============================= */
/* OPEN DETAIL */
/* ============================= */

function open(id) {
  selected = tasks.find(t => t.id === id);
  if (!selected) return;

  detail.classList.remove("hidden");

  dTitle.value = selected.title;
  dNotes.value = selected.notes;
  dDate.value = selected.date;

  // Hide date in Today view
  dateWrapper.style.display = view === "today" ? "none" : "block";

  render();
}

/* ============================= */
/* EDIT DETAIL */
/* ============================= */

[dTitle, dNotes, dDate].forEach(el => {
  el.oninput = () => {
    if (!selected) return;
    selected.title = dTitle.value;
    selected.notes = dNotes.value;
    selected.date = dDate.value;
    save(false);
  };
});

/* ============================= */
/* DELETE */
/* ============================= */

document.getElementById("delete-task").onclick = () => {
  if (!selected) return;
  tasks = tasks.filter(t => t !== selected);
  selected = null;
  detail.classList.add("hidden");
  save();
};

/* ============================= */
/* KEYBOARD SHORTCUTS */
/* ============================= */

document.addEventListener("keydown", e => {
  if (e.key === "Enter" && document.activeElement.tagName !== "TEXTAREA") {
    e.preventDefault();
    createTask();
  }

  if (e.key === "Delete" && selected) {
    tasks = tasks.filter(t => t !== selected);
    selected = null;
    detail.classList.add("hidden");
    save();
  }
});

/* ============================= */
/* SAVE */
/* ============================= */

function save(rerender = true) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  if (rerender) render();
}

/* ============================= */
/* UTILS */
/* ============================= */

function today() {
  return new Date().toISOString().split("T")[0];
}

/* ============================= */
/* INIT */
/* ============================= */

render();