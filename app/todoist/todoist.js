// state
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let selected = null;
let view = "today";
let dragged = null;

// dom refs
const list = document.getElementById("task-list");
const title = document.getElementById("view-title");
const empty = document.getElementById("empty");

const detail = document.getElementById("detail");
const dTitle = document.getElementById("detail-title");
const dNotes = document.getElementById("detail-notes");
const dDate = document.getElementById("detail-date");
const dateWrapper = document.getElementById("date-wrapper");

// new task button
document.getElementById("new-task-btn").onclick = () => {
  createTask();
};

// create a blank task and open it
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

  // auto-select title text for immediate editing
  setTimeout(() => {
    const el = document.querySelector(".task span");
    if (el) {
      el.focus();
      document.execCommand("selectAll", false, null);
    }
  }, 0);
}

// sidebar view switching
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

// render task list for current view
function render() {
  list.innerHTML = "";

  let filtered = tasks.filter(t => {
    if (view === "today") {
      return t.date === today();
    }

    if (view === "upcoming") {
      // show tasks with a future date or no date yet
      return !t.date || t.date > today();
    }
  });

  filtered.sort((a, b) => a.order - b.order);

  empty.textContent =
    view === "today"
      ? "Your mind is clear. Nothing for today."
      : "No upcoming plans yet.";

  empty.style.display = filtered.length ? "none" : "block";

  filtered.forEach(t => {
    const li = document.createElement("li");
    li.className = `task ${t.completed ? "completed" : ""}`;
    li.draggable = true;

    const left = document.createElement("div");
    left.style.display = "flex";
    left.style.alignItems = "center";
    left.style.gap = "14px";

    // completion checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = t.completed;

    checkbox.onchange = () => {
      t.completed = checkbox.checked;
      save();
    };

    // inline editable title
    const span = document.createElement("span");
    span.textContent = t.title;
    span.contentEditable = true;

    span.oninput = () => {
      t.title = span.textContent.trim() || "Untitled";
      save(false);
    };

    left.appendChild(checkbox);
    left.appendChild(span);

    // date badge
    const right = document.createElement("div");
    right.className = "task-date";
    right.textContent = t.date ? formatDate(t.date) : "No date";

    li.appendChild(left);
    li.appendChild(right);

    // open detail panel on click
    li.onclick = e => {
      if (e.target !== checkbox) open(t.id);
    };

    // drag-to-reorder handlers
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

// open detail panel for a task
function open(id) {
  selected = tasks.find(t => t.id === id);
  if (!selected) return;

  detail.classList.remove("hidden");

  dTitle.value = selected.title;
  dNotes.value = selected.notes;
  dDate.value = selected.date;

  // hide date picker in today view
  dateWrapper.style.display = view === "today" ? "none" : "block";

  render();
}

// sync detail panel edits back to task
[dTitle, dNotes, dDate].forEach(el => {
  el.oninput = () => {
    if (!selected) return;
    selected.title = dTitle.value;
    selected.notes = dNotes.value;
    selected.date = dDate.value;
    save(false);
  };
});

// delete selected task
document.getElementById("delete-task").onclick = () => {
  if (!selected) return;
  tasks = tasks.filter(t => t !== selected);
  selected = null;
  detail.classList.add("hidden");
  save();
};

// keyboard shortcuts
document.addEventListener("keydown", e => {
  // enter creates a new task
  if (e.key === "Enter" && document.activeElement.tagName !== "TEXTAREA") {
    e.preventDefault();
    createTask();
  }

  // delete key removes selected task
  if (e.key === "Delete" && selected) {
    tasks = tasks.filter(t => t !== selected);
    selected = null;
    detail.classList.add("hidden");
    save();
  }
});

// persist and optionally re-render
function save(rerender = true) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  if (rerender) render();
}

// returns today's date as YYYY-MM-DD
function today() {
  return new Date().toISOString().split("T")[0];
}

// formats a YYYY-MM-DD string for display
function formatDate(d) {
  const date = new Date(d + "T00:00:00");
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric"
  });
}

// init
render();