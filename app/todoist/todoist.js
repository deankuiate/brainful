let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let selected = null;
let view = "inbox";

const list = document.getElementById("task-list");
const title = document.getElementById("view-title");

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
    completed: false
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

function render() {
  list.innerHTML = "";

  tasks
    .filter(t => {
      if (view === "today") return t.date === today();
      if (view === "upcoming") return t.date > today();
      return true;
    })
    .forEach(t => {
      const li = document.createElement("li");
      li.className = `task ${t.completed ? "completed" : ""}`;
      li.innerHTML = `
        <input type="checkbox" ${t.completed ? "checked" : ""}>
        <span>${t.title}</span>
      `;

      li.querySelector("input").onclick = e => {
        t.completed = e.target.checked;
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