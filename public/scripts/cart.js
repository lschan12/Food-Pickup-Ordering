$(() => {
  placeOrder();
  sendSMS();
});

const allCartItems = [];
let uniqueCartItems = [];
let totalPrice = 0;

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

const placeOrder = () => {
  $("#place-order").on("click",() => {
    
    // TO DO: once we have cookies, pull all customer data from cookie and replace filler values below
    const orderData = { 
      // database
      customerID: 1,
      totalPrice, 
      estimatedTime: allCartItems.reduce((acc,obj) => acc + obj.prep_time, 0),
      dishIDs: allCartItems.map(dish => dish.id),
      // sms data 
      customerName: 'Bob Smith', 
      customerPhone: '', 
    }

    $.post("/api/orders", orderData).then((response) => {
      console.log("Order data finished writing to database, response from cart.js: ", response);
      // orderData.orderID = response.order_id;
      
      // POST to database, THEN:
      
      // (1) redirect to 'order receipt' display (EJS template) => replace 'place order' button with 'create new order' which redirects back to GET /dishes (and clears cart)?
              // EJS template

      // (2) display estimated order time inside the cart header (which will be updated once restaurant confirms ETA)
              // code here
      
      // (3) send SMS # 1 (order confirmation) to restaurant and customer
      $.post('/api/sms/1',orderData).then(response => {
        console.log("SMS # 1 completed (via post from cart.js), response from cart.js: ", response)
      });
    });
  });
};

const sendSMS = () => {
  $("#send-SMS").on("click", function () {
    console.log("clicked SMS button");
    $.get('/api/sms')
  });
};
