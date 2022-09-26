// Client facing scripts here
$(() => {
  const $categoryTitle = $(".categories a");

  $categoryTitle.on("click", function (event) {
    event.preventDefault();
    const $category = $(this).text();
    loadDishes($category);
  });
});
