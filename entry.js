//Get Home Button//

const homeButton = document.getElementById("homeButton");

const journalTitle = document.getElementById("journalTitle");

homeButton.addEventListener("click", goHome);

function goHome() {
  console.log("clicked");
  window.location.href = "home.html";
}

const journalHolder = document.getElementById("journal");

const commentContainer = document.getElementById("comments-container");

const form = document.getElementById("comment-form");
form.addEventListener("submit", postComment);

journalHolder.className = "ql-editor";
let selectedId = localStorage.getItem("journal-id");
getJournalWithId(selectedId);

async function postComment(event) {
  event.preventDefault();
  let data = {
    newComment: event.target.comment.value,
  };
  const options = {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  const response = await fetch(
    `https://debtomza-server.herokuapp.com/journals/${selectedId}`,
    options
  );
  const responseJson = await response.json();
  console.log(responseJson);
  location.reload();
}

async function getJournalWithId(id) {
  let response = await fetch("https://debtomza-server.herokuapp.com/journals");
  let responseJson = await response.json();
  let journal = responseJson[id - 1];
  document.title = journal.title;
  journalTitle.textContent = journal.title;

  // let journalTitle = document.createElement("h2");

  // journalHolder.appendChild(journalTitle);

  journalHolder.innerHTML = journal.content;
  let gifImage = document.createElement("img");
  gifImage.setAttribute("src", journal.gifUrl);
  journalHolder.appendChild(gifImage);
  let comments = journal.comments;
  comments.forEach((comment) => createComment(comment));
}

function createComment(comment) {
  let div = document.createElement("div");
  div.textContent = comment;
  commentContainer.appendChild(div);
}
