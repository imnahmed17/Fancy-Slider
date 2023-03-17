const imagesArea = document.querySelector(".images");
const gallery = document.querySelector(".gallery");
const galleryHeader = document.querySelector(".gallery-header");
const search = document.getElementById("search");
const searchBtn = document.getElementById("search-btn");
const sliderBtn = document.getElementById("create-slider");
const sliderContainer = document.getElementById("sliders");
const dots = document.querySelector(".dots");
const errorMessage = document.getElementById("error-message");
// selected image
let sliders = [];

// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = "15674931-a9d714b6e9d654524df198e00&q";

// show images
const showImages = (images) => {
  imagesArea.style.display = "block";
  gallery.innerHTML = "";
  // show gallery title
  galleryHeader.style.display = "flex";
  images.forEach((image) => {
    let div = document.createElement("div");
    div.className = "col-lg-3 col-md-4 col-xs-6 img-item mb-2";
    div.innerHTML = `<img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
    gallery.appendChild(div);
  });
};

const getImages = (query) => {
  fetch(`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`)
    .then((response) => response.json())
    .then((data) => {
      if (data.hits.length) {
        showImages(data.hits);
        errorMessage.innerHTML = "";
      } else {
        imagesArea.style.display = "none";
        errorMessage.innerText = "Data Not Found";
      }
    })
    .catch((err) => console.log(err));
};

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  element.classList.add("added");

  let item = sliders.indexOf(img);
  if (item === -1) {
    sliders.push(img);
  } else {
    sliders = sliders.filter((item) => item != img);
    element.classList.remove("added");
  }
};

var timer;
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert("Select at least 2 image.");
    return;
  }

  // validate duration
  const duration = document.getElementById("duration").value || 1000;
  if (duration > 0) {
    // hide image aria
    imagesArea.style.display = "none";
    errorMessage.innerText = "";
    document.getElementById("duration").value = "";
  } else {
    errorMessage.innerText = "Please Provide Positive value";
    return;
  }

  // create slider previous next area
  sliderContainer.innerHTML = "";
  const prevNext = document.createElement("div");
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;
  sliderContainer.appendChild(prevNext);
  document.querySelector(".main").style.display = "block";

  dots.innerHTML = "";
  sliders.forEach((slide, index) => {
    console.log(slide, index);
    let item = document.createElement("div");
    item.className = "slider-item";
    item.innerHTML = `<img class="w-100" src="${slide}" alt="">`;
    sliderContainer.appendChild(item);
    // create slider dots
    dots.innerHTML += `<span class="dot" onclick="changeSlide(${index})"></span>`;
  });

  changeSlide(0);
  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
  }, duration);
};

// change slider index
const changeItem = (index) => {
  changeSlide((slideIndex += index));
};

// change slide item
const changeSlide = (index) => {
  const items = document.querySelectorAll(".slider-item");
  if (index < 0) {
    slideIndex = items.length - 1;
    index = slideIndex;
  }

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach((item) => {
    item.style.display = "none";
  });

  items[index].style.display = "block";

  // add color to the current dot
  const allDots = document.querySelectorAll(".dot");
  allDots[index].classList.add("bg-danger");
  const dotsArray = Array.from(allDots);
  dotsArray.map((item, currentIndex) => {
    if (index != currentIndex) {
      item.classList.remove("bg-danger");
    }
  });
};

searchBtn.addEventListener("click", function () {
  document.querySelector(".main").style.display = "none";
  clearInterval(timer);
  if (search.value.length === 0) {
    imagesArea.style.display = "none";
    errorMessage.innerText = "Invalid search";
    return;
  }
  getImages(search.value);
  search.value = "";
  sliders.length = 0;
});

sliderBtn.addEventListener("click", function () {
  createSlider();
});

// Enter Key Trigger
search.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    searchBtn.click();
  }
});
