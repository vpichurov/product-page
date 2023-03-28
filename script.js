import { fetchProducts } from "./common.js";

const cardContainer = document.getElementsByClassName("card-container");

const promise = fetchProducts();

const populateProducts = (product) => {
  return `
        <div class="card" data-id="${product.category.id}">
            <img src="${product.productImage}" alt="bike" class="product-image" />
            <h3 class="product-title">${product.productTitle}</h3>
            <h2 class="product-price">Price: ${product.price}</h2>
            <p class="product-category">Category: ${product.category.label}</p>
            <div class="row">
              <label for="compare">Compare</label>
              <input type="checkbox" class="compareProduct"/>
            </div>  
        </div>
        `;
};

promise.then((data) => {
  for (let index of data) {
    const card = populateProducts(index);
    cardContainer[0].innerHTML += card;
  }
});

function searchProducts() {
  let input = document.getElementById("searchbar").value;
  input.toLowerCase();
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

// async search through json

const button = document.getElementById("search-button");
const input = document.getElementById("asyncSearch");

input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();

    const container = document.getElementById("container");

    let loader = `<div class="boxLoading"></div>`;
    container.innerHTML = loader;

    fetchProducts()
      .then((json) => {
        let data = json;

        let input = document.getElementById("asyncSearch").value;
        input.toLowerCase();

        data.forEach((product) => {
          if (product.productTitle.toLowerCase().includes(input)) {
            let result = populateProducts(product);
            container.innerHTML += result;
            container.removeChild(container.firstChild);
          }
        });
      })
      .catch(function () {
        this.dataError = true;
      });
  }
});

// category dropdown

const categoryDropdown = document.getElementById("bike-category");
let lookup = {};
let result = [];

fetchProducts().then((json) => {
  let data = json;

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

// dropdown filter

categoryDropdown.addEventListener("change", () => {
  let selectedValue = document.getElementById("bike-category");
  let input = selectedValue.value;

  fetchProducts().then((json) => {
    let data = json;
    cardContainer[0].innerHTML = ``;
    data.forEach((element) => {
      if (input === element.category.label) {
        let result = populateProducts(element);
        cardContainer[0].innerHTML += result;
      }
    });
  });
});

// compare enable
const radioChecked = document.getElementById("compareEnabled");
const radioUnchecked = document.getElementById("compareDisabled");
const compareProducts = document.getElementsByClassName("compareProduct");

radioChecked.addEventListener("change", () => {
  if (radioChecked.checked) {
    Array.from(compareProducts).forEach((el) => {
      el.disabled = false;
    });
  }
});

radioUnchecked.addEventListener("change", () => {
  if (radioUnchecked.checked) {
    Array.from(compareProducts).forEach((el) => {
      el.disabled = true;
    });
  }
});

//compare checked products

// Set the checked property of the checkboxes based on the value in local storage
function setCheckboxStateFromLocalStorage() {
  Array.from(compareProducts).forEach((checkbox) => {
    const cardEl = checkbox.parentElement.parentElement;
    const dataId = cardEl.getAttribute("data-id");
    const isChecked = localStorage.getItem(dataId);
    checkbox.checked = isChecked || false; // Default to false if the value is null or undefined
  });
}

// Update local storage and set the checked property of the checkboxes on change
setTimeout(() => {
  Array.from(compareProducts).forEach((checkbox) => {
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
}, 100);

const selectAll = document.getElementById("selectAll");

selectAll.addEventListener("change", (e) => {
  if (e.target.checked === true) {
    for (let i = 0; i < compareProducts.length; i++) {
      compareProducts[i].checked = true;
      let dataId =
        compareProducts[i].parentElement.parentElement.getAttribute("data-id");
      localStorage.setItem(dataId, "Test");
    }
    localStorage.setItem("checkboxSelectAll", selectAll.checked);
  } else {
    for (let i = 0; i < compareProducts.length; i++) {
      compareProducts[i].checked = false;
      let dataId =
        compareProducts[i].parentElement.parentElement.getAttribute("data-id");
      localStorage.removeItem(dataId);
    }
    // localStorage.setItem("checkboxSelectAll", (selectAll.checked = false));
    localStorage.removeItem("checkboxSelectAll");
  }
});

addEventListener("load", () => {
  selectAll.checked = localStorage.getItem("checkboxSelectAll");
});
