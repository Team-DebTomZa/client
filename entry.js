let comment = document.querySelector("form");
let addCommentButton = document.querySelector("#addCommentButton");
let cancelButton = document.querySelector("#cancelButton");

comment.style.display = "none";

addCommentButton.addEventListener("click", revealForm);

function revealForm() {
  comment.style.display = "block";
}

cancelButton.addEventListener("click", hideForm);

function hideForm() {
  comment.style.display = "none";
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
