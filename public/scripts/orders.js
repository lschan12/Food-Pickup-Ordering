$(() => {
  loadOrders('open');
  readyForPickup();
  updateActualPrepTime();
});

/**
 * Creates the individual order cards to display in '/orders' (Order Summary Page)
 * First checks if the restaurant specified a custom ETA, and sets ETA either as custom or the default estimate.
 * Then gets the current ETA based on the amount of time that has elapsed since the order was placed
 * Then generates the HTML for the order card
 */

const createOrderElement = order => {
  const orderETA = (order.actual === 0) ? order.estimated : order.actual;
  const currentETA = getCurrentETA(order.time, orderETA);

  const element = $(`
    <article>
    <div class="order-detail">
    <label>${order.id}</label>
    <div>Order Price: $${order.price / 100}</div>
    <div>Customer Name: ${order.first_name}</div>
    <div>Customer Phone Number: ${order.phone}</div>
    <div>
      <form class="update-actual">
      <input type="number" name="actual">
      <button id="submit-${order.id}" type="submit">Update</button>
      </form>
      <button id='ready-${order.id}' class="ready-pickup">Ready for pickup</button>
    </div>
    </div>
    <div class="eta">ETA: ${currentETA}</div>
    </article>
    `);
  return element;
};

/**
 * Renders all of the order cards to '/orders' (Order Summary Page)
 * By default, filters to only show the 'open' orders which are not yet ready for pickup
 */

const renderOrders = (orders, status) => {
  const filteredOrders = orders.filter(order => order.status === status);
  filteredOrders.forEach((order) => {
    const generatedOrder = createOrderElement(order);
    $("#orders-container").append(generatedOrder);
  });
};

/**
 * Loads all of the orders from the database
 * @param {string} status A string containing the order status to filter the orders by
 * Empties the current HTML before calling renderOrders function to display the new set of orders
 */

const loadOrders = (status) => {
  $.get("/api/orders")
    .then((orders) => {  
      let etas = orders.map(order => [(order.actual === 0) ? order.estimated : order.actual, order.id]);
      let sorted = etas.sort((a, b) => a[0] - b[0]);
      let sortedOrders = []

      sorted.forEach(order => {
        sortedOrders.push(orders.filter(obj => obj.id === order[1])[0]);
      })
      
      
      console.log('etas array:', etas);
      console.log('sorted array:', sorted);
      console.log('sorted orders (end product):', sortedOrders);

      $("#orders-container").empty();
      renderOrders(sortedOrders, status);
    })
    .catch((error) => {
      console.log(error);
    });
};

/**
 * Click handler for "Ready for Pickup" button on each of the order cards
 * First queries db to get data specifically for the order
 * Writes to db to set the order status to 'closed'
 * Sends SMS # 3 (order ready for pickup) to customer
 * Re-renders orders
 */

const readyForPickup = () => {
  $("#orders-container").on("click", ".ready-pickup", function () {
    let orderId = $(this).attr("id");

    $.get(`/api/orders/pickup/${orderId}`).then(data => {
      $.post(`/api/orders/${orderId}`, data).then(response => {});
      $.post('/api/sms/3',data).then(response => {});
      loadOrders('open');
    });
  });
};

/**
 * Calculates the current ETA for an order (ie. time remaining until pickup) in hours/minutes
 * @param {timestamp} sqlTimestamp The timestamp of when the order was placed
 * @param {integer} orderETA An integer representing order's total ETA (in minutes)
 * @returns {string} A string containing the hours/minutes remaining until order is ready for pickup
 */

const getCurrentETA = (sqlTimestamp, orderETA) => {
  // convert from PSQL date format ('2022-09-27T16:35:20.746Z') to JS date format
  const jsTimestamp = new Date(sqlTimestamp.replace(' ','T'));

  const minutesSinceOrder =  (Date.now() - jsTimestamp) / 1000 / 60;
  const currentETA = (orderETA - minutesSinceOrder < 0) ? 0 : orderETA - minutesSinceOrder;

  const hours = Math.floor(currentETA / 60);
  const minutes = Math.round(currentETA % 60, 0);

  if (hours === 0) return `${minutes} min`;
  if (hours === 1) return `${hours} hr, ${minutes} min`
  return `${hours} hrs, ${minutes} min`
}

const updateActualPrepTime = () => {
  $("#orders-container").on("submit", ".update-actual", function(event) {
    event.preventDefault();
    console.log("form submitted");
    // function getSecondPart(str) {
    //   return str.split('-')[1];
    let stringId = $(this).nextAll("button").attr("id");
    console.log("stringId", stringId);
    let data = {
      orderId: stringId.split('-')[1],
      actual: $(this).find("input").val()
    };
    $.post(`/api/orders/actual/${data.orderId}`, data).then(response => {
      $.get(`/api/orders/pickup/${data.orderId}`).then(smsData => {
        $.post('/api/sms/2',smsData).then(response => {
          console.log(response);
        });
        loadOrders('open');

      });
    });
  });
};
//   });
// };


// method="post" action='/api/orders/actual/${order.id}

// $.post("/tweets", $text).then(() => {
//   $textBox.val('').css("height","40px");
//   $counter.val(140);
//   $(".display-tweets").empty();
//   loadTweets();
// });
// return;

// TO DO: add click handler for 'ETA Input Box' which does the following:
// (1) writes the 'actual_prep_time' to the database
// (2) sends SMS # 2 (ETA update) to the customer
    // orderData.orderID = response.rows[0].order_id;
    //
