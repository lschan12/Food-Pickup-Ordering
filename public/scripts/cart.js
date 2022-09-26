$(() => {
  placeOrder();
});

const allCartItems = [];
let uniqueCartItems = [];
let orderTotal = 0;

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
  uniqueCartItems = [...new Map(allCartItems.map((item) => [item.id, item])).values()];
  $(".cart-detail").empty();
  renderCartElement(uniqueCartItems);
  $(".cart-detail").append(
    `<div class="footer">Total: $${orderTotal / 100}</div>`
  );
  removeFromCart();
};

const addToCart = () => {
  $("#dishes-container").on("click", ".add-to-cart", function () {
    console.log("clicked");
    let productId = $(this).attr("id");
    $.get(`/api/dishes/${productId}`, function(data) {
      orderTotal += Number(data.price);
      allCartItems.push(data);
      loadCart();
    });
  });
};

const removeFromCart = () => {
  $(".remove-from-cart").on("click", function() {
    const removeID = $(this).attr("id");

    let i = allCartItems.length;
    while (i--) {
      if (allCartItems[i].id === Number(removeID)) {
        orderTotal -= Number(allCartItems[i].price);
        allCartItems.splice(i, 1);
      }
    }
    uniqueCartItems.forEach((item, index, array) => {
      if (item.id === Number(removeID)) array.splice(index, 1);
    });
    loadCart();
  });
};

const placeOrder = () => {
  $("#place-order").on("click", function() {
    const orderTime = allCartItems.reduce((acc,obj) => acc + obj.prep_time, 0);
    const dishIDs = allCartItems.map(dish => dish.id);
    const orderData = {
      orderTotal,
      orderTime,
      dishIDs
    };

    $.post("/api/orders", orderData).then((data) => {
      // POST to database, THEN:
      // (1) redirect to 'order receipt' display
      // (2) replace 'place order' button with 'create new order'?
      // (3) display estimated order time inside the cart header
      // (4) send order confirmation via SMS to user
    });
  });
};
