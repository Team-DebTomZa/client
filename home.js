//QUILL
// const toolBaroptions = [
//   ["bold", "italic", "underline", "strike"],
//   ["code-block", "link"],
//   [{ list: "ordered" }, { list: "bullet" }],
//   [{ header: [1, 2, 3, false] }],
//   [{ color: [] }, { background: [] }],
//   [{ font: [] }],
//   [{ align: [] }],
// ];
// const quill = new Quill("#editor", {
//   modules: {
//     toolbar: toolBaroptions,
//   },
//   theme: "snow",
// });

// const charLimit = 400;
// const limitSpan = document.getElementById("limit-span");
let isAllowedToPost = true;

// quill.on("text-change", function (delta, old, source) {
//   let numChars = quill.getLength();
//   limitSpan.textContent = `Character Limit: ${numChars - 1}/${charLimit}`;
//   if (numChars > charLimit) {
//     limitSpan.style.color = "red";
//     isAllowedToPost = false;
//   } else {
//     limitSpan.style.color = "green";
//     isAllowedToPost = true;
//   }
// });

//GIPHY
let gifUrl = null;
const gifButton = document.getElementById("gif-button");
const gifImage = document.getElementById("gif");
const gifSearch = document.getElementById("gif-search");
gifButton.addEventListener("click", getRandomGif);

async function getRandomGif() {
  try{
    const apiKey = "aP42zy1oVEY3C3zd7GvNdaIp7sEcMsDi";
    const url = new URL("https://api.giphy.com/v1/gifs/random");
    const searchTerm = gifSearch.value;
    const params = {
      apiKey,
      tag: searchTerm,
    };
    Object.keys(params).forEach((key) =>
      url.searchParams.append(key, params[key])
    );
    
    const response = await fetch(url);
    const responseJson = await response.json();
    gifUrl = responseJson.data.image_url;
    gifImage.setAttribute("src", gifUrl);
    } catch (error){
      console.log(error);
    }
}

//General
let journals ;
let form = document.querySelector(".new-post-form");
let newPostButton = document.querySelector(".new-post-bar");
let cancelButton = document.querySelector("#cancelButton");
let submitForm = document.getElementById("journal-form");

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
  if (!isAllowedToPost) {
    return alert(
      "You are over the character limit, please reduce the size of your entry and try again."
    );
  }
  try {
    const options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
      let data = {
      title: event.target.title.value,
      content: quill?.root?.innerHTML,
      gifUrl,
    };
    
    const response = await fetch(
      "https://debtomza-server.herokuapp.com/journals",
      options
    );
    const responseJson = await response.json();
    console.log(responseJson);
    location.reload();
  } catch (error){
    console.log(error);
  }
}

let journalsContainer = document.querySelector("#journals");

async function getJournalData() {
  try{
    let response = await fetch("https://debtomza-server.herokuapp.com/journals");
    let responseJson = await response.json();
    return responseJson;
  } catch (error){
    console.log(error);
  }
}

async function appendBody() {
  try{
    journalsContainer.innerHTML = "";
    journals = await getJournalData();
    journals.reverse(); //so that the latest entries appear at top of page
    journals.forEach((item) => createJournal(item));
    let journalTitles = document.querySelectorAll(".journal-title");
    journalTitles.forEach((title) =>
      title.addEventListener("click", redirectToEntryPage)
    );
  } catch (error){
    console.log(error);
  }
}

function redirectToEntryPage(event) {
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
   <p>${item.comments.length} comments</p>
   <div class="emojis"><div><i class="far fa-smile-beam"></i>${item.emojis[0]}</div><div><i class="far fa-grin-squint-tears"></i>${item.emojis[1]}</div><div><i class="far fa-frown"></i>${item.emojis[2]}</div></div>
 </div>`;
  container.innerHTML = html;
  journalsContainer.appendChild(container);
}

//sorting functionality
const sortForm = document.getElementById("sort-form");
sortForm.addEventListener("submit", sortResults);

function sortResults(event) {
  event.preventDefault();
  let selection = event.target.sort.value;
  if (selection === "date") {
    appendBody(); //since the journals are in date order by default
  }
  if (selection === "popular") {
    journals.sort(
      (a, b) =>
        b.emojis[0] +
        b.emojis[1] -
        b.emojis[2] -
        (a.emojis[0] + a.emojis[1] - a.emojis[2])
    );
    addJournalsToPage(journals);
  }
  if (selection === "comments") {
    journals.sort((a, b) => b.comments.length - a.comments.length);
    addJournalsToPage(journals);
  }
}

function addJournalsToPage(results) {
  journalsContainer.innerHTML = "";
  results.forEach((item) => createJournal(item));
  let journalTitles = document.querySelectorAll(".journal-title");
  journalTitles.forEach((title) =>
    title.addEventListener("click", redirectToEntryPage)
  );
}

//search functionality

const searchForm = document.getElementById("search-form");
searchForm.addEventListener("submit", filterResults);

function filterResults(event) {
  event.preventDefault();
  let search = event.target.search.value.toLowerCase();

  let results = [...journals]; 
  results = results.filter(entry => entry.title.toLowerCase().includes(search));

  addJournalsToPage(results);
}

appendBody();

try {
  module.exports = { getRandomGif, revealForm, hideForm, sendForm, getJournalData, appendBody, redirectToEntryPage, createJournal, sortResults, addJournalsToPage, filterResults }
} catch {
  console.log('In the browser - so not using module exports ...')
}
