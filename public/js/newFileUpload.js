const upload = document.querySelector("#uploadUI");

function newFileUpload(event) {
  upload.innerHTML = "";
  var fileName = document.getElementById("image");
  var fileNum = fileName.files.length;
  for (i = 0; i < fileNum; i++) {
    const { name } = event.target.files[i];
    render(event, i, name);
  }
}

function render(event, i, name) {
  let mainDiv = document.createElement("div");
  mainDiv.setAttribute("class", "col");
  let childDiv = document.createElement("div");
  childDiv.setAttribute("class", "card");
  let img = document.createElement("img");
  renderImg(event, i, name, img);
  img.classList.add("card-img-top", "img-thumbnail");
  childDiv.appendChild(img);
  let text = document.createElement("small");
  text.classList.add("text-muted", "mb-0");
  text.append(name);
  childDiv.appendChild(text);
  mainDiv.append(childDiv);
  upload.append(mainDiv);
}

function renderImg(event, i, name, element) {
  var reader = new FileReader();
  reader.onload = function () {
    element.src = reader.result;
    element.setAttribute("title", name);
  };
  reader.readAsDataURL(event.target.files[i]);
}
