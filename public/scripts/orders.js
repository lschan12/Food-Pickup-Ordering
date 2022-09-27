$(() => {
  loadOrders('open');
});

const createOrderElement = order => {
  const element = $(`
    // <article>
    // <div class="order-detail">
    // <label>${order.name}</label>
    // <div>${order.description}</div>
    // <div>$${order.price / 100}</div>
    // <h1 class="orderId">${order.id}</h1>
    // <button id='${order.id}' class="ready-pickup">Ready for pickup</button>
    // </div>
    // <img src="${order.photo_url}">
    // </article>
    // `);
  return element;
};

const renderOrders = (orders, status) => {
  let filteredOrders = orders;
  if (status !== null && status !== "All") {
    filteredOrders = orders.filter(order => order.status === status);
  }
  filteredOrders.forEach((order) => {
    const generatedOrder = createOrderElement(order);
    $("#orders-container").append(generatedOrder);
  });
};

const loadOrders = (status) => {
  $.get("/api/orders")
    .then((data) => {
      data.forEach(order => {
        console.log(calculateETA(order.order_time));
      })
      // $("#orders-container").empty();
      // renderOrders(data, status);
    })
    .catch((error) => {
      console.log(error);
    });
};

const calculateETA = (timestamp, orderTime) => {
  // convert from PSQL date format ('2022-09-27T16:35:20.746Z') to JS date format
  const jsTimestamp = new Date(timestamp.replace(' ','T'));
  // get amount of time since order was placed
  const totalMinutesElapsed =  (Date.now() - jsTimestamp) / 1000 / 60;
  

  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60, 0);

  // return formatted string
  if (hours === 0) return `${minutes} min`;
  if (hours === 1) return `${hours} hr, ${minutes} min`
  return `${hours} hrs, ${minutes} min`
}

// TO DO: add click handler for 'ETA Input Box' which does the following:
// (1) writes the 'actual_prep_time' to the database
// (2) sends SMS # 2 to the client
  // orderData.orderID = response.rows[0].order_id;
  //     $.post('/api/sms/2',orderData).then(response => {