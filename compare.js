const compareList = document.getElementsByClassName("compare-list");
const removeFromWishlist = document.getElementsByClassName("remove-item");
const compareContainer = document.getElementsByClassName("compare-list");

let localStorageKeys = [];

for (let i = 0; i < localStorage.length; i++) {
  let key = localStorage.key(i);
  localStorageKeys.push(key);
}

fetch("./products.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Http error " + response.status);
    }
    return response.json();
  })
  .then((json) => {
    let data = json;
    compareContainer[0].innerHTML = ``;
    localStorageKeys.forEach((key) => {
      data.forEach((element) => {
        if (element.category.id === +key) {
          let result = `
            <div class="card-compare" data-id="${element.category.id}">
                <img src="${element.productImage}" alt="productPicture" class="compare-image" />
                <div class="item">${element.productTitle}</div>
                <div class="item">${element.price} $</div>
                <div class="item">${element.category.label}</div>
                <button class="remove-item">Remove from wishlist</button>
            </div>
            `;
          compareContainer[0].innerHTML += result;
        }
      });
    });
  });

setTimeout(() => {
  Array.from(removeFromWishlist).forEach((button) => {
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
}, 100);
