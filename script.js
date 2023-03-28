import { fetchProducts } from "./common.js";


const bikesContainer = document.querySelector(".js-card-container");

const populateProduct = (product) => {
  return `
        <div class="card" data-id="${product.category.id}">
            <img src="${product.productImage}" alt="bike" class="product-image" />
            <h3 class="product-title">${product.productTitle}</h3>
            <h2 class="product-price">Price: ${product.price}</h2>
            <p class="product-category">Category: ${product.category.label}</p>
            <div class="row">
              <label for="compare">Compare</label>
              <input type="checkbox" class="js-compare-product compareProduct"/>
            </div>  
        </div>
        `;
};

function populateBikeList() {
  fetchProducts().then((data) => {
    for (let bikeData of data) {
      const bikeCard = populateProduct(bikeData);
      bikesContainer.innerHTML += bikeCard;
    }
  });
}
populateBikeList();


//show/hide filter
function showHideResultsBySearchPhrase() {  
  let input = this.value;
  input.toLowerCase();
  //TODO replace document.getElementsByClassName s querySelectorAll s parent js-card-container
  const productsCard = document.getElementsByClassName("card");
  const productName = document.getElementsByClassName("product-title");

  for (let i = 0; i < productsCard.length; i++) {
    if (!productName[i].innerHTML.toLowerCase().includes(input)) {
      productsCard[i].classList.add("hide");
    } else {
      productsCard[i].classList.remove("hide");
    }
  }
}

function initShowHideResultsBySearchPhrase(){
  document.querySelector(".js-search-bar").addEventListener('keyup', showHideResultsBySearchPhrase);
}
initShowHideResultsBySearchPhrase();


// ajax filter
function initFilterResultsByAjaxRequest(){

  // TODO querySelectAll
  const button = document.getElementById("search-button");
  const input = document.getElementById("asyncSearch");

  function filterResultsByAjaxRequest(){
      let loader = `<div class="boxLoading"></div>`;
      bikesContainer.innerHTML = loader;

      fetchProducts().then((data) => {
        
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
          bikesContainer.removeChild(bikesContainer.firstChild);
        });
  }

  input.addEventListener("keyup", filterResultsByAjaxRequest);
  button.addEventListener("click", filterResultsByAjaxRequest);
}
initFilterResultsByAjaxRequest();

// populate categories in dropdown
const categoryDropdown = document.getElementById("bike-category");
function populateCategoriesInDropdown(){
  let lookup = {};
  let result = [];

  fetchProducts().then((data) => {

    //redundant => parameter renamed to data
    //let data = json;

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
categoryDropdown.addEventListener("change", () => {
  let selectedValue = document.getElementById("bike-category");
  let input = selectedValue.value;

  fetchProducts().then((json) => {
    let data = json;
    bikesContainer.innerHTML = ``;
    data.forEach((element) => {
      if (input === element.category.label) {
        let result = populateProduct(element);
        bikesContainer.innerHTML += result;
      }
    });
  });
});

// compare checkbox enable/disable
function getCompareCheckboxes(){
  return document.querySelectorAll(".js-compare-product");
}
function toggleCompareCheckboxes(){
  let disable = false;
  if(this.checked && this.value === 'compare_enable'){
    disable = false;
  }
  if(this.checked && this.value === 'compare_disable'){
    disable = true;
  }

  getCompareCheckboxes().forEach((el) => {
    el.disabled = disable;
  });
}
function initEnableCompareCheckboxes() {
  document.querySelectorAll(".js-compare-enable").forEach((radiobox) => {
    radiobox.addEventListener("change",toggleCompareCheckboxes);
  });
}
initEnableCompareCheckboxes();


// Set the checked property of the checkboxes based on the value in local storage
function setCheckboxStateFromLocalStorage() {
  getCompareCheckboxes().forEach((checkbox) => {
    const cardEl = checkbox.parentElement.parentElement;
    const dataId = cardEl.getAttribute("data-id");
    const isChecked = localStorage.getItem(dataId);
    checkbox.checked = isChecked || false; // Default to false if the value is null or undefined
  });
}

// Update local storage and set the checked property of the checkboxes on change
function initCompare() {
  getCompareCheckboxes().forEach((checkbox) => {
    checkbox.addEventListener("change", (event) => {
      const cardEl = checkbox.parentElement.parentElement;
      const dataId = cardEl.getAttribute("data-id");

      if (event.target.checked) {
        localStorage.setItem(dataId, "Test");
      } else {
        localStorage.removeItem(dataId);
      }
    });
  });
  // Call the function to set the checked property of the checkboxes on page load
  setCheckboxStateFromLocalStorage();
}

setTimeout(initCompare, 1000);

// init select all functionality
function initSelectAll() {
  const selectAll = document.getElementById("selectAll");

  selectAll.addEventListener("change", (e) => {
    const compareCheckboxes = getCompareCheckboxes();
    if (e.target.checked === true) {
      for (let i = 0; i < compareCheckboxes.length; i++) {
        compareCheckboxes[i].checked = true;
        let dataId =
          compareCheckboxes[i].parentElement.parentElement.getAttribute("data-id");
        localStorage.setItem(dataId, "Test");
      }
      localStorage.setItem("checkboxSelectAll", selectAll.checked);
    } else {
      for (let i = 0; i < compareCheckboxes.length; i++) {
        compareCheckboxes[i].checked = false;
        let dataId =
          compareCheckboxes[i].parentElement.parentElement.getAttribute("data-id");
        localStorage.removeItem(dataId);
      }
      // localStorage.setItem("checkboxSelectAll", (selectAll.checked = false));
      localStorage.removeItem("checkboxSelectAll");
    }
  });

  addEventListener("load", () => {
    selectAll.checked = localStorage.getItem("checkboxSelectAll");
  });
}

initSelectAll();

