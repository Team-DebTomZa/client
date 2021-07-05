const toolBaroptions = [
  ["bold", "italic", "underline", "strike"],
  ["blockquote", "code-block", "link"],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ header: [1, 2, 3, false] }],
  [{ color: [] }, { background: [] }],
  [{ font: [] }],
  [{ align: [] }],
];
const quill = new Quill("#editor", {
  modules: {
    toolbar: toolBaroptions,
  },
  theme: "snow",
});

let form = document.querySelector(".new-post-form");
let newPostButton = document.querySelector("#newPostButton");
let cancelButton = document.querySelector("#cancelButton");
let submitForm = document.querySelector("form");

form.style.display = "none";

newPostButton.addEventListener("click", revealForm);

function revealForm() {
  form.style.display = "block";
}

cancelButton.addEventListener("click", hideForm);

function hideForm() {
  form.style.display = "none";
}

submitForm.addEventListener("submit", sendForm);

async function sendForm(event) {
  event.preventDefault();
  let data = {
    title: event.target.title.value,
    content: quill.root.innerHTML,
  };
  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  const response = await fetch(
    "https://debtomza-server.herokuapp.com/journals",
    options
  );
  const responseJson = await response.json();
  console.log(responseJson);
  location.reload();
}

let journalsContainer = document.querySelector("#journals");

async function getJournalData() {
  let response = await fetch("https://debtomza-server.herokuapp.com/journals");
  let responseJson = await response.json();
  return responseJson;
}

async function appendBody() {
  journalsContainer.innerHTML = "";
  let journals = await getJournalData();
  journals.forEach((item) => createJournal(item));
  let journalTitles = document.querySelectorAll(".journal-title");
  journalTitles.forEach(title => title.addEventListener('click', redirectToEntryPage))
}

function redirectToEntryPage(event){
  let id = event.target.id;
  localStorage.setItem("journal-id", id);
  window.location.href = "entry.html";
  console.log(id);
}

function createJournal(item) {
  let container = document.createElement("div");
  container.className = "journalContainer";
  let html = `<h2 class="journal-title" id="${item.id}">${item.title}</h2>
 <div id="postInteractionBar">
   <p>${item.date}</p>
   <p>${item.comments.length}</p>
   <p>Emoji</p>
 </div>`;
  container.innerHTML = html;
  journalsContainer.appendChild(container);
}

getJournalData();

appendBody();
