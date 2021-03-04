const BASE_URL = "https://lighthouse-user-api.herokuapp.com";
const INDEX_URL = BASE_URL + "/api/v1/users/";
const data = [];
const dataPanel = document.querySelector("#data-panel");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const audio = document.querySelector("#like-sound");

let favoriteFriends = [];

let filteredFriends = [];

const paginationNum = 15;
const paginator = document.querySelector("#paginator");

const modal = document.querySelector(".modal-content");

let favoriteColor = [];

// 設立全域變數 每次搜尋前 都帶入

let filterFirst = "name";
let filterSecond = "all";
let filterAgeMin;
let filterAgeMax;

// create personal card
function renderPerson(data) {
  let rawHTML = "";
  data.forEach((human) => {
    rawHTML += `
  <figure data-id="${human.id}" class="figure m-4 d-flex flex-row" style="width:250px;height:260px">
      <img src="${human.avatar}" alt="Card image cap" alt="sample29" />
      <div>
        <h3 class="card-title">${human.name}</h3>
         <i class="fas fa-info" data-id="${human.id}" data-toggle="modal" data-target="#personal-info-modal"></i> 
        <div class="curl"></div>
      </div>
    </figure>
  `;
  });
  dataPanel.innerHTML = rawHTML;
  superLike(data);
}

function showPersonModal(info) {
  // https://flagpedia.net/download/api 國旗資訊
  const personImage = document.querySelector("#personal-info-avatar");
  const personData = document.querySelector("#personal-info-data");
  personImage.innerHTML = "";
  personData.innerHTML = "";

  personImage.innerHTML = `
    <img id="modal-img" class="rounded-circle avatar-${info.gender}" src="${info.avatar}" style="width:150px" alt="person-image" class="img-fluid">
    `;
  personData.innerHTML = `
     <div class="name d-flex justify-content-center">
        <h3>${info.name + " " + info.surname}</h3>
      </div>
      <div class="age d-flex justify-content-center mt-3 border-bottom">
        Hi ! &nbsp I am ${info.age} years old<i id="info-${info.gender
    }" class='fas fa-${info.gender
    } ml-2 align-middle' style="font-size: 1.5em;" ></i>
      </div>
      <div class="region d-flex justify-content-center mt-3  border-bottom">
        <span style="font-size: 1em; "> I am from ${info.region
    }&nbsp&nbsp<img src="https://flagcdn.com/w40/${info.region.toLowerCase()}.png" width="30" alt="South Africa">
      </div>
      <div class="email d-flex justify-content-center mt-3  border-bottom">
        <span style="font-size: 1em; "><i class="far fa-envelope"></i>&nbsp ${info.email
    }
      </div>
    `;

  favoriteFriends = JSON.parse(localStorage.getItem("favoriteFriends")) || [];
  let buttonHTML = "";
  if (favoriteFriends.some((favorite) => favorite.id === info.id)) {
    buttonHTML = `<button id="heartbroke-button" type="button" class="btn btn-outline-primary mr-3" data-id="${info.id}" data-dismiss="modal" style="width:60px;height:40px;font-size:1.2em"><i id="heartbroke-icon" data-id="${info.id}" class="fas fa-heart-broken"></i></button>
     <button id="keep-button" type="button" class="btn btn-outline-danger mr-3" style="width:60px;height:40px;font-size:1.2em" data-dismiss="modal"><i class="far fa-smile"></i></button>`;
  } else {
    buttonHTML = `<button id="favorite-button" type="button" class="btn btn-outline-danger mr-3" data-id="${info.id}" data-dismiss="modal" style="width:60px;height:40px;font-size:1.2em"><i id="favorite-icon" data-id="${info.id}" class="fas fa-heartbeat"></i></button>
     <button id="reject-button" type="button" class="btn btn-outline-secondary mr-3" style="width:60px;height:40px;font-size:1.2em" data-dismiss="modal"><i class="far fa-sad-tear"></i></button>`;
  }

  personData.innerHTML += `<div class="modal-button d-flex justify-content-center mt-3 mb-3">
        ${buttonHTML}
      </div>`;
}

