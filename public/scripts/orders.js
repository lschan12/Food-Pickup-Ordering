$(() => {
  loadOrders("All");
});

const createOrderElement = (obj) => {
  const element = $(`
    // <article>
    // <div class="dish-detail">
    // <label>${obj.name}</label>
    // <div>${obj.description}</div>
    // <div>$${obj.price / 100}</div>
    // <h1 class="dishId">${obj.id}</h1>
    // <button id='${obj.id}' class="add-to-cart">Add to Cart</button>
    // </div>
    // <img src="${obj.photo_url}">
    // </article>
    // `);
  return element;
};

const renderOrders = (orders, status) => {
  let filteredOrders = orders;
  if (status !== null && status !== "All") {
    filteredOrders = orders.filter((order) => order.status === status);
  }
  filteredOrders.forEach((order) => {
    const generatedOrder = createOrderElement(order);
    $("#orders-container").append(generatedOrder);
  });
};

const loadOrders = (status) => {
    $.get("/api/orders")
      .then((data) => {
        $("#orders-container").empty();
        renderOrders(data, status);
      })
      .catch((error) => {
        console.log(error);
      });
  };

// TO DO: add click handler for 'ETA Input Box' which does the following:
// (1) writes the 'actual_prep_time' to the database
// (2) sends a text to the client
