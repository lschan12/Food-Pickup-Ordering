$(() => {
  loadDishes("All");
  addToCart();
  // navToggle();
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
  <article>
  <div class="item-count">${count}x</div>
  <div class="dish-detail">
  <label>${obj.name}</label>
  </div>
  <div>$${(obj.price / 100) * count}</div>
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
  const noDupeArr = [...new Map(cartArray.map((item) => [item.id, item])).values()];
  $('.cart-detail').empty();
  renderCartElement(noDupeArr);
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

// const navToggle = () => {
//   let nav = $("#nav-toggle");
//   nav.click(function(e) {
//     if (nav.css("display") === "flex") {
//       $(".user-buttons").css({"display": "none"});
//     } else {
//       $(".user-buttons").css({"display": "flex"});
//     }
//   });
// };