// use id to create Modal
dataPanel.addEventListener("click", function clickPanel(event) {
  if (event.target.matches(".fa-info")) {
    const id = event.target.dataset.id;

    axios.get(INDEX_URL + id).then((response) => {
      let info = response.data;
      showPersonModal(info);
    });
  }
});

// 搜尋功能

// search Bar category
const categoryButton = document.querySelector("#search-category");
const categoryMenu = document.querySelector("#search-menu");

categoryMenu.addEventListener("click", function (event) {
  if (event.target.matches(".dropdown-item")) {
    const category = event.target.innerText;
    categoryButton.innerText = category;
    searchInput.placeholder = `search by ${category.toLowerCase()}`;

    // add class for search event
    searchInput.classList.remove("input-name", "input-region");
    searchInput.classList.add(`input-${category.toLowerCase()}`);
  }
});

// 蒐藏最愛

function addToFavorite(id) {
  // 找到localStorage
  favoriteFriends = JSON.parse(localStorage.getItem("favoriteFriends")) || [];

  // 是否已經有重複
  if (favoriteFriends.some((person) => person.id === id)) {
    return alert("already favorite");
  }

  // 找到相對應電影 放進陣列
  const favoritePerson = data.find((person) => person.id === id);
  favoriteFriends.push(favoritePerson);

  // 更新localStorage
  localStorage.setItem("favoriteFriends", JSON.stringify(favoriteFriends));

  //glow effect
  const figure = document.querySelector(`figure[data-id="${id}"]`);
  figure.classList.add("super-like");

  //sound
  audio.currentTime = 0;
  audio.play();
  setTimeout(function () {
    audio.pause();
  }, 1000);
}

// 刪除功能

function removeFavorite(id) {
  // 找到localStorage
  favoriteFriends = JSON.parse(localStorage.getItem("favoriteFriends")) || [];

  if (!favoriteFriends || !favoriteFriends.length) return; // 沒內容 終止執行

  favoriteFriends = favoriteFriends.filter((person) => person.id !== id);

  //改變localStorage
  localStorage.setItem("favoriteFriends", JSON.stringify(favoriteFriends));

  //remove glow effect
  const figure = document.querySelector(`figure[data-id="${id}"]`);
  figure.classList.remove("super-like");
}

// add favorite
modal.addEventListener("click", function addFavorite(event) {
  if (
    event.target.matches("#favorite-button") ||
    event.target.matches("#favorite-icon")
  ) {
    const id = Number(event.target.dataset.id);
    addToFavorite(id);
  } else if (
    event.target.matches("#heartbroke-button") ||
    event.target.matches("#heartbroke-icon")
  ) {
    const id = Number(event.target.dataset.id);
    removeFavorite(id);
  }
});

// 讀取 favorite list 針對list中的名單 加上特效
function superLike(nowPagedata) {
  // 找到localStorage
  favoriteFriends = JSON.parse(localStorage.getItem("favoriteFriends")) || [];
  if (favoriteFriends.length === 0) return;

  // 只能針對當下頁面的資料，並加上特效，若把整份名單含括進來，會找不到相對應資料而出錯
  let intersect = [];

  nowPagedata.forEach((nowPageItem) => {
    favoriteFriends.forEach((favoriteItem) => {
      if (nowPageItem.id === favoriteItem.id) {
        intersect.push(nowPageItem);
      }
    });
  });

  if (intersect.length === 0) return;

  intersect.forEach((favorite) => {
    const figure = document.querySelector(`figure[data-id="${favorite.id}"]`);
    figure.classList.add("super-like");
  });
}

// 分頁功能

function pagination(data, paginationNum) {
  const paginationPages = Math.ceil(data.length / paginationNum);

  let rawHTML = "";
  for (let i = 1; i <= paginationPages; i++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
  }

  paginator.innerHTML = rawHTML;
}

// 點哪一頁 就獲取哪一頁的資料

paginator.addEventListener("click", function renderPagination(event) {
  if (event.target.matches("a")) {
    const page = Number(event.target.dataset.page); //字串轉數字

    getPagination(page);
  }
});

