const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Business
let Items = new Schema({
  itemId: {
    type: String
  },
  name: {
    type: String
  },
  sale_price: {
    type: String
  },
  purchase_price: {
    type: String
  }
},{
    collection: 'items'
});

module.exports = mongoose.model('Items', Items);
