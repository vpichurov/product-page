import { loader, fetchProducts } from "./common.js";

const compareContainer = document.getElementsByClassName("compare-list");

function getLocalStoareKeys() {
  let localStorageKeys = [];
  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    localStorageKeys.push(key);
  }
  return localStorageKeys;
}

loader.addLoader(".compare-list");

function setFirstColumnOfCompareProductTable() {
  compareContainer[0].innerHTML = `
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
                <button class="remove-item">Remove from wishlist</button>
            </div>
            `;
  return result;
}

function appendCompareProduct(product) {
  compareContainer[0].innerHTML += product;
}

function populateWishListProducts() {
  return fetchProducts().then((json) => {
    let data = json;
    setFirstColumnOfCompareProductTable();
    loader.addLoader(".compare-list");
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
  loader.removeLoader(".compare-list");
  removeFromWishList();
});

function removeFromWishList() {
  const removeFromWishlistButton =
    document.getElementsByClassName("remove-item");
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