function getPagination(page) {
  const needPagination = filteredFriends.length ? filteredFriends : data;
  // 哪一頁 拿這部分的資料
  // page 1  0~ 11
  // page 2  12~23
  // page 3  24~35
  const paginationData = needPagination.slice(
    (page - 1) * paginationNum,
    page * paginationNum
  );
  renderPerson(paginationData);
}

// Color picker 選擇顏色
// https://iro.js.org/guide.html#color-picker-events

let colorPicker = new iro.ColorPicker("#picker", {
  // Set the size of the color picker
  width: 35,
  // Set the initial color to pure red
  color: "#fff"
});

// change color handle size
// outer circle
colorPicker.base.children[0].children[5].children[0].style.r = "6";

//inner circle
colorPicker.base.children[0].children[5].children[1].style.r = "4";

// Prevent menu from closing when clicked inside
// https://www.geeksforgeeks.org/how-to-avoid-dropdown-menu-to-close-menu-items-on-clicking-inside/

document
  .querySelector(".dropdown-menu-color")
  .addEventListener("click", function (event) {
    event.stopPropagation();
  });

// change background color
const whiteCircle = document.querySelector(".white");
const whiteCircle2 = document.querySelector(".white2");
whiteCircle.addEventListener("click", function (event) {
  document.querySelector("body").style.backgroundColor = "#ffffff";

  // 找到localStorage
  favoriteColor = JSON.parse(localStorage.getItem("favoriteColor")) || [];
  if (favoriteColor.length !== 0) {
    favoriteColor = [];
  }
  // 更新localStorage
  localStorage.setItem("favoriteColor", JSON.stringify(favoriteColor));
});

whiteCircle2.addEventListener("click", function (event) {
  const color = event.target.style.backgroundColor;
  document.querySelector("body").style.backgroundColor = `${color}`;

  // 找到localStorage
  favoriteColor = JSON.parse(localStorage.getItem("favoriteColor"));
  if (favoriteColor.length === 0) {
    // 若先點 whiteCircle 背景變成白色 而且 favoriteColor 也是空陣列
    favoriteColor.push(rgbToHex(color));
  } else {
    return;
  }
  // 更新localStorage
  localStorage.setItem("favoriteColor", JSON.stringify(favoriteColor));
});

// rgb value to hex
function rgbToHex(color) {
  color = color.replace("rgb(", "").replace(")", "").split(",");
  let rgb = [
    parseInt(color[0]).toString(16),
    parseInt(color[1]).toString(16),
    parseInt(color[2]).toString(16)
  ];

  rgb = rgb.map((element) => {
    if (element.length !== 2) {
      element = "0" + element;
    }
    return element;
  });

  return "#" + rgb[0] + rgb[1] + rgb[2];
}

// listen to a color picker's color:change event
colorPicker.on("color:change", function (color) {
  // log the current color as a HEX string
  // console.log(color.hexString);
  document.querySelector("body").style.backgroundColor = `${color.hexString}`;
  whiteCircle2.style.backgroundColor = `${color.hexString}`;
  //store in localStorage

  // 找到localStorage
  favoriteColor = JSON.parse(localStorage.getItem("favoriteColor")) || [];
  // 是否已經有重複
  if (favoriteColor[0] === color.hexString) {
    return;
  } else {
    favoriteColor[0] = color.hexString;
  }

  // 更新localStorage
  localStorage.setItem("favoriteColor", JSON.stringify(favoriteColor));
});

// choose favorite color on user's web

function readFavoriteColor() {
  // 找到localStorage
  favoriteColor = JSON.parse(localStorage.getItem("favoriteColor")) || [];

  if (favoriteColor.length === 0) {
    document.querySelector("body").style.backgroundColor = "#fff";
    whiteCircle2.style.backgroundColor = "#fff";
  } else {
    document.querySelector(
      "body"
    ).style.backgroundColor = `${favoriteColor[0]}`;
    whiteCircle2.style.backgroundColor = `${favoriteColor[0]}`;
  }
}

readFavoriteColor();

// ---------------------------新增--------------------------------

document
  .querySelector("#filter-panel")
  .addEventListener("click", function (event) {
    event.stopPropagation();
  });

