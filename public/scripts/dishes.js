$(document).ready(function() {
  loadDishes("All");
  addToCart();
  removeFromCart();
});

const createDishElement = (obj) => {
  const element = $(`
  <article>
  <div class="dish-detail">
  <label>${obj.name}</label>
  <div>${obj.description}</div>
  <div>$${obj.price / 100}</div>
  <h1 class="dishId">${obj.id}</h1>
  <button id='${obj.id}' class="add-to-cart">Add to Cart</button>
  </div>
  <img src="${obj.photo_url}">
  </article>
  `);
  return element;
};

const renderDishes = (dishes, category) => {
  let filteredDishes = dishes;
  if (category !== null && category !== "All") {
    filteredDishes = dishes.filter((dish) => dish.category === category);
  }
  filteredDishes.forEach((dish) => {
    const generatedDish = createDishElement(dish);
    $("#dishes-container").append(generatedDish);
  });
};

const loadDishes = (category) => {
  $.get("/api/dishes")
    .then((data) => {
      $("#dishes-container").empty();
      renderDishes(data, category);
    })
    .catch((error) => {
      console.log(error);
    });
};

const cartArray = [];
let noDupeArr = [];
const countFunction = (array) => {
  const counter = {};
  array.forEach(obj => {
    let key = obj.id;
    counter[key] = (counter[key] || 0) + 1;
  });
  return counter;
};

const createCartElement = (obj, count) => {
  const element = $(`
  <article class="cart">
    <div class="item-count">${count}</div>
    <div class="dish-detail">
      <label>${obj.name}</label>
    </div>
    <div>$${(obj.price / 100) * count}</div>
    <button id='${obj.id}' class="remove-from-cart">Remove</button>
  </article>
  `);
  return element;
};

const renderCartElement = (array) => {
  array.forEach(element => {
    let count = countFunction(cartArray)[element.id];
    let generatedElement = createCartElement(element, count);
    $('.cart-detail').append(generatedElement);
  });
};

const loadCart = () => {
  noDupeArr = [...new Map(cartArray.map((item) => [item.id, item])).values()];
  $('.cart-detail').empty();
  renderCartElement(noDupeArr);
  removeFromCart();
};

const addToCart = () => {
  $('#dishes-container').on('click', ".add-to-cart", function() {
    let productId = $(this).attr("id");
    $.get(`/api/dishes/${productId}`, function(data) {
      cartArray.push(data);
      loadCart();
    });
  });
};

const removeFromCart = () => {

  $('.remove-from-cart').on('click', function() {
    const removeID = $(this).attr("id");

    let i = cartArray.length;
    while (i--) {
      if (cartArray[i].id === Number(removeID)) {
        cartArray.splice(i, 1);
      }
    };
    noDupeArr.forEach((element, index, array) => {
      if (element.id === Number(removeID)) array.splice(index,1);
    });

    loadCart();
  });
}
