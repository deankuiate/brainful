const addBtn = document.getElementById("add-note");
const notesContainer = document.getElementById("notes");

// Load saved notes from localStorage
const savedNotes = JSON.parse(localStorage.getItem("brainful-notes")) || [];

// Render any that exist
savedNotes.forEach(note => addNote(note));

// Add new note
addBtn.addEventListener("click", () => addNote());

function addNote(text = "") {
  const noteEl = document.createElement("div");
  noteEl.classList.add("note");

  noteEl.innerHTML = `
    <button class="delete">✖</button>
    <textarea>${text}</textarea>
  `;

  const deleteBtn = noteEl.querySelector(".delete");
  const textArea = noteEl.querySelector("textarea");

  deleteBtn.addEventListener("click", () => {
    noteEl.remove();
    updateStorage();
  });

  textArea.addEventListener("input", () => {
    updateStorage();
  });

  notesContainer.appendChild(noteEl);
  updateStorage();
}

function updateStorage() {
  const notesText = [];
  document.querySelectorAll(".note textarea").forEach(textarea => {
    notesText.push(textarea.value);
  });
  localStorage.setItem("brainful-notes", JSON.stringify(notesText));
}