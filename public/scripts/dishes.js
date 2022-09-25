$(document).ready(function() {
  console.log("running load dishes");
  loadDishes();
});

const createDishElement = (obj) => {
  const element = $(`
  <article>
  <div class="dish-detail">
  <label>${obj.name}</label>
  <div>${obj.description}</div>
  <div>$${obj.price / 100}</div>
  <button id="add-to-cart">Add to Cart</button>
  </div>
  <img src="${obj.photo_url}">
  </article>
  `);
  return element;
};
const renderDishes = (dishes) => {
  for (let dish of dishes) {
    let generatedDish = createDishElement(dish);
    $("#dishes-container").append(generatedDish);
  }
};
const loadDishes = () => {
  $.get("/api/dishes", function(data) {
    renderDishes(data);
  });
};

