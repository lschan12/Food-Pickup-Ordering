$(() => {
  loadDishes("All");
  addToCart();
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
