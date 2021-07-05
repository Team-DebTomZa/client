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
