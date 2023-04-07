import { loader, fetchProducts } from "./common.js";

const compareContainer = document.querySelector(".js-compare-list");

function getLocalStoareKeys() {
  let localStorageKeys = [];
  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    localStorageKeys.push(key);
  }
  return localStorageKeys;
}

loader.addLoader(".js-compare-list");

function setFirstColumnOfCompareProductTable() {
  compareContainer.innerHTML = `
  <div class="card-compare-description">
    <div class="compare-image">
    </div>
    <div class="item">Product</div>
    <div class="item">Price</div>
    <div class="item">Category</div>
  </div>
  `;
}

function setLengthOfCompareTable() {
  const columnCount = document.documentElement;
  columnCount.style.setProperty("--ItemPerCol", getLocalStoareKeys().length);
}

function generateSingleCompareProduct(element) {
  let result = `
            <div class="card-compare" data-id="${element.category.id}">
                <img src="${element.productImage}" alt="productPicture" class="compare-image" />
                <div class="item">${element.productTitle}</div>
                <div class="item">${element.price} $</div>
                <div class="item">${element.category.label}</div>
                <button class="remove-item js-remove-item">Remove from wishlist</button>
                <div class="btn-container">
                  <button class="move-btn js-move-btn-prev"><</button>
                  <button class="move-btn js-move-btn-next">></button>
                </div>
            </div>
            `;
  return result;
}

function appendCompareProduct(product) {
  compareContainer.innerHTML += product;
}

function disableFirstAndLastBtns() {
  const elementsNodeList = document.querySelectorAll(".card-compare");
  //disable first button
  elementsNodeList[0].lastElementChild.firstElementChild.setAttribute(
    "disabled",
    true
  );
  //disable last button
  elementsNodeList[
    elementsNodeList.length - 1
  ].lastElementChild.lastElementChild.setAttribute("disabled", true);
}

function restoreBtnsState() {
  const elementsNodeList = document.querySelectorAll(".card-compare");
  Array.from(elementsNodeList).forEach((element) => {
    //reset first button
    element.lastElementChild.firstElementChild.removeAttribute("disabled");

    //reset last button
    element.lastElementChild.lastElementChild.removeAttribute("disabled");
  });
}

function populateWishListProducts() {
  return fetchProducts().then((json) => {
    let data = json;
    setFirstColumnOfCompareProductTable();
    loader.addLoader(".js-compare-list");
    setLengthOfCompareTable();
    getLocalStoareKeys().forEach((key) => {
      data.forEach((element) => {
        if (element.category.id === +key) {
          let singleProduct = generateSingleCompareProduct(element);
          appendCompareProduct(singleProduct);
        }
      });
    });
  });
}

populateWishListProducts().finally(function () {
  loader.removeLoader(".js-compare-list");
  disableFirstAndLastBtns();
  initMoveBeforeBtn();
  initMoveAfterBtn();
  removeFromWishList();
});

function removeFromWishList() {
  const removeFromWishlistButton = document.querySelectorAll(".js-remove-item");
  Array.from(removeFromWishlistButton).forEach((button) => {
    button.addEventListener("click", (element) => {
      const itemToRemove = element.srcElement.parentElement;
      const dataId = itemToRemove.getAttribute("data-id");

      for (let i = 0; i < localStorage.length; i++) {
        if (dataId === localStorage.key(i)) {
          localStorage.removeItem(dataId);
        }
      }
      itemToRemove.remove();
    });
  });
}

function moveItemBefore() {
  const el = this.parentElement.parentElement;
  const parrentContainer = this.parentElement.parentElement.parentElement;
  const list = this.parentElement.parentElement.parentElement.children;
  const removeElementDataId = el.getAttribute("data-id");
  let removeElementIndex = 0;

  Array.from(list).forEach((element, index) => {
    const elementDataId = element.getAttribute("data-id");
    if (elementDataId === removeElementDataId) {
      removeElementIndex = index;
    }
  });

  let desiredDestination = removeElementIndex - 1;
  let beforeElement = list[desiredDestination];
  let deletedElement = parrentContainer.removeChild(el);
  parrentContainer.insertBefore(deletedElement, beforeElement);
  restoreBtnsState();
  disableFirstAndLastBtns();
}

function initMoveBeforeBtn() {
  const btnPrev = document.querySelectorAll(".js-move-btn-prev");
  btnPrev.forEach((btn) => {
    btn.addEventListener("click", moveItemBefore);
  });
}

function moveItemAfter() {
  const el = this.parentElement.parentElement;
  const parentContainer = this.parentElement.parentElement.parentElement;
  const list = this.parentElement.parentElement.parentElement.children;
  const removeElementDataId = el.getAttribute("data-id");
  let removeElementIndex = 0;

  Array.from(list).forEach((element, index) => {
    const elementDataId = element.getAttribute("data-id");
    if (elementDataId === removeElementDataId) {
      removeElementIndex = index;
    }
  });

  let desiredDestination = removeElementIndex + 1;
  let afterElement = list[desiredDestination];
  let deletedElement = parentContainer.removeChild(el);
  afterElement.after(deletedElement);
  restoreBtnsState();
  disableFirstAndLastBtns();
}

function initMoveAfterBtn() {
  const btnNext = document.querySelectorAll(".js-move-btn-next");
  btnNext.forEach((btn) => {
    btn.addEventListener("click", moveItemAfter);
  });
}
