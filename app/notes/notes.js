// dom refs
const newPageBtn = document.getElementById("new-page");
const pageList = document.getElementById("page-list");
const titleInput = document.getElementById("page-title");
const contentInput = document.getElementById("page-content");
const emptyState = document.getElementById("empty-state");

// state
let pages = JSON.parse(localStorage.getItem("brainful-pages")) || [];
let currentPageId = null;

// hide editor and show empty state
function disableEditor() {
  titleInput.value = "";
  contentInput.value = "";

  titleInput.disabled = true;
  contentInput.disabled = true;

  titleInput.style.display = "none";
  contentInput.style.display = "none";
  emptyState.style.display = "flex";
}

// show editor and hide empty state
function enableEditor() {
  titleInput.disabled = false;
  contentInput.disabled = false;

  titleInput.style.display = "block";
  contentInput.style.display = "block";
  emptyState.style.display = "none";
}

// render sidebar page list
function renderPages() {
  pageList.innerHTML = "";

  pages.forEach(page => {
    const li = document.createElement("li");
    li.classList.toggle("active", page.id === currentPageId);

    const titleSpan = document.createElement("span");
    titleSpan.className = "page-title";
    titleSpan.textContent = page.title || "Untitled";
    titleSpan.onclick = () => openPage(page.id);

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-page";
    deleteBtn.innerHTML = "🗑";

    deleteBtn.onclick = (e) => {
      e.stopPropagation();
      deletePage(page.id);
    };

    li.appendChild(titleSpan);
    li.appendChild(deleteBtn);
    pageList.appendChild(li);
  });
}

// load a page into the editor
function openPage(id) {
  const page = pages.find(p => p.id === id);
  if (!page) return;

  currentPageId = id;
  titleInput.value = page.title;
  contentInput.value = page.content;

  enableEditor();
  renderPages();
}

// create new page
newPageBtn.onclick = () => {
  const newPage = {
    id: Date.now(),
    title: "Untitled",
    content: ""
  };
  pages.unshift(newPage);
  save();
  openPage(newPage.id);
};

// autosave title on input
titleInput.oninput = () => {
  const page = pages.find(p => p.id === currentPageId);
  if (!page) return;
  page.title = titleInput.value;
  save();
  renderPages();
};

// autosave content on input
contentInput.oninput = () => {
  const page = pages.find(p => p.id === currentPageId);
  if (!page) return;
  page.content = contentInput.value;
  save();
};

// persist to localstorage
function save() {
  localStorage.setItem("brainful-pages", JSON.stringify(pages));
}

// init: open first page or show empty state
if (pages.length) {
  openPage(pages[0].id);
} else {
  disableEditor();
}
renderPages();

// delete a page by id
function deletePage(id) {
  pages = pages.filter(p => p.id !== id);

  if (currentPageId === id) {
    if (pages.length) {
      openPage(pages[0].id);
    } else {
      currentPageId = null;
      disableEditor();
    }
  }

  save();
  renderPages();
}