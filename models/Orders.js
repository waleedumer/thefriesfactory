const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Business
let Orders = new Schema({
  amount: {
    type: String
  },
  order_date: {
    type: String
  },
  order_time: {
    type: String
  },
  orderId: {
    type: Number
  },
  deliveryBy: {
    type: String
  },
  items:{
    type: Array
  }
},{
    collection: 'orders'
});

module.exports = mongoose.model('Orders', Orders);
