let form = document.querySelector(".new-post-form");
let newPostButton = document.querySelector("#newPostButton");
let cancelButton = document.querySelector("#cancelButton");

form.style.display = "none";

newPostButton.addEventListener("click", revealForm);

function revealForm() {
  form.style.display = "block";
}

cancelButton.addEventListener("click", hideForm);

function hideForm() {
  form.style.display = "none";
}

const toolBaroptions = [
  ["bold", "italic", "underline", "strike"],
  ["blockquote", "code-block"],
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
}

function createJournal(item) {
  let container = document.createElement("div");
  container.className = "journalContainer";
  let html = `<h2>${item.title}</h2>
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

{
  /* <div class='ql-editor'>${item.content}</div> */
}
