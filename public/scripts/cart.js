$(() => {
    placeOrder();
});

const cartArray = [];
let noDupeArr = [];
let orderTotal = 0;

const countFunction = (array) => {
  const counter = {};
  array.forEach(obj => {
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

// const createCartFooter= (orderTotal) => {
//     return(`
//     <article>
//       
//       <button class="checkout">Place Order</button>
//     </article>
//     `);
//   };

const renderCartElement = (array) => {
  array.forEach(element => {
    let count = countFunction(cartArray)[element.id];
    let generatedElement = createCartElement(element, count);
    $('.cart-detail').append(generatedElement);
  });
};

const loadCart = () => {
  noDupeArr = [...new Map(cartArray.map((item) => [item.id, item])).values()];
  $('.cart-detail').empty();
  renderCartElement(noDupeArr);
  $('.cart-detail').append(`<div class="footer">Total: $${orderTotal / 100}</div>`);
  removeFromCart();
};

const addToCart = () => {
  $('#dishes-container').on('click', ".add-to-cart", function() {
    let productId = $(this).attr("id");
    $.get(`/api/dishes/${productId}`, function(data) {
      orderTotal += Number(data.price);
      cartArray.push(data);
      loadCart();
    });
  });
};

const removeFromCart = () => {
  $('.remove-from-cart').on('click', function() {
    const removeID = $(this).attr("id");

    let i = cartArray.length;
    while (i--) {
      if (cartArray[i].id === Number(removeID)) {
        orderTotal -= Number(cartArray[i].price);
        cartArray.splice(i, 1);
      }
    };
    noDupeArr.forEach((element, index, array) => {
      if (element.id === Number(removeID)) array.splice(index,1);
    });
    loadCart();
  });
}

const placeOrder = () => {
    $('#place-order').on('click', function () {
        console.log(orderTotal);
    });
};