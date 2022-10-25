/*
File name: products.js
Author: Sunehildeep
Student ID: 301210976
Web App Name: COMP229- F2022-301210976
*/
// modules required for routing
let express = require("express");
let router = express.Router();
let mongoose = require("mongoose");

// define the product model
let product = require("../models/products");

/* GET products List page. READ */
router.get("/", (req, res, next) => {
  // find all products in the products collection
  product.find((err, products) => {
    if (err) {
      return console.error(err);
    } else {
      res.render("products/index", {
        title: "Products",
        products: products,
      });
    }
  }).sort({Productid: 1});
});

//  GET the Product Details page in order to add a new Product
router.get("/add", (req, res, next) => {
  res.render("products/add.ejs", {
    title: "Add Product",
  });
});

// POST process the Product Details page and create a new Product - CREATE
router.post("/add", (req, res, next) => {
  // Create product using the request
  product.create(product({Productid: req.body.Productid, Productname: req.body.Productname, Description: req.body.description, Price: req.body.Price,}), (err, product) => {
    if (err) {
      console.log(err);
      res.end(err);
    } else {
      //Refresh Products List
      res.redirect("/products");
    }
  });
});

// GET the Product Details page in order to edit an existing Product
router.get("/:id", (req, res, next) => {
  let id = req.params.id;

  // find the product using the ID
  product.findById(id, (err, productToEdit) => {
    if (err) {
      console.log(err);
      res.end(err);
    } else {
      //Show the details View
      res.render("products/details.ejs", {
        title: "Edit Product",
        products: productToEdit,
      });
    }
  });
});

// POST - process the information passed from the details form and update the document
router.post("/:id", (req, res, next) => {
  // getting the id from parameter
  let id = req.params.id;

  // initialize the product to get the new details from request
  let updatedProduct = product({
    _id: id,
    Productname: req.body.Productname,
    Productdescription: req.body.description,
    Price: req.body.price,
  });

  // update it in mongo
  product.updateOne({ _id: id }, updatedProduct, (err) => {
    if (err) {
      console.log(err);
      res.end(err);
    } else {
      //Refresh the Products List
      res.redirect("/products");
    }
  });
});

// GET - process the delete using the range provided by deleteRange function
router.get("/delete/:range", (req, res, next) => {
  // Getting the range
  let range = req.params.range;

  // splitting it into mix and max
  let rangeSplit = range.split('-');

  // using greater than and less than operator
  product.deleteMany({ Price: {$gte: rangeSplit[0], $lte: rangeSplit[1]} }, (err) => {
    if (err) {
      console.log(err);
      res.end(err);
    } else {
      //Refresh the Products List
      res.redirect("/products");
    }
  });
});

module.exports = router;
