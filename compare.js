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
    compareContainer[0].innerHTML = `
    <div class="card-compare-description">
      <div class="compare-image">
      </div>
      <div class="item">Product</div>
      <div class="item">Price</div>
      <div class="item">Category</div>      
    </div>
    `;

    switch (localStorageKeys.length) {
      case 1:
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
              compareContainer[0].classList.add("oneProducts");
              compareContainer[0].innerHTML += result;
            }
          });
        });
        break;

      case 2:
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
              compareContainer[0].classList.add("twoProducts");
              compareContainer[0].innerHTML += result;
            }
          });
        });
        break;

      case 3:
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
              compareContainer[0].classList.add("threeProducts");
              compareContainer[0].innerHTML += result;
            }
          });
        });
        break;

      case 4:
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
              compareContainer[0].classList.add("fourProducts");
              compareContainer[0].innerHTML += result;
            }
          });
        });
        break;

      case 5:
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
              compareContainer[0].classList.add("fiveProducts");
              compareContainer[0].innerHTML += result;
            }
          });
        });
        break;

      case 6:
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
              compareContainer[0].classList.add("sixProducts");
              compareContainer[0].innerHTML += result;
            }
          });
        });
        break;

      case 7:
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
              compareContainer[0].classList.add("sevenProducts");
              compareContainer[0].innerHTML += result;
            }
          });
        });
        break;

      case 8:
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
              compareContainer[0].classList.add("eightProducts");
              compareContainer[0].innerHTML += result;
            }
          });
        });
        break;

      case 9:
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
              compareContainer[0].classList.add("nineProducts");
              compareContainer[0].innerHTML += result;
            }
          });
        });
        break;

      case 10:
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
              compareContainer[0].classList.add("tenProducts");
              compareContainer[0].innerHTML += result;
            }
          });
        });
        break;

      default:
    }
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

// switch (localStorageKeys.length) {
//   case 1:
//     break;
//   case 2:
//     break;
//   case 3:
//     break;
//   case 4:
//     break;
//   case 5:
//     break;
//   case 6:
//     break;
//   case 7:
//     break;
//   case 8:
//     break;
//   case 9:
//     break;
//   case 10:
//     break;
//   default:
// }
