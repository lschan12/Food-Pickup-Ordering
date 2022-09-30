$(() => {
  loadDishes("All");
  backToTop();
  goToCart();
  selectCategory();
});

/**
 * Click handler for food category nav bar on '/dishes' page
 */

const selectCategory = () => {
  const $categoryTitle = $(".categories a");
  $categoryTitle.on("click", function(event) {
    event.preventDefault();
    const category = $(this).text();
    loadDishes(category);
  });
};

/**
 * Generates the HTML for each individual dish card in the menu
 */

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

/**
 * Renders all of the dish cards to '/dishes' (Menu Page)
 * Filters to only show the dishes for the currently selected category on the nav bar
 */

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

/**
 * Loads all of the dishes from the database
 * @param {string} category A string containing the category to filter the dishes by
 * Empties the current HTML before calling renderDishes function to display the new set of filtered dishes
 */

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

/**
 * Detects if user is at top of page; if not, display 'back-to-top' button and hide compose tweet button in nav bar
 */

const showButton = () => {
  $(window).scroll(function() {
    if ($(this).scrollTop() !== 0) {
      $("#back-to-top").show(300);
    } else {
      $("#back-to-top").hide("slow");
    }
  });
};

/**
 * Click handler for 'Back-to-top' button to scroll to top of page and focus on form text area
 */

const backToTop = () => {
  $("#back-to-top").hide();
  showButton();
  $("#back-to-top").click(function() {
    $("html, body").animate({scrollTop: 0}, "slow");
    return false;
  });
};

/**
 * Click handler for 'Cart' button, to navigate to the cart
 */

const goToCart = () => {
  $(".search-cart").click(function() {
    $("html, body").animate({
      scrollTop: $("#order-summary").position().top
    });
  });
};
