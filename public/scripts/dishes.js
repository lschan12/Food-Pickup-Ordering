$(() => {
  loadDishes("All");
});

const createDishElement = dish => {
  const element = $(`
  <article>
  <div class="dish-detail">
  <label>${dish.name}</label>
  <div>${dish.description}</div>
  <div>$${dish.price / 100}</div>
  <h1 class="dishId">${dish.id}</h1>
  <button id='${dish.id}' class="add-to-cart">Add to Cart</button>
  </div>
  <img src="${dish.photo_url}">
  </article>
  `);
  return element;
};

const renderDishes = (dishes, category) => {
  let filteredDishes = dishes;
  if (category !== null && category !== "All") {
    filteredDishes = dishes.filter(dish => dish.category === category);
  }
  filteredDishes.forEach(dish => {
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
