import { loader, fetchProducts, localStorageFunctions } from "./common.js";

const bikesContainer = document.querySelector(".js-card-container");

const populateProduct = (product) => {
  return `
        <div class="card js-card" data-id="${product.category.id}">
            <img src="${product.productImage}" alt="bike" class="product-image js-product-image" />
            <h3 class="product-title js-product-title">${product.productTitle}</h3>
            <h2 class="product-price js-product-price">Price: ${product.price}</h2>
            <p class="product-category js-product-category">Category: ${product.category.label}</p>
            <div class="row">
              <label for="compare">Compare</label>
              <input type="checkbox" class="js-compare-product compareProduct"/>
            </div>  
        </div>
        `;
};

function fetchProductsAfterCallback() {
  loader.removeLoader(".js-card-container");
  initCompare();
}

function clearResults() {
  const cardContainer = document.querySelector(".js-card-container");

  return (cardContainer.innerHTML = ``);
}

function fetchProductsBeforeCallback() {
  clearResults();
  loader.addLoader(".js-card-container");
}

function populateBikeList() {
  fetchProductsBeforeCallback();
  fetchProducts()
    .then((data) => {
      for (let bikeData of data) {
        const bikeCard = populateProduct(bikeData);
        bikesContainer.innerHTML += bikeCard;
      }
    })
    .finally(function () {
      fetchProductsAfterCallback();
    });
}
populateBikeList();

//show/hide filter
function showHideResultsBySearchPhrase() {
  let input = this.value;
  input.toLowerCase();
  const productsCard = document.querySelectorAll(".js-card");
  const productName = document.querySelectorAll(".js-product-title");

  for (let i = 0; i < productsCard.length; i++) {
    if (!productName[i].innerHTML.toLowerCase().includes(input)) {
      productsCard[i].classList.add("hide");
    } else {
      productsCard[i].classList.remove("hide");
    }
  }
}

function initShowHideResultsBySearchPhrase() {
  document
    .querySelector(".js-search-bar")
    .addEventListener("keyup", showHideResultsBySearchPhrase);
}
initShowHideResultsBySearchPhrase();

// ajax filter
function initFilterResultsByAjaxRequest() {
  // TODO querySelectAll
  const button = document.querySelector(".js-search-button");
  const input = document.querySelector(".js-asyncSearch");

  function filterResultsByAjaxRequest() {
    fetchProductsBeforeCallback();
    fetchProducts()
      .then((data) => {
        let inputVal = input.value.toLowerCase();

        data.forEach((product) => {
          if (product.productTitle.toLowerCase().includes(inputVal)) {
            let result = populateProduct(product);
            bikesContainer.innerHTML += result;
          }
        });
      })
      .catch(function () {
        this.dataError = true;
      })
      .finally(function () {
        fetchProductsAfterCallback();
      });
  }
  button.addEventListener("click", filterResultsByAjaxRequest);
}
initFilterResultsByAjaxRequest();

// populate categories in dropdown
const categoryDropdown = document.querySelector(".js-bike-category");
function populateCategoriesInDropdown() {
  let lookup = {};
  let result = [];

  fetchProducts().then((data) => {
    data.forEach((product) => {
      let category = product.category.label;

      if (!(category in lookup)) {
        lookup[category] = 1;
        result.push(category);
      }
    });

    result.forEach((product) => {
      let selections = `
          <option value="${product}" class="dropdown-category">${product}</option>
          `;
      categoryDropdown.innerHTML += selections;
    });
  });
}
populateCategoriesInDropdown();

//init dropdown filter change event
function dropdownFilter() {
  categoryDropdown.addEventListener("change", () => {
    let selectedValue = document.querySelector(".js-bike-category");
    let input = selectedValue.value;
    fetchProductsBeforeCallback();
    fetchProducts()
      .then((json) => {
        let data = json;
        bikesContainer.innerHTML = ``;
        data.forEach((element) => {
          if (input === element.category.label) {
            let result = populateProduct(element);
            bikesContainer.innerHTML += result;
          }
        });
      })
      .finally(function () {
        fetchProductsAfterCallback();
      });
  });
}

dropdownFilter();

// compare checkbox enable/disable
function toggleCompareCheckboxes() {
  let disable = false;
  if (this.checked && this.value === "compare_enable") {
    disable = false;
  }
  if (this.checked && this.value === "compare_disable") {
    disable = true;
  }

  getCompareCheckboxes().forEach((el) => {
    el.disabled = disable;
  });
}
function initEnableCompareCheckboxes() {
  document.querySelectorAll(".js-compare-enable").forEach((radiobox) => {
    radiobox.addEventListener("change", toggleCompareCheckboxes);
  });
}
initEnableCompareCheckboxes();

// init select all functionality
function initSelectAll() {
  const selectAll = document.querySelector(".js-selectAll");
  selectAll.addEventListener("change", (e) => {
    const compareCheckboxes = getCompareCheckboxes();
    if (e.target.checked === true) {
      //add selectAll button to localstorage
      localStorageFunctions.localStorageItems["selectAll"] = true;
      for (let i = 0; i < compareCheckboxes.length; i++) {
        compareCheckboxes[i].checked = true;
        var event = new Event("change");
        compareCheckboxes[i].dispatchEvent(event);
      }
    } else {
      // remove selectAll button from localStorage
      localStorageFunctions.localStorageItems["selectAll"] = false;
      for (let i = 0; i < compareCheckboxes.length; i++) {
        compareCheckboxes[i].checked = false;
        var event = new Event("change");
        compareCheckboxes[i].dispatchEvent(event);
      }
      localStorage.removeItem("checkboxSelectAll");
    }
  });

  addEventListener("load", () => {
    selectAll.checked = localStorageFunctions.localStorageItems.selectAll;
  });
}
initSelectAll();

function initCompare() {
  getCompareCheckboxes().forEach((checkbox) => {
    checkbox.addEventListener("change", (event) => {
      const cardEl = checkbox.parentElement.parentElement;
      const dataId = cardEl.getAttribute("data-id");
      const nameEl = cardEl.children[1].innerHTML;

      if (event.target.checked) {
        if (!localStorageFunctions.localStorageItems[dataId]) {
          localStorageFunctions.addToLocalStorage(
            "compareList",
            dataId,
            nameEl
          );
        }
      } else {
        if (localStorageFunctions.localStorageItems.hasOwnProperty(dataId)) {
          localStorageFunctions.removeFromLocalStorage("compareList", dataId);
        }
      }
    });
  });
  // Call the function to set the checked property of the checkboxes on page load
  setCheckboxStateFromLocalStorage();
}
initCompare();

// Set the checked property of the checkboxes based on the value in local storage
function setCheckboxStateFromLocalStorage() {
  getCompareCheckboxes().forEach((checkbox) => {
    const cardEl = checkbox.parentElement.parentElement;
    const dataId = cardEl.getAttribute("data-id");
    const isChecked =
      localStorageFunctions.localStorageItems.hasOwnProperty(dataId);
    checkbox.checked = isChecked || false; // Default to false if the value is null or undefined
  });
}
// Set the checked property of the checkboxes based on the value in local storage
setCheckboxStateFromLocalStorage();

// compare checkbox enable/disable
function getCompareCheckboxes() {
  return document.querySelectorAll(".js-compare-product");
}
