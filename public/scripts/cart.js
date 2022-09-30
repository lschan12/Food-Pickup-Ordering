$(() => {
  getUserObj();
  addToCart();
  placeOrder();
});

const allCartItems = [];
let uniqueCartItems = [];
let totalPrice = 0;
let userObj = {};
const getUserObj = () => {
  $.get("/api/users", function (data) {
    userObj = data;
  });
};

const countFunction = (array) => {
  const counter = {};
  array.forEach((obj) => {
    let key = obj.id;
    counter[key] = (counter[key] || 0) + 1;
  });
  return counter;
};

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

const renderCartElement = (array) => {
  array.forEach((element) => {
    let count = countFunction(allCartItems)[element.id];
    let generatedElement = createCartElement(element, count);
    $(".cart-detail").append(generatedElement);
  });
};

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
