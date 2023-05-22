import { loader, fetchProducts, localStorageFunctions } from "./common.js";

const COMPARE_LIST_CLASS = ".js-compare-list";
const compareContainer = document.querySelector(COMPARE_LIST_CLASS);

function getLocalStoareKeys() {
  let localStorageKeys = [];
  const arrayLocalStorageData = Object.keys(
    localStorageFunctions.localStorageItems
  );
  for (let i = 0; i < arrayLocalStorageData.length; i++) {
    localStorageKeys.push(arrayLocalStorageData[i]);
  }
  return localStorageKeys;
}

loader.addLoader(COMPARE_LIST_CLASS);

function setFirstColumnOfCompareProductTable() {
  compareContainer.innerHTML = `
  <div class="card-compare-description">
    <div class="compare-image">
    </div>
    <div class="item description-item js-product-title">Product <div class="vrtcl-btn-container"><button class="js-up-btn">up</button><button class="js-down-btn">down</button></div></div>
    <div class="item description-item js-price">Price <div class="vrtcl-btn-container"><button class="js-up-btn">up</button><button class="js-down-btn">down</button></div></div>
    <div class="item description-item js-category">Category <div class="vrtcl-btn-container"><button class="js-up-btn">up</button><button class="js-down-btn">down</button></div></div>
  </div>
  `;
}

function setLengthOfCompareTable() {
  const columnCount = document.documentElement;
  columnCount.style.setProperty("--ItemPerCol", getLocalStoareKeys().length);
}

