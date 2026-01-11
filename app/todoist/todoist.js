const addTaskBtn = document.querySelector(".add-task-btn");
const taskInputBox = document.querySelector(".task-input");
const saveTaskBtn = document.getElementById("save-task");
const cancelTaskBtn = document.getElementById("cancel-task");
const taskList = document.getElementById("task-list");
const taskText = document.getElementById("task-text");

const taskDetail = document.getElementById("task-detail");
const detailTitle = document.getElementById("detail-title");
const detailNotes = document.getElementById("detail-notes");
const closeDetailBtn = document.getElementById("close-detail");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let selectedTaskId = null;

/* ADD TASK */

addTaskBtn.onclick = () => {
  taskInputBox.classList.remove("hidden");
  taskText.focus();
};

cancelTaskBtn.onclick = () => {
  taskInputBox.classList.add("hidden");
  taskText.value = "";
};

saveTaskBtn.onclick = addTask;

taskText.addEventListener("keydown", e => {
  if (e.key === "Enter") addTask();
});

function addTask() {
  if (!taskText.value.trim()) return;

  tasks.push({
    id: Date.now(),
    text: taskText.value,
    notes: "",
    completed: false
  });

  taskText.value = "";
  taskInputBox.classList.add("hidden");
  save();
}

/* SAVE */

function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

/* RENDER */

function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach(task => {
    const li = document.createElement("li");
    li.className = `task ${task.completed ? "completed" : ""}`;

    li.innerHTML = `
      <input type="checkbox" ${task.completed ? "checked" : ""}>
      <span>${task.text}</span>
    `;

    li.querySelector("input").onclick = () => {
      task.completed = !task.completed;
      save();
    };

    li.onclick = e => {
      if (e.target.tagName === "INPUT") return;
      openDetail(task.id);
    };

    li.oncontextmenu = e => {
      e.preventDefault();
      tasks = tasks.filter(t => t.id !== task.id);
      taskDetail.classList.add("hidden");
      save();
    };

    taskList.appendChild(li);
  });
}

/* DETAIL */

function openDetail(id) {
  selectedTaskId = id;
  const task = tasks.find(t => t.id === id);

  detailTitle.value = task.text;
  detailNotes.value = task.notes;
  taskDetail.classList.remove("hidden");
}

detailTitle.oninput = () => {
  const task = tasks.find(t => t.id === selectedTaskId);
  task.text = detailTitle.value;
  save();
};

detailNotes.oninput = () => {
  const task = tasks.find(t => t.id === selectedTaskId);
  task.notes = detailNotes.value;
  save();
};

closeDetailBtn.onclick = () => {
  taskDetail.classList.add("hidden");
  selectedTaskId = null;
};

renderTasks();