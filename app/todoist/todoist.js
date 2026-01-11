let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let selected = null;
let view = "inbox";

const list = document.getElementById("task-list");
const title = document.getElementById("view-title");
const count = document.getElementById("task-count");
const empty = document.getElementById("empty");

const detail = document.getElementById("detail");
const dTitle = document.getElementById("detail-title");
const dNotes = document.getElementById("detail-notes");
const dDate = document.getElementById("detail-date");
const dPriority = document.getElementById("detail-priority");

document.getElementById("new-task-btn").onclick = () => {
  const t = {
    id: Date.now(),
    title: "New task",
    notes: "",
    date: "",
    priority: 2,
    completed: false,
    order: Date.now()
  };
  tasks.unshift(t);
  save();
  open(t.id);
};

document.querySelectorAll(".menu li").forEach(li => {
  li.onclick = () => {
    document.querySelector(".menu .active").classList.remove("active");
    li.classList.add("active");
    view = li.dataset.view;
    title.textContent = li.textContent;
    render();
  };
});

document.getElementById("search").oninput = render;
document.getElementById("sort").onchange = render;

document.getElementById("clear-completed").onclick = () => {
  tasks = tasks.filter(t => !t.completed);
  save();
};

function render() {
  list.innerHTML = "";

  let filtered = tasks.filter(t => {
    if (view === "today") return t.date === today();
    if (view === "upcoming") return t.date > today();
    return true;
  });

  const q = document.getElementById("search").value.toLowerCase();
  filtered = filtered.filter(t => t.title.toLowerCase().includes(q));

  const sort = document.getElementById("sort").value;
  if (sort === "date") filtered.sort((a, b) => (a.date || "9999").localeCompare(b.date || "9999"));
  if (sort === "priority") filtered.sort((a, b) => a.priority - b.priority);
  if (sort === "manual") filtered.sort((a, b) => a.order - b.order);

  empty.style.display = filtered.length ? "none" : "block";
  count.textContent = `${tasks.length} tasks`;

  filtered.forEach(t => {
    const li = document.createElement("li");
    li.className = `task ${t.completed ? "completed" : ""} ${selected?.id === t.id ? "selected" : ""}`;

    li.innerHTML = `
      <input type="checkbox" ${t.completed ? "checked" : ""}>
      <span contenteditable>${t.title}</span>
      ${t.date ? `<span class="badge">${t.date}</span>` : ""}
      <span class="badge p${t.priority}">P${t.priority}</span>
    `;

    li.querySelector("input").onclick = e => {
      t.completed = e.target.checked;
      save();
    };

    li.querySelector("span").onblur = e => {
      t.title = e.target.textContent;
      save();
    };

    li.onclick = e => {
      if (e.target.tagName !== "INPUT") open(t.id);
    };

    list.appendChild(li);
  });
}

function open(id) {
  selected = tasks.find(t => t.id === id);
  detail.classList.remove("hidden");

  dTitle.value = selected.title;
  dNotes.value = selected.notes;
  dDate.value = selected.date;
  dPriority.value = selected.priority;

  render();
}

[dTitle, dNotes, dDate, dPriority].forEach(el => {
  el.oninput = () => {
    if (!selected) return;
    selected.title = dTitle.value;
    selected.notes = dNotes.value;
    selected.date = dDate.value;
    selected.priority = dPriority.value;
    save();
  };
});

document.getElementById("delete-task").onclick = () => {
  tasks = tasks.filter(t => t !== selected);
  selected = null;
  detail.classList.add("hidden");
  save();
};

function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  render();
}

function today() {
  return new Date().toISOString().split("T")[0];
}

render();