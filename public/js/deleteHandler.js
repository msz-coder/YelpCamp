const input = document.getElementById("image");
const container = document.querySelector("#newSelection");
const imgSelector = document.querySelector("#imgSelector");
const selectedFiles = [];

function localFilesHandler() {
  const camp = document.querySelector("#getCamp").value;
  const campArr = camp.split(",");
  let files = input.files;
  for (let i = 0; i < files.length; i++) {
    if (selectedFiles.every((e) => e.name !== files[i].name)) {
      selectedFiles.push(files[i]);
    }
  }
  showImages();
}

const showImages = () => {
  let images = "";
  selectedFiles.forEach((img, i) => {
    images += `<div class="col">
        <div class="card m-1">
            <div class="position-relative">
                <img src="${URL.createObjectURL(img)}" title="${
      img.name
    }" class="card-img-top" style="z-index: 0;">
                <i class="bi bi-${
                  i + 1
                }-square-fill position-absolute top-0 start-0" style="font-size: 1.5rem; z-index: 1; padding-left: 0.1rem; color:black;"></i>
                <a class="position-absolute top-0 end-0 btn btn-link" onclick= "deleteImg(${i})"><i class="bi bi-trash" style="font-size: 1.5rem; color:black; z-index: 1;"></i></a>
                <i class= "bi bi-upload position-absolute top-50 start-50 translate-middle" style = "font-size: 4rem; z-index: 2; color: white;"></i>
            </div>
            <small class="text-muted mb-0">${img.name}</small>
        </div>
    </div>`;
    container.innerHTML = images;
  });
};

const deleteImg = (index) => {
  selectedFiles.splice(index, 1);
  showImages();
};

function toCheckbox(element) {
  element.style.display = "none";
  var checkbox = element.nextElementSibling;
  checkbox.style.display = "block";
  checkbox.checked = true;
}

function toDelete(element) {
  element.style.display = "none";
  var deleteBtn = element.previousElementSibling;
  deleteBtn.style.display = "block";
}
