$(() => {
  loadDishes("All");
  backToTop();
  goToCart();
  selectCategory();
});

const selectCategory = () => {
  const $categoryTitle = $(".categories a");
  $categoryTitle.on("click", function(event) {
    event.preventDefault();
    const $category = $(this).text();
    loadDishes($category);
  });
};

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

// Detect if user is at top of page; if not, display back-to-top button and hide compose tweet button in nav bar
const showButton = () => {
  $(window).scroll(function() {
    if ($(this).scrollTop() !== 0) {
      $("#back-to-top").show(300);
    } else {
      $("#back-to-top").hide("slow");
    }
  });
};

// Back-to-top button to scroll to top of page and focus on form text area
const backToTop = () => {
  $("#back-to-top").hide();
  showButton();
  $("#back-to-top").click(function() {
    $("html, body").animate({scrollTop: 0}, "slow");
    return false;
  });
};

const goToCart = () => {
  $(".search-cart").click(function() {
    $("html, body").animate({
      scrollTop: $("#order-summary").position().top
    });
  });
};
