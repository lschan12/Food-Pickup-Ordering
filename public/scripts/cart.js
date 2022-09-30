$(() => {
  getUserObj();
  addToCart();
  placeOrder();
});

const allCartItems = [];
let uniqueCartItems = [];
let totalPrice = 0;
let userObj = {};

/**
 * Gets current user's data from database
 */
const getUserObj = () => {
  $.get("/api/users", function (data) {
    userObj = data;
  });
};

/**
 * Helper function to get the quantity of a particular dish for the cart display
 */
const countFunction = (array) => {
  const counter = {};
  array.forEach((obj) => {
    let key = obj.id;
    counter[key] = (counter[key] || 0) + 1;
  });
  return counter;
};

/**
 * Generates the HTML for each individual dish in the cart
 */
const createCartElement = (obj, count) => {
  const element = $(`
  <article>
    <div class="item-count">${count}</div>
    <div class="dish-detail">
      <label>${obj.name}</label>
      <button id='${obj.id}' class="remove-from-cart">Remove</button>
    </div>
    <div>$${((obj.price / 100) * count).toFixed(2)}</div>
  </article>
  `);
  return element;
};

/**
 * Renders all of cart items
 */
const renderCartElement = (array) => {
  array.forEach((element) => {
    let count = countFunction(allCartItems)[element.id];
    let generatedElement = createCartElement(element, count);
    $(".cart-detail").append(generatedElement);
  });
};

/**
 * Maps all of the unique dishes in the order 
 * Empties the cart before dynamically re-rendering the cart
 * Initializes the removeFromCart click handler
 */
const loadCart = () => {
  uniqueCartItems = [
    ...new Map(allCartItems.map((item) => [item.id, item])).values(),
  ];
  $(".cart-detail").empty();
  renderCartElement(uniqueCartItems);
  $(".cart-detail").append(
    `<div class="footer">Total: $${(totalPrice / 100).toFixed(2)}</div>`
  );
  removeFromCart();
};

/**
 * Click handler for the 'Add to Cart' button on each of the dish cards 
 * Queries database to get data specifically for the dish and adds to cart items array
 * Updates the cart total by adding the new dish's price
 * Updates and renders the order's estimated ETA
 * Re-renders the cart
 */

const addToCart = () => {
  $("#dishes-container").on("click", ".add-to-cart", function () {
    let productId = $(this).attr("id");
    $.get(`/api/dishes/${productId}`, function (data) {
      totalPrice += Number(data.price);
      allCartItems.push(data);
      let totalTime = calculateEstimatedETA(allCartItems);
      $("#cart-est").val(totalTime);
      loadCart();
    });
  });
};

/**
 * Click handler for the 'Remove from Cart' button on each of the cart line items
 * Removes the item from the cart items arrays (all & unique)
 * Updates and renders the order's estimated ETA
 * Re-renders the cart
 */

const removeFromCart = () => {
  $(".remove-from-cart").on("click", function () {
    const removeID = $(this).attr("id");

    let i = allCartItems.length;
    while (i--) {
      if (allCartItems[i].id === Number(removeID)) {
        totalPrice -= Number(allCartItems[i].price);
        allCartItems.splice(i, 1);
      }
    }
    uniqueCartItems.forEach((item, index, array) => {
      if (item.id === Number(removeID)) array.splice(index, 1);
    });
    let totalTime = calculateEstimatedETA(allCartItems);
    $('#cart-est').val(totalTime);
    loadCart();
  });
};

/**
 * Calculates a realistic estimated ETA that scales with order size
 * @param {[{}]} cartItems An array of objects containing all of the cart items
 * @param {bool} sum A boolean, if set to true, will return the total sum of each cart item's individual ETA
 * @returns {integer} The order's estimated ETA, in minutes (rounded up to nearest 5)
 */

const calculateEstimatedETA = (cartItems, sum = false) => {
  if (sum) {
    return cartItems.reduce((acc, obj) => acc + obj.prep_time, 0);
  }
  const factor = 1 + ((cartItems.length - 1) * 0.05);
  const longestETA = cartItems.reduce((acc, obj) => acc < obj.prep_time ? obj.prep_time : acc, 0);
  const estimatedETA = Math.ceil(((longestETA * factor) / 5)) * 5;
  return estimatedETA;
};

/**
 * Click handler for the 'Place Order' button at the bottom of the cart
 * Creates a data object to pass to the POST to /api/orders
 * Inserts data into orders table in db via the POST to /api/orders
 * Renders the order confirmation (receipt) page for customer
 * Sends SMS # 1 (order confirmation) to both restaurant and customer
 */

const placeOrder = () => {
  $("#place-order").on("click", () => {
    const orderData = {
      userId: userObj.id,
      userName: userObj.first_name,
      userPhone: userObj.phone_number,
      totalPrice,
      estimatedTime: calculateEstimatedETA(allCartItems),
      dishIDs: allCartItems.map((dish) => dish.id),
      status: "open",
    };
    $.post("/api/orders", orderData).then((response) => {
      orderData["orderID"] = response.order_id;
      window.location.replace(`/receipt/${response.order_id}`);
      $.post("/api/sms/1", orderData).then((response) => {});
    });
  });
};