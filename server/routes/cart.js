//--------------------------------------------
//Title: cart.js
//Author: Kyle Hochdoerfer
//Date: 04/10/24
//Description: Cart routing for webdevgrill
//---------------------------------------------

//Enable strict mode
"use strict";

//Require statements
const express = require('express');
const router =  express.Router();
const { mongo } = require('../utils/mongo');
const Ajv = require('ajv');

//Create a variable for ajv validation
const ajv = new Ajv()

//deleteCartItem API
router.delete("/:userId/:dishName", (req, res, next) => {
  try{
    //Get the user Id and dish name from the req.params and parse empId as an int
    let { userId, dishName } = req.params
    const userIdInt = parseInt(userId, 10)

    //If the received user Id is not a number, cause an error saying so
    if(isNaN(userIdInt)){
      const err = new Error("Input must be a number");
      err.status = 400;
      console.error("err", err);
      next(err)
      return
    }

    //Query the database for a user with the matching id number
    mongo(async db => {
      const user = await db.collection('users').findOne({ userId });

      //If no matching user is found, cause an error saying that the user could not be found
      if (!user){
        const err = new Error('Unable to find user with empId ' + empId)
        err.status = 404;
        console.error("err", err);
        next(err)
        return
      }

      let newTotal = 0;

      //Filter the user's cart to remove the dish with the name passed in from the request
      const newCart = user.cart.filter((item) => item.name != dishName);

      //Update the total
      for(let item of newCart){
        newTotal = newTotal + (item.price * item.quantity)
      }

      //Update the user document, replacing the original cart with the filtered version
      const result = await db.collection('users').updateOne(
        { userId },
        { $set: {cart: newCart, total: newTotal}}
      )

      //If the result variable was not successfully modified, cause an error stating that no cart item was deleted
      if(!result.modifiedCount){
        const err = new Error('Unable to update cart for userId ' + userId)
        err.status = 500;
        console.error('err', err);
        next(err);
        return;
      }

      //Send a successful 204 response
      res.status(204).send();
    }, next)
  } catch (err) {
    //If an error occurs, send it to the console and the error handler
    console.error('err', err)
    next(err);
  }
})

//API for changing cart quantity
router.put("/:userId/:dishName/:operation", (req, res, next) => {
  try{
    //Get the user Id and dish name from the req.params and parse empId as an int
    let { userId, dishName, operation } = req.params;
    const userIdInt = parseInt(userId, 10);

    //If the received user Id is not a number, cause an error saying so
    if(isNaN(userIdInt)){
      const err = new Error("Input must be a number");
       err.status = 400;
      console.error("err", err);
      next(err)
      return
    }

    //Query the database for a user with the matching id number
    mongo(async db => {
      const user = await db.collection('users').findOne({ userId });

      //If no matching user is found, cause an error saying that the user could not be found
      if (!user){
        const err = new Error('Unable to find user with empId ' + empId)
        err.status = 404;
        console.error("err", err);
        next(err)
        return
      }

      //Initialize the new cart variable with the user's cart
      let newCart = user.cart;

      //Determine if the quantity is being incremented or decremented
      if(operation == "plus"){
        //If the quantity value is plus, add one to item quantity
        newCart.find((item) => item.name == dishName).quantity++;
      } else if (operation == "minus") {
        //If the quantity value is minus, subtract one from item quantity
        newCart.find((item) => item.name == dishName).quantity--;
      } else {
        //Error handling
        const err = new Error('Error: unrecognized operation detected')
        err.status = 405;
        console.error("err", err);
        next(err)
        return
      }

      //Declare a variable for holding the new total
      let newTotal = 0;

      //Calculate the new total of the cart
      newCart.forEach(function (item){
        newTotal = newTotal + parseFloat(item.price) * item.quantity;
      })

      //Update the user document, replacing the original cart with the updated version
      const result = await db.collection('users').updateOne(
        { userId },
        { $set: {cart: newCart, total: newTotal}}
      )

      //If the result variable was not successfully modified, cause an error stating that cart quantity was not modified
      if(!result.modifiedCount){
        const err = new Error('Unable to update cart for userId ' + userId)
        err.status = 500;
        console.error('err', err);
        next(err);
        return;
      }

      //Send a successful 204 response
      res.status(204).send();
    }, next)
  } catch (err) {
    //If an error occurs, send it to the console and the error handler
    console.error('err', err)
    next(err);
  }
})

const orderSchema = {
  type: 'object',
  properties: {
    userId: { type: 'string' },
    items: { type: 'array' }
  },
  required: [
    'userId',
    'items'
  ],
  additionalProperties: false
}

//submit order API
router.post('/:userId', (req, res, next) => {
  try {
    //Store the cart object from the request body, and covert it to an object
    let items = req.body;

  //   //Create an empty array for storing items
  //   let itemArray = [];

  //   //Create an empty item object to store data for each item that will go on the array
  //   let item = {};

  //   //Loop through the items and create an array containing items
  //   items.orders.forEach((element, index, array) => {
  //     item = {name: element.name, price: element.price, quantity: element.quantity, imageSource: element.imageSource};
  //     itemArray.push(item);
  // });

    //Store userId from request params
    let { userId } = req.params

    //Create an order object
    let order = {userId: userId, items: items.orders};

    //determine if the order data matches the required schema
    const validate = ajv.compile(orderSchema);
    const isValid = validate(order);

    //if provided invoice data doesn't match the required invoiceSchema
    if (!isValid) {
      //400 message
      res.status(400).json({
        message: 'Bad Request',
        errors: validate.errors,
      });
      return;
    }

    //connect to database
    mongo(async (db) => {
      //Insert the order into the database
      const result = await db.collection('orders').insertOne(order);

      //Empty the user's cart in the database
      const deleteAll = await db.collection('users').updateOne(
        { userId },
        { $set: {cart: [], total: 0}}
      )

      //displays 201 message if invoice is created successfully
      res.status(201).json({
        message: 'Order created successfully',
      });
    }, next);
    //catch any other error
  } catch (err) {
    console.log('err', err);
    next(err);
  }
});

module.exports = router;