const closeDetailBtn = document.getElementById("close-detail");
const addTaskBtn = document.querySelector(".add-task-btn");
const taskInputBox = document.querySelector(".task-input");
const saveTaskBtn = document.getElementById("save-task");
const cancelTaskBtn = document.getElementById("cancel-task");
const taskList = document.getElementById("task-list");
const taskText = document.getElementById("task-text");

const taskDetail = document.getElementById("task-detail");
const detailTitle = document.getElementById("detail-title");
const detailNotes = document.getElementById("detail-notes");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let selectedTaskId = null;

/* ADD TASK */

addTaskBtn.onclick = () => taskInputBox.classList.remove("hidden");

cancelTaskBtn.onclick = () => taskInputBox.classList.add("hidden");

saveTaskBtn.onclick = () => {
  if (!taskText.value) return;

  tasks.push({
    id: Date.now(),
    text: taskText.value,
    notes: "",
    completed: false
  });

  taskText.value = "";
  taskInputBox.classList.add("hidden");
  save();
};

/* SAVE */

function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

/* RENDER TASKS */

function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "task" + (task.completed ? " completed" : "");
    li.draggable = true;
    li.dataset.id = task.id;

    li.innerHTML = `
      <input type="checkbox" ${task.completed ? "checked" : ""}>
      <span>${task.text}</span>
    `;

    /* COMPLETE */
    li.querySelector("input").onclick = () => {
      task.completed = !task.completed;
      save();
    };

    /* SELECT */
    li.onclick = (e) => {
      if (e.target.tagName === "INPUT") return;
      openDetail(task.id);
    };

    /* RIGHT CLICK DELETE */
    li.oncontextmenu = (e) => {
      e.preventDefault();
      tasks = tasks.filter(t => t.id !== task.id);
      taskDetail.classList.add("hidden");
      save();
    };

    /* DRAG */
    li.addEventListener("dragstart", () => {
      li.classList.add("dragging");
    });

    li.addEventListener("dragend", () => {
      li.classList.remove("dragging");
      reorderTasks();
    });

    taskList.appendChild(li);
  });
}

/* DRAG ORDER */

taskList.addEventListener("dragover", e => {
  e.preventDefault();
  const dragging = document.querySelector(".dragging");
  const after = [...taskList.children].find(
    el => e.clientY <= el.offsetTop + el.offsetHeight / 2
  );
  if (after) taskList.insertBefore(dragging, after);
  else taskList.appendChild(dragging);
});

function reorderTasks() {
  const ids = [...taskList.children].map(li => Number(li.dataset.id));
  tasks.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));
  save();
}

/* DETAIL PANEL */

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