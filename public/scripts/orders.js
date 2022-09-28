$(() => {
  loadOrders('open');
});

const createOrderElement = order => {
  const orderETA = (order.actual === 0) ? order.estimated : order.actual;
  const currentETA = getCurrentETA(order.time, orderETA);

  const element = $(`
    <article>
    <div class="order-detail">
    <label>#${order.id}</label>
    <div>Order Price: $${order.price / 100}</div>
    <div>Customer Name: ${order.first_name}</div>
    <div>Customer Phone Number: ${order.phone}</div>
    <button id='${order.id}' class="ready-pickup">Ready for pickup</button>
    </div>
    <div class="eta">ETA: ${currentETA}</div>
    </article>
    `);
  return element;
};

const renderOrders = (orders, status) => {
  let filteredOrders = orders;
  filteredOrders = orders.filter(order => order.status === status);
  orders.forEach((order) => {
    const generatedOrder = createOrderElement(order);
    $("#orders-container").append(generatedOrder);
  });
};

const loadOrders = (status) => {
  $.get("/api/orders")
    .then((data) => {
      data.forEach(order => {
        // console.log(calculateETA(order.order_time));
        console.log("orderpage", order);
      })
      $("#orders-container").empty();
      renderOrders(data, status);
    })
    .catch((error) => {
      console.log(error);
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






// TO DO: add click handler for 'ETA Input Box' which does the following:
// (1) writes the 'actual_prep_time' to the database
// (2) sends SMS # 2 (ETA update) to the customer
    // orderData.orderID = response.rows[0].order_id;
    //   $.post('/api/sms/2',orderData).then(response => {
