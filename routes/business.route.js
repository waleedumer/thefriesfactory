const express = require('express');
const app = express();
const businessRoutes = express.Router({ automatic405: true });

// Require Business model in our routes module
let Business = require('../models/Orders');
let DailySales = require('../models/DailySales');
let Items = require('../models/Items');

  
// Defined store route
businessRoutes.route('/add',{ automatic405: true }).post(function (req, res) {
    console.log(req.body);
  let business = new DailySales(req.body);
  let orders = new Business(req.body);
  business.save()
    .then(business => {
      res.status(200).json({'business': 'business in added successfully'});
      orders.save()
    })
    .catch(err => {
    res.status(400).send("unable to save to database");
    });
});

// Defined get data(index or listing) route
businessRoutes.route('/').get(function (req, res) {
  //{order_date: req.query.orderDate},
    Business.find({order_date: req.query.orderDate}).sort({order_date: -1,order_time: -1}).exec(function (err, businesses){
    if(err){
      console.log(err);
    }
    else {
      res.json(businesses);
    }
  });
});

businessRoutes.route('/dailySale').get(function (req, res) {
  //{order_date: req.query.orderDate},
    DailySales.find().sort({order_date: -1}).exec(function (err, businesses){
    if(err){
      console.log(err);
    }
    else {
      res.json(businesses);
    }
  });
});

businessRoutes.route('/items').get(function (req, res) {
  //{order_date: req.query.orderDate},
    Items.find(function (err, businesses){
    if(err){
      console.log(err);
    }
    else {
      res.json(businesses);
    }
  });
});

//Get Data from date range
businessRoutes.route('/customDate').get(function (req, res) {
  //{order_date: req.query.orderDate},
    Business.find({order_date: {$gte: req.query.dateFrom,$lte: req.query.dateTo}},function (err, businesses){
    if(err){
      console.log(err);
    }
    else {
      res.json(businesses);
    }
  });
});

//End today's Sale
businessRoutes.route('/endSale').get(function (req, res) {
  DailySales.find(function(err, sales){
    if(err){
      console.log(err)
    }
    else{
      res.json(sales)
    }
  })
});

businessRoutes.route('/vanishSale').get(function (req, res) {
  //{order_date: req.query.orderDate},
  let business = new DailySales();
  business.collection.drop().then(business => {
      res.status(200).json('Sale is Ended.');
//       orders.save()
    })
    .catch(err => {
    res.status(400).send("unable to save to database");
    });   
});

businessRoutes.route('/deleteOrder').get(function (req, res) {
  //{order_date: req.query.orderDate},
  Business.findByIdAndRemove({ _id: req.query.orderId }, function (err, business) {
      if (err) return handleError(err);
      else res.json('Successfully removed');
      // deleted at most one tank document
    });
  
  
    
});

businessRoutes.route('/getOrderById').get(function (req, res) {
  //{order_date: req.query.orderDate},
  Business.findById({ _id: req.query.orderId }, function (err, business) {
      if (err) return handleError(err);
      else res.json(business);
      // deleted at most one tank document
    });
  
  
    
});


// Defined edit route


//  Defined update route
businessRoutes.route('/update/:id').post(function (req, res) {
    Business.findById(req.params.id, function(err, next, business) {
    if (!business)
      return next(new Error('Could not load Document'));
    else {
        business.person_name = req.body.person_name;
        business.business_name = req.body.business_name;
        business.business_gst_number = req.body.business_gst_number;

        business.save().then(business => {
          res.json('Update complete');
      })
      .catch(err => {
            res.status(400).send("unable to update the database");
      });
    }
  });
});

// Defined delete | remove | destroy route
businessRoutes.route('/delete/:id').get(function (req, res) {
    Business.findByIdAndRemove({_id: req.params.id}, function(err, business){
        if(err) res.json(err);
        else res.json('Successfully removed');
    });
});

module.exports = businessRoutes;
