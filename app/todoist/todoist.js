let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let selected = null;
let view = "today";

const list = document.getElementById("task-list");
const title = document.getElementById("view-title");
const empty = document.getElementById("empty");

const detail = document.getElementById("detail");
const dTitle = document.getElementById("detail-title");
const dNotes = document.getElementById("detail-notes");
const dDate = document.getElementById("detail-date");
const dateWrapper = document.getElementById("date-wrapper");

document.getElementById("new-task-btn").onclick = () => {
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
};

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

function render() {
  list.innerHTML = "";

  let filtered = tasks.filter(t => {
    if (view === "today") return t.date === today();
    if (view === "upcoming") return t.date && t.date !== today();
  });

  filtered.sort((a, b) => a.order - b.order);

  empty.style.display = filtered.length ? "none" : "block";

  filtered.forEach(t => {
    const li = document.createElement("li");
    li.className = `task ${t.completed ? "completed" : ""}`;
    li.draggable = true;

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

    // DRAG EVENTS
    li.ondragstart = () => {
      li.classList.add("dragging");
      dragged = t;
    };

    li.ondragend = () => {
      li.classList.remove("dragging");
      dragged = null;
      save();
    };

    li.ondragover = e => e.preventDefault();

    li.ondrop = () => {
      const temp = t.order;
      t.order = dragged.order;
      dragged.order = temp;
      save();
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

  // Hide date in Today
  dateWrapper.style.display = view === "today" ? "none" : "block";
}

[dTitle, dNotes, dDate].forEach(el => {
  el.oninput = () => {
    if (!selected) return;
    selected.title = dTitle.value;
    selected.notes = dNotes.value;
    selected.date = dDate.value;
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