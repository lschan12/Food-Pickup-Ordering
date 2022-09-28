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
    </div>
    <div>$${(obj.price / 100) * count}</div>
    <button id='${obj.id}' class="remove-from-cart">Remove</button>
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
    `<div class="footer">Total: $${totalPrice / 100}</div>`
  );
  removeFromCart();
};

const addToCart = () => {
  $("#dishes-container").on("click", ".add-to-cart", function () {
    let productId = $(this).attr("id");
    $.get(`/api/dishes/${productId}`, function (data) {
      totalPrice += Number(data.price);
      allCartItems.push(data);
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
    loadCart();
  });
};

const calculateEstimatedETA = (cartItems, sum = false) => {
  if (sum) {
    return cartItems.reduce((acc, obj) => acc + obj.prep_time, 0);
  };
  const factor = 1 + (cartItems.length * 0.05);
  const longestETA = cartItems.reduce((acc, obj) => acc < obj.prep_time ? obj.prep_time : acc, 0);
  console.log('factor: ',factor);
  console.log('longestETA: ',longestETA);
  console.log('estimatedETA: ',Math.ceil((( longestETA * factor) / 5)) * 5);
  alert('checkout the Console Logs');
  return Math.ceil((( longestETA * factor) / 5)) * 5;
};



const placeOrder = () => {
  let orderData = {};
  $("#place-order").on("click", () => {
    console.log("user:", userObj);
    orderData = {
      // database
      userId: userObj.id,
      totalPrice,
      estimatedTime: calculateEstimatedETA(allCartItems),
      dishIDs: allCartItems.map((dish) => dish.id),
      status: "open",
      // sms data
      customerName: userObj.first_name,
      customerPhone: userObj.phone_number,
    };
    console.log("order", orderData);
    $.post("/api/orders", orderData).then((response) => {
      console.log("postResponse", response);
      // console.log("Order data finished writing to database, response from cart.js: ", response);
      window.location.replace(`/receipt/${response.order_id}`);
      // POST to database, THEN:
      // (1) redirect to 'order receipt' display (EJS template) => replace 'place order' button with 'create new order' which redirects back to GET /dishes (and clears cart)?
      // EJS template
      // (2) display estimated order time inside the cart header (which will be updated once restaurant confirms ETA)
      // code here
      // (3) send SMS # 1 (order confirmation) to restaurant and customer
      orderData.orderID = response.order_id;
      $.post("/api/sms/1", orderData).then((response) => {});
    });
  });
};
// TO DO: once we have cookies, pull all customer data from cookie and replace filler values below
