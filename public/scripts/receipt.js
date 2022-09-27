// $(() => {

// });

// // const orderArr =

// const createReceiptItem = (obj) => {
//   const element = $(`
//   <article>
//         <div class="item-count">${obj.qty}</div>
//         <div class="dish-detail">
//           <label>${obj.name}</label>
//         </div>
//         <div>${obj.price}</div>
//       </article>
//   `);
//   return element;
// };

// const renderReceipt = (obj) => {
//   const generatedReceipt = createReceiptItem(obj);
//   $("#receipt-container").append(generatedReceipt);
// };

// const loadReceipt = (orderId) => {
//   $.get(`/api/receipt/${orderId}`)
//     .then((data) => {
//       $("#receipt-container").empty();
//       renderReceipt(data);
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// };
