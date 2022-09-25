// Client facing scripts here
$(() => {
  const $dishesContainer = $("#dishes-container");
  const $categoryTitle = $(".categories a");

  $categoryTitle.on("click", function (event) {
    event.preventDefault();
    const $category = $(this).text();
    $dishesContainer.empty();
    loadDishes($category);
  });
});