// // 點擊 filter 更改box-shadow
// document
//   .querySelector(".dropdown-item")
//   .addEventListener("click", function (event) {
//     // 點擊到 button
//     if (event.target.matches(".btn-light")) {
//       // 移除同階層的css
//       const childButton = event.target.parentElement.children.length;

//       for (i = 0; i < childButton; i++) {
//         event.target.parentElement.children[i].classList.remove("button-push");
//       }
//       // 將點選的屬性套上css
//       event.target.classList.toggle("button-push");

//       // 更改全域變數
//       if (event.target.matches("#filter-name")) {
//         filterFirst = "name";
//       } else if (event.target.matches("#filter-region")) {
//         filterFirst = "region";
//       } else if (event.target.matches("#filter-all")) {
//         filterSecond = "all";
//       } else if (event.target.matches("#filter-female")) {
//         filterSecond = "female";
//       } else if (event.target.matches("#filter-male")) {
//         filterSecond = "male";
//       }
//     }

//     // 點擊到 icon
//     if (event.target.matches("i")) {
//       const childButton =
//         event.target.parentElement.parentElement.children.length;

//       // 移除同階層的css
//       for (i = 0; i < childButton; i++) {
//         event.target.parentElement.parentElement.children[i].classList.remove(
//           "button-push"
//         );
//       }

//       // 將點選的屬性套上css
//       event.target.parentElement.classList.toggle("button-push");

//       // 更改全域變數
//       if (event.target.matches(".fa-address-card")) {
//         filterFirst = "name";
//       } else if (event.target.matches(".fa-map-marked-alt")) {
//         filterFirst = "region";
//       } else if (event.target.matches(".fa-user-friends")) {
//         filterSecond = "all";
//       } else if (event.target.matches(".fa-female")) {
//         filterSecond = "female";
//       } else if (event.target.matches(".fa-male")) {
//         filterSecond = "male";
//       }
//     }

//     // 即刻搜尋
//     instantSearch();
//   });

// 2021/2/20 修改成 radioButton

function checkSearchType() { }

const check = new checkSearchType();

checkSearchType.prototype.getFirstFilter = function () {
  const filter = document.querySelector("#filter-name").checked;

  filterFirst = filter ? "name" : "region";
};

checkSearchType.prototype.getSecondFilter = function () {
  const filters = document.querySelectorAll('input[name="gender"]');
  filters.forEach(function (gender) {
    if (gender.checked) {
      filterSecond = gender.value;
    }
  });
};

// ---------two way slider--------

// 參考
// https://www.youtube.com/watch?v=pTlsnFLiK6c

const inputLeft = document.querySelector("#input-left");
const inputRight = document.querySelector("#input-right");

const thumbLeft = document.querySelector(".slider > .thumb.left");
const thumbRight = document.querySelector(".slider > .thumb.right");
const range = document.querySelector(".slider > .range");

function setLeftValue() {
  const min = parseInt(inputLeft.min),
    max = parseInt(inputLeft.max);

  // 修改數值為 本身數值 或 右邊slider數值 - 1 的最小值
  inputLeft.value = Math.min(
    parseInt(inputLeft.value),
    parseInt(inputRight.value) - 1
  );

  // 更改框框裡的數值
  const minAge = document.querySelector("#min-age");
  minAge.value = inputLeft.value;

  // 更改搜尋條件
  filterAgeMin = parseInt(inputLeft.value);

  // 更動 假slider的thumb的位置，假range的長度
  const percent = (((inputLeft.value - min) / (max - min)) * 100).toString();
  console.log(percent);

  thumbLeft.style.left = percent + "%";
  range.style.left = percent + "%";

  instantSearch();
}

function setRightValue() {
  const min = parseInt(inputRight.min),
    max = parseInt(inputRight.max);

  // 修改數值為 本身數值 或 右邊slider數值 - 1 的最小值
  inputRight.value = Math.max(
    parseInt(inputRight.value),
    parseInt(inputLeft.value) + 1
  );
  // 更改框框裡的數值
  const maxAge = document.querySelector("#max-age");
  maxAge.value = inputRight.value;
  // 更改搜尋條件
  filterAgeMax = parseInt(inputRight.value);

  // 更動 假slider的thumb的位置，假range的長度
  const percent = (((inputRight.value - min) / (max - min)) * 100).toString();
  console.log(percent);

  thumbRight.style.right = 100 - percent + "%";
  range.style.right = 100 - percent + "%";

  instantSearch();
}

