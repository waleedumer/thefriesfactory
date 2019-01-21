const express = require('express');
const app = express();
const businessRoutes = express.Router({ automatic405: true });

// Require Business model in our routes module
let Business = require('../models/Orders');
let DailySales = require('../models/DailySales');

  
// Defined store route
businessRoutes.route('/add',{ automatic405: true }).post(function (req, res) {
    console.log(req.body);
  let business = new DailySales(req.body);
  business.save()
    .then(business => {
      res.status(200).json({'business': 'business in added successfully'});
    })
    .catch(err => {
    res.status(400).send("unable to save to database");
    });
});

// Defined get data(index or listing) route
businessRoutes.route('/').get(function (req, res) {
  //{order_date: req.query.orderDate},
    Business.find(function (err, businesses){
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
  //{order_date: req.query.orderDate},
  
  DailySales.find(function (err, businesses){
    if(err){
      console.log(err);
    }
    else {
      res.json(businesses);
      
      console.log(businesses);
      let business = new Business(businesses);
      business.save()
      .then(business => {
        res.status(200).json({'business': 'business in added successfully'});
        DailySales.remove();
      })
      .catch(err => {
      res.status(400).send("unable to save to database");
      });
      console.log(businesses);
    }
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
