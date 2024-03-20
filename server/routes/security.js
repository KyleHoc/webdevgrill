//--------------------------------------------
//Title: security.js
//Author: Kyle Hochdoerfer
//Date: 03/19/24
//Description: Menu routing for webdevgrill
//---------------------------------------------

//Enable strict mode
"use strict";

//Require statements
const express = require('express');
const router =  express.Router();
const { mongo } = require('../utils/mongo');
const { ObjectId } = require('mongodb');
const Ajv = require('ajv')

//Create a variable for ajv validation
const ajv = new Ajv()

//Require bcrypt and set a saltRounds variable for salting passwords
const bcrypt = require('bcryptjs');
const saltRounds = 10

//Schema for singin user input
const signinSchema = {
  type: 'object',
  properties:{
    email: { type: 'string'},
    password: { type: 'string'}
  },
  required: ["email", "password"],
  additionalProperties: false
}

//Declare a registerSchema containing all user properties
const registerSchema = {
  type: 'object',
  properties: {
    userId: { type: 'string'},
    email: { type: 'string'} ,
    password: { type: 'string'},
    firstName: { type: 'string'},
    lastName: { type: 'string'},
  },
  required: [
    'email',
    'password',
    'firstName',
    'lastName',
    'userId'
  ],
  additionalProperties: false
}

//signin API
router.post('/signin', async(req, res) =>{
  try {
    //Get the signin data from the request
    let signinData = req.body;

    //Determine if the signinData matches the required schema
    const validator = ajv.compile(signinSchema);
    const isValid = validator(signinData);

    //If the provided signinData does not fit the required schema, trigger a 400 Bad Request error
    if(!isValid){
      const err = new Error("Bad Request")
      err.status = 400;
      err.errors = validator.errors;
      console.error("err", err)
      next(err)
      return
    }

    //Connect to the database and find a user with an email matching the user input
    mongo(async db => {
      let user = await db.collection("users").findOne({email: signinData.email});
      console.log(user)

      //If a valid email was found
      if (user) {
        //Determine if the request body password is valid and save the boolean result
        let passwordIsValid = bcrypt.compareSync(signinData.password, user.password);

        //If the password is valid
        if (passwordIsValid) {
          // Set time of last login

          //Output a message stating that the user has logged in and send it as a response
          console.log('User logged in');
          res.send(user);
          return;
        } else {
            //If the password is invalid, output an error message and send it as a response
            console.log('Invalid email and/or password');
            res.status(404).send({
                'message': `Valid email and/or password not found`
            })
        }
    } else {
        //If the username is invalid, output an error message and send it as a response
        console.log('Invalid email and/or password');
        res.status(404).send({
            'message': `Valid email and/or password not found`
        })
    }
    })

  } catch (err) {
      //If the server encounters an error, output the message and send it as a response
      console.log(err);
      res.status(500).send({
          'message': `Server Exception: ${err}`
      })
  }
})

// registerUser API
router.post('/register', (req, res, next) => {
  try {
    //grab input from user
    const { user } = req.body;

    // set data validation based on registerSchema
    const validator  = ajv.compile(registerSchema);
    // Validate user input against registerSchema
    const isValid = validator(user);

    // If user input does not pass validation, return 400 Error
    if(!isValid){
      const err = new Error("Bad Request")
      err.status = 400;
      err.errors = validator.errors;
      console.error("err", err)
      next(err)
      return
    }
    // Set password encryption
    const hashedPassword = bcrypt.hashSync(user.password, saltRounds);

   //Access database
   mongo(async db => {
    // Search for all users in database and sort them in ascending order in an array
    const users = await db.collection('users').find().sort({userId: 1}).toArray();
    console.log('Current users:', users);

    // if email is already in use, return 400 error
    let emailInUse = users.find(employees => employees.email === user.email)
    if (emailInUse) {
      const err = new Error("Bad Request")
      err.status = 400;
      err.message = 'Email is already in use';
      console.error("err", err)
      next(err)
      return
     }

     // Get the user with last empId based on ascending order
     const latestuser = users[users.length - 1];

     // Set the newempId as the latest empId plus 1.
     const newEmpId = latestuser.userId + 1;

     // Create newUser to be added to database
     const newUser = {
      userId: newEmpId,
      email: user.email,
      password: hashedPassword,
      firstName: user.firstName,
      lastName: user.lastName,
     }

     //Output new user object
     console.log(newUser);

     // push newUser object to the users collection
     const result = await db.collection('users').insertOne(newUser);

     //returns _id to the console
     console.log("result", result._id);

     // send the inserted _id
     res.status(201).send({ id: result.insertedId });
   }, next);

  } catch (err) {
    console.error("Error:", err);
    next(err);
  }
})

module.exports = router;