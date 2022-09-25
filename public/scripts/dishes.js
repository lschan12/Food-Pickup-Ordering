$(document).ready(function () {
  console.log("running load dishes");
  loadDishes("All");
});

const createDishElement = (obj) => {
  const element = 
  `<article>
    <div class="dish-detail">
      <label>${obj.name}</label>
      <div>${obj.description}</div>
      <div>$${obj.price / 100}</div>
      <button id="add-to-cart">Add to Cart</button>
    </div>
    <img src="${obj.photo_url}">
  </article>`;
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

// const renderDishes = (dishes, category) => {
//   for (let dish of dishes) {
//     let generatedDish = createDishElement(dish);
//     $("#dishes-container").append(generatedDish);
//   }
// };

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
