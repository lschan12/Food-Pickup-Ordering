$(() => {
  const socket = io();
  socket.on("connect", () => {
    loadOrders("open");
    viewCurrentOrders();
    viewOrderHistory();
    readyForPickup(socket);
    updateActualPrepTime(socket);
  });
});

/**
 * Helper function to normalize phone number formats for rendering
 * @param {string} phoneNumberString a string of numbers usually in '##########' format
 * @returns string with normalized phone number in format (###)###-####
 */

const formatPhoneNumber = (phoneNumberString) => {
  let cleaned = ("" + phoneNumberString).replace(/\D/g, "");
  let match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    let intlCode = match[1] ? "+1 " : "";
    return [intlCode, "(", match[2], ") ", match[3], "-", match[4]].join("");
  }
  return null;
};

const viewCurrentOrders = () => {
  $("#current").on("click", () => {
    loadOrders("open");
  });
};

const viewOrderHistory = () => {
  $("#history").on("click", () => {
    loadOrders("closed");
  });
};

/**
 * Creates the individual order cards to display in '/orders' (Order Summary Page)
 * First checks if the restaurant specified a custom ETA, and sets ETA either as custom or the default estimate.
 * Then gets the current ETA based on the amount of time that has elapsed since the order was placed
 * Then generates the HTML for the order card
 */

const createOrderElement = (order) => {
  const displayETA = (status) => {
    if (status === "closed") return "Order Picked Up";
    return order.actual === 0
      ? `ETA: ${getCurrentETA(order.time, order.estimated)}`
      : `ETA: ${convertToString(order.actual)}`;
  };

  const element = $(`
    <article>
    <div class="order-detail">
    <label>${order.id}</label>
    <div>Order Price: $${(order.price / 100).toFixed(2)}</div>
    <div>Customer Name: ${order.first_name}</div>
    <div>Customer Phone Number: ${formatPhoneNumber(order.phone)}</div>
    <div>
      <form class="update-actual">
      <input type="number" name="actual">
      <button id="submit-${order.id}" type="submit">Update ETA</button>
      </form>
      <button id='ready-${
        order.id
      }' class="ready-pickup">Ready for pickup</button>
    </div>
    </div>
    <div class="eta">${displayETA(order.status)}</div>
    </article>
    `);
  return element;
};

/**
 * Renders all of the order cards to '/orders' (Order Summary Page)
 * By default, filters to only show the 'open' orders which are not yet ready for pickup
 */

const renderOrders = (orders, status) => {
  const filteredOrders = orders.filter((order) => order.status === status);
  filteredOrders.forEach((order) => {
    const generatedOrder = createOrderElement(order);
    $("#orders-container").append(generatedOrder);
  });
};

/**
 * Loads all of the orders from the database
 * @param {string} status A string containing the order status to filter the orders by
 * Sorts the orders with most current ETA closest to top of page
 * Empties the current HTML before calling renderOrders function to display the new set of sorted orders
 */

const loadOrders = (status) => {
  $.get("/api/orders")
    .then((orders) => {
      let etas = orders.map((order) => [
        order.actual === 0 ? order.estimated : order.actual,
        order.id,
      ]);
      const sorted = etas.sort((a, b) => a[0] - b[0]);
      let sortedOrders = [];

      sorted.forEach((order) => {
        sortedOrders.push(orders.filter((obj) => obj.id === order[1])[0]);
      });

      $("#orders-container").empty();
      renderOrders(sortedOrders, status);
    })
    .catch((error) => {
      console.log(error);
    });
};

/**
 * Click handler for "Ready for Pickup" button on each of the order cards
 * Emits the order ID via web socket to update the customer reciept as "Ready for Pickup" (with no page refresh required)
 * Queries database to get data specifically for the order
 * Writes to db to set the order status to 'closed'
 * Sends SMS # 3 (order ready for pickup) to customer
 * Re-renders the order summary page
 */

const readyForPickup = (socket) => {
  $("#orders-container").on("click", ".ready-pickup", function () {
    let stringId = $(this).attr("id");
    let orderId = stringId.split("-")[1];
    socket.emit("orderid", orderId);
    $.get(`/api/orders/pickup/${orderId}`).then((data) => {
      $.post(`/api/orders/${orderId}`, data).then((response) => {});
      $.post("/api/sms/3", data).then((response) => {});
      loadOrders("open");
    });
  });
};

/**
 * Calculates the current ETA for an order (ie. time remaining until pickup) in hours/minutes
 * Converts from PSQL date format ('2022-09-27T16:35:20.746Z') to JS date format
 * @param {timestamp} sqlTimestamp The timestamp of when the order was placed
 * @param {integer} orderETA An integer representing order's total ETA (in minutes)
 * @returns {string} A string containing the hours/minutes remaining until order is ready for pickup
 */

// helper function
const convertToString = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const remainder = Math.round(minutes % 60, 0);
  if (hours === 0) return `${remainder} min`;
  if (hours === 1) return `${hours} hr, ${remainder} min`;
  return `${hours} hrs, ${remainder} min`;
};

const getCurrentETA = (sqlTimestamp, orderETA) => {
  const jsTimestamp = new Date(sqlTimestamp.replace(" ", "T"));

  const minutesSinceOrder = (Date.now() - jsTimestamp) / 1000 / 60;
  const currentETA =
    orderETA - minutesSinceOrder < 0 ? 0 : orderETA - minutesSinceOrder;

  return convertToString(currentETA);
};

/**
 * Updates the customer's receipt page with an updated ETA when restaurant manually changes the order ETA
 * Emits the updated ETA via web socket for display on the customer reciept (with no page refresh required)
 * Sends SMS # 2 (updated ETA notification) to customer
 * Re-renders the order summary page
 */

const updateActualPrepTime = (socket) => {
  $("#orders-container").on("submit", ".update-actual", function (event) {
    event.preventDefault();
    let stringId = $(this).nextAll("button").attr("id");
    let data = {
      orderId: stringId.split("-")[1],
      actual: $(this).find("input").val(),
    };
    socket.emit("new-est", data.actual);
    $.post(`/api/orders/actual/${data.orderId}`, data).then((response) => {
      $.get(`/api/orders/pickup/${data.orderId}`).then((smsData) => {
        $.post("/api/sms/2", smsData).then((response) => {});
        loadOrders("open");
      });
    });
  });
};
