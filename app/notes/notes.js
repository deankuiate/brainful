const newPageBtn = document.getElementById("new-page");
const pageList = document.getElementById("page-list");
const titleInput = document.getElementById("page-title");
const contentInput = document.getElementById("page-content");

let pages = JSON.parse(localStorage.getItem("brainful-pages")) || [];
let currentPageId = null;


function disableEditor() {
  titleInput.value = "";
  contentInput.value = "";

  titleInput.disabled = true;
  contentInput.disabled = true;
}

function enableEditor() {
  titleInput.disabled = false;
  contentInput.disabled = false;
}


// Render pages in sidebar
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

// Open a page
function openPage(id) {
  const page = pages.find(p => p.id === id);
  if (!page) return;

  currentPageId = id;
  titleInput.value = page.title;
  contentInput.value = page.content;

  enableEditor();
  renderPages();
}

// Create new page
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

// Save edits
titleInput.oninput = () => {
  const page = pages.find(p => p.id === currentPageId);
  if (!page) return;
  page.title = titleInput.value;
  save();
  renderPages();
};

contentInput.oninput = () => {
  const page = pages.find(p => p.id === currentPageId);
  if (!page) return;
  page.content = contentInput.value;
  save();
};

function save() {
  localStorage.setItem("brainful-pages", JSON.stringify(pages));
}

// Init
if (pages.length) {
  openPage(pages[0].id);
} else {
  disableEditor();
}
renderPages();

function deletePage(id) {
  pages = pages.filter(p => p.id !== id);

  if (currentPageId === id) {
    if (pages.length) {
      openPage(pages[0].id);
    } else {
      currentPageId = null;
      titleInput.value = "";
      contentInput.value = "";
    }
  }

  save();
  renderPages();
}