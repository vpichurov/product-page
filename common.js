export async function fetchProducts() {
  try {
    const response = await fetch("./products.json");
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Could not get products: ${error}`);
  }
}

function addLoader(parentElmSelector) {
  const parentElm = document.querySelector(parentElmSelector);
  let loader = `<div class="boxLoading"></div>`;
  parentElm.insertAdjacentHTML("afterbegin", loader);
}

function removeLoader(parentElmSelector) {
  const parentElm = document.querySelector(parentElmSelector);
  parentElm.removeChild(parentElm.firstChild);
}

let localStorageItems = (() => {
  const fieldValue = localStorage.getItem("localStorageCompareProducts");
  return fieldValue === null ? {} : JSON.parse(fieldValue);
})();

export let loader = {
  addLoader: addLoader,
  removeLoader: removeLoader,
};

export let localStorageFunctions = {
  localStorageItems: localStorageItems,
  addToLocalStorage: addToLocalStorage,
  removeFromLocalStorage: removeFromLocalStorage,
};

function addToLocalStorage(list, key, value) {
  //1 if comp list
  if (list === "compareList") {
    localStorageItems[`${key}`] = value;
    localStorage.setItem(
      "localStorageCompareProducts",
      JSON.stringify(localStorageItems)
    );
  }
  //2 else if wishlist
  else if (list === "wishList") {
    localStorageItems[`${key}`] = value;
    localStorage.setItem(
      "localStorageWishlistProducts",
      JSON.stringify(localStorageItems)
    );
  } else {
    console.log("enter right storage");
  }
}

function removeFromLocalStorage(list, key) {
  //1 if comp list
  if (list === "compareList") {
    delete localStorageItems[`${key}`];
    localStorage.setItem(
      "localStorageCompareProducts",
      JSON.stringify(localStorageItems)
    );
  }
  //2 else if wishlist
  else if (list === "wishList") {
    localStorage.setItem(
      "localStorageWishlistProducts",
      JSON.stringify(localStorageItems)
    );
  } else {
    console.log("enter right storage");
  }
}
