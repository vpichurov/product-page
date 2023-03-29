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


function addLoader(parentElmSelector){
  const parentElm = document.querySelector(parentElmSelector);
  let loader = `<div class="boxLoading"></div>`;
  parentElm.insertAdjacentHTML('afterbegin', loader);
}

function removeLoader(parentElmSelector){
  const parentElm = document.querySelector(parentElmSelector);
  parentElm.removeChild(parentElm.firstChild);
}

export let loader = {
  addLoader: addLoader,
  removeLoader: removeLoader
}