function generateSingleCompareProduct(element) {
  let result = `
            <div class="card-compare js-card-compare" data-id="${element.category.id}">
                <img src="${element.productImage}" alt="productPicture" class="compare-image" />
                <div class="item js-product-title">${element.productTitle}</div>
                <div class="item js-price">${element.price}</div>
                <div class="item js-category">${element.category.label}</div>
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
    loader.addLoader(COMPARE_LIST_CLASS);
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
  loader.removeLoader(COMPARE_LIST_CLASS);
  disableFirstAndLastVerticalBtn();
  disableFirstAndLastBtns();
  initMoveBeforeBtn();
  initMoveAfterBtn();
  handlePriceCompare();
  removeFromWishList();
  handleCategoryMoveUp();
  handleCategoryMoveDown();
});

function removeFromWishList() {
  const removeFromWishlistButton = document.querySelectorAll(".js-remove-item");
  const arrayLocalStorageData = Object.keys(
    localStorageFunctions.localStorageItems
  );

  Array.from(removeFromWishlistButton).forEach((button) => {
    button.addEventListener("click", (element) => {
      const itemToRemove = element.srcElement.parentElement;
      const dataId = itemToRemove.getAttribute("data-id");

      for (let i = 0; i < arrayLocalStorageData.length; i++) {
        if (dataId === arrayLocalStorageData[i]) {
          localStorageFunctions.removeFromLocalStorage("compareList", dataId);
        }
      }
      itemToRemove.remove();
      //update first product color and button left
      handlePriceCompare();
      disableFirstAndLastBtns();
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
  handlePriceCompare();
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
  handlePriceCompare();
  disableFirstAndLastBtns();
}

function initMoveAfterBtn() {
  const btnNext = document.querySelectorAll(".js-move-btn-next");
  btnNext.forEach((btn) => {
    btn.addEventListener("click", moveItemAfter);
  });
}

const FIRST_PRICE_COLOR_CLASS = "yellow-bg";
const HIGHER_PRICE_COLOR_CLASS = "red-bg";
const LOWER_PRICE_COLOR_CLASS = "green-bg";

// compare and color indication of price
function resetCompareClasses(elementPriceField) {
  if (elementPriceField.classList.contains(LOWER_PRICE_COLOR_CLASS)) {
    return elementPriceField.classList.remove(LOWER_PRICE_COLOR_CLASS);
  } else if (elementPriceField.classList.contains(HIGHER_PRICE_COLOR_CLASS)) {
    return elementPriceField.classList.remove(HIGHER_PRICE_COLOR_CLASS);
  } else {
  }
}

function updateFirstElement(firstProduct) {
  if (firstProduct.classList.contains(LOWER_PRICE_COLOR_CLASS)) {
    return firstProduct.classList.replace(
      LOWER_PRICE_COLOR_CLASS,
      FIRST_PRICE_COLOR_CLASS
    );
  } else if (firstProduct.classList.contains(HIGHER_PRICE_COLOR_CLASS)) {
    return firstProduct.classList.replace(
      HIGHER_PRICE_COLOR_CLASS,
      FIRST_PRICE_COLOR_CLASS
    );
  } else {
    return firstProduct.classList.add(FIRST_PRICE_COLOR_CLASS);
  }
}

function locateFirstElement(element) {
  const elementRows = element.children;
  for (let i = 0; i < elementRows.length; i++) {
    if (elementRows[i].classList.contains("js-price")) {
      return elementRows[i];
    }
  }
}

function priceCompare(firstProduct, secondProduct) {
  let firstProductPriceField = locateFirstElement(firstProduct);
  let secondProductPriceField = locateFirstElement(secondProduct);
  let firstProductPrice = Number(firstProductPriceField.innerHTML);
  let secondProductPrice = Number(secondProductPriceField.innerHTML);

  if (firstProductPrice > secondProductPrice) {
    resetCompareClasses(secondProductPriceField);
    return secondProductPriceField.classList.add(LOWER_PRICE_COLOR_CLASS);
  } else {
    resetCompareClasses(secondProductPriceField);
    return secondProductPriceField.classList.add(HIGHER_PRICE_COLOR_CLASS);
  }
}

function handlePriceCompare() {
  const cardNodeList = document.querySelectorAll(".js-card-compare");
  const firstElement = locateFirstElement(cardNodeList[0]);
  updateFirstElement(firstElement);
  for (let i = 1; i < cardNodeList.length; i++) {
    priceCompare(cardNodeList[0], cardNodeList[i]);
  }
}

const JS_DOWNBUTTON_CLASS = ".js-down-btn";
const JS_UPBUTTON_CLASS = ".js-up-btn";

function resetFirstAndLastVerticalBtn() {
  let firstBtn = document.querySelectorAll(JS_UPBUTTON_CLASS);
  let lastBtn = document.querySelectorAll(JS_DOWNBUTTON_CLASS);

  firstBtn.forEach((btn) => (btn.disabled = false));
  lastBtn.forEach((btn) => (btn.disabled = false));
}

function disableFirstAndLastVerticalBtn() {
  let firstBtn = document.querySelectorAll(JS_UPBUTTON_CLASS);
  let lastBtn = document.querySelectorAll(JS_DOWNBUTTON_CLASS);

  firstBtn[0].disabled = true;
  lastBtn[2].disabled = true;
}

function moveCategoryUp() {
  const compareListParentNode =
    this.parentElement.parentElement.parentElement.parentElement;
  const productCardList = compareListParentNode.children;
  const rowBtnClicked = this.parentElement.parentElement;
  const rowBtnClickedDest =
    this.parentElement.parentElement.previousElementSibling;
  const rowBtnClickedClass = this.parentElement.parentElement.classList[2];

  for (let i = 1; i < productCardList.length; i++) {
    for (let j = 1; j < productCardList[i].children.length; j++) {
      if (productCardList[i].children[j].classList[1] === rowBtnClickedClass) {
        //product category move
        let rowToBeMoved = productCardList[i].children[j];
        let rowDestination = rowToBeMoved.previousElementSibling;
        productCardList[i].insertBefore(rowToBeMoved, rowDestination);
      }
    }
  }

  //category description move
  rowBtnClicked.parentElement.insertBefore(rowBtnClicked, rowBtnClickedDest);

  resetFirstAndLastVerticalBtn();
  disableFirstAndLastVerticalBtn();
}

function handleCategoryMoveUp() {
  const btnUp = document.querySelectorAll(JS_UPBUTTON_CLASS);
  btnUp.forEach((btn) => {
    btn.addEventListener("click", moveCategoryUp);
  });
}

function moveCategoryDown() {
  const compareListParentNode =
    this.parentElement.parentElement.parentElement.parentElement;
  const productCardList = compareListParentNode.children;
  const rowBtnClicked = this.parentElement.parentElement;
  const rowBtnClickedDest = this.parentElement.parentElement.nextElementSibling;
  const rowBtnClickedClass = this.parentElement.parentElement.classList[2];

  for (let i = 1; i < productCardList.length; i++) {
    for (let j = 1; j < productCardList[i].children.length; j++) {
      if (productCardList[i].children[j].classList[1] === rowBtnClickedClass) {
        //product category move
        let rowToBeMoved = productCardList[i].children[j];
        let rowDestination = rowToBeMoved.nextElementSibling;
        rowDestination.after(rowToBeMoved);
        break;
      }
    }
  }

  //category description move
  rowBtnClickedDest.after(rowBtnClicked);
  resetFirstAndLastVerticalBtn();
  disableFirstAndLastVerticalBtn();
}

function handleCategoryMoveDown() {
  const btnUp = document.querySelectorAll(".js-down-btn");
  btnUp.forEach((btn) => {
    btn.addEventListener("click", moveCategoryDown);
  });
}