inputLeft.addEventListener("input", setLeftValue);
inputRight.addEventListener("input", setRightValue);

// 直接輸入更改slider數值 同時搜尋
const minAgeBox = document.querySelector("#min-age");
const maxAgeBox = document.querySelector("#max-age");

minAgeBox.addEventListener("input", function changeMinAge(event) {
  // 因為要隨著另一個input去做更動 不能小於他的數值，且規定要在 1~99以內
  const value = event.target.value;

  if (
    parseInt(value) >= 0 &&
    parseInt(value) <= 99 &&
    parseInt(value) < parseInt(inputRight.value)
  ) {
    inputLeft.value = Math.min(parseInt(value), parseInt(inputRight.value) - 1);
    filterAgeMin = parseInt(value);
    const percent = ((value - 0) / (100 - 0)) * 100;

    thumbLeft.style.left = percent + "%";
    range.style.left = percent + "%";

    instantSearch();
  }
});

maxAgeBox.addEventListener("input", function changeMaxAge(event) {
  // 因為要隨著另一個input去做更動 不能小於他的數值
  const value = event.target.value;

  if (
    parseInt(value) >= 1 &&
    parseInt(value) <= 100 &&
    parseInt(value) > parseInt(inputLeft.value)
  ) {
    inputRight.value = Math.max(parseInt(value), parseInt(inputLeft.value) + 1);
    filterAgeMax = parseInt(value);
    const percent = ((value - 0) / (100 - 0)) * 100;

    thumbRight.style.right = 100 - percent + "%";
    range.style.right = 100 - percent + "%";

    instantSearch();
  }
});

// 一輸入數值就檢查

searchInput.addEventListener("keyup", instantSearch);

// 每次更改搜尋條件 就立刻搜尋
function instantSearch() {
  // event type "input" or "keyup" 皆可
  const input = searchInput.value.trim().toLowerCase();

  // 先確認現在的條件
  check.getFirstFilter();
  check.getSecondFilter();

  // 先確認現在是 Name 還是 region
  if (filterFirst === "name") {
    filteredFriends = data.filter((person) =>
      person.name.toLowerCase().includes(input)
    );
  } else {
    filteredFriends = data.filter((person) =>
      person.region.toLowerCase().includes(input)
    );
  }

  // 再確認 性別
  if (filterSecond === "female") {
    filteredFriends = filteredFriends.filter(
      (person) => person.gender === "female"
    );
  } else if (filterSecond === "male") {
    filteredFriends = filteredFriends.filter(
      (person) => person.gender === "male"
    );
  }

  // 再確認年紀範圍
  filteredFriends = filteredFriends.filter(
    (person) => person.age <= filterAgeMax
  );
  filteredFriends = filteredFriends.filter(
    (person) => person.age >= filterAgeMin
  );

  if (filteredFriends.length === 0) {
    dataPanel.innerHTML = `
  <div class="container mt-5 d-flex justify-content-center">
    <p style="font-size : 3em; color : red">Not found a match <i style = "color : orange" class="fas fa-exclamation-triangle"></i></p>
  </div> `;
    paginator.innerHTML = "";

    return;
  }

  pagination(filteredFriends, paginationNum);
  getPagination(1);
}

// get person data
axios.get(INDEX_URL).then((response) => {
  // console.log(response);
  data.push(...response.data.results);

  pagination(data, paginationNum);
  getPagination(1);
  setRightValue();
  setLeftValue();
});

// 一點擊radioButon 即發生變化

const firstRadio = document.querySelector("#filter-primary");
const secondRadio = document.querySelector("#filter-gender");

firstRadio.addEventListener("change", function (event) {
  instantSearch();
});

secondRadio.addEventListener("change", function (event) {
  instantSearch();
});
