const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const CarOwner = require("../models/CarOwner.models");
var config = require("../config/jwt");
var jwt = require("jsonwebtoken");
const Car = require("../models/Car.models");
const Transaction = require("../models/Transaction.models");

//create
router.post("/", async (req, res) => {
  try {
    // const isValidated = validator.createCarValidation(req.body);
    // if (isValidated.error)
    //   return res
    //     .status(400)
    //     .send({ error: isValidated.error.details[0].message });
    const owner=await CarOwner.findOne({mobileNumber:req.body.mobileNumber})
    if(owner)
     return res.status(400).json({ error: "Phone already exists" });
     req.body.dateAdded = Date.now();
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);
    req.body.password=hashedPassword;
    const newCarOwner = await CarOwner.create(req.body);
    res.json({ msg: "Car Owner was added successfully", data: newCarOwner });
  } catch (error) {
    res.status(400).send({ msg: error });
    console.log(error);
  }
});


router.post("/login", function(req, res) {
  CarOwner.findOne({ mobileNumber: req.body.mobileNumber }, function(err, user) {
    if (!user) {
      return res.status(401).send({ auth: false, message: "No user found." });
    }
    const loginPassword = req.body.password;
    if(!loginPassword){
      return res
      .status(401)
      .send({ auth: false, message: 'Please enter password.'})
    }
    const userPassword = user.password;
    const match = bcrypt.compareSync(loginPassword, userPassword);
    if (!match) return res.status(401).send({ auth: false, token: null });
    var token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 86400 // expires in 24 hours
    });
    res.status(200).send({ auth: true, token: token, id: user._id });
  })
  })

//read
router.get("/", async (req, res) => {
  const carOwners = await CarOwner.find();
  res.json({ data: carOwners });
});

//read specific
router.get("/Me/:id", async (req, res) => {
  try {
    const carOwners = await CarOwner.findById(req.params.id);
    res.json({ data: carOwners });
  } catch (error) {
    console.log(error);
  }
});

//put
router.put("/:id", async (req, res) => {
  try {
    var stat = 0;
    var token = req.headers["x-access-token"];
    if (!token) {
      return res
        .status(401)
        .send({ auth: false, message: "Please login first." });
    }
    jwt.verify(token, config.secret, async function(err, decoded) {
      if (err) {
        return res
          .status(500)
          .send({ auth: false, message: "Failed to authenticate token." });
      }
      stat = decoded.id;
    });
    const owner = await CarOwner.findById(stat);
    if (!owner) {
      return res.status(404).send({ error: "Owner does not exist" });
    }
    if(stat!=req.params.id)
    return res.status(401).send({ error: "You can change other Owners" });
    const carOwner = await CarOwner.findOne({}, { _id: req.params.id });
    if (!carOwner) return res.status(404).send({ error: "Owner does not exist" });
    // const isValidated = validator.updateValidations(req.body);
    // if (isValidated.error)
    //   return res
    //     .status(400)
    //     .send({ error: isValidated.error.details[0].message });
await CarOwner.findByIdAndUpdate(req.params.id, req.body);
    res.json({ msg: "Car Owner updated successfully"});
  } catch (error) {
    // We will be handling the error later
    console.log(error);
  }
});

//delete
//Should be removed
router.delete("/:id", async (req, res) => {
  try {
    await CarOwner.findByIdAndRemove(req.params.id);
    res.json({ msg: "Car Owner was deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).send({ msg: error });
  }
});

//test UserStory 8
router.get("/idleCars",async (req,res)=>{
  try{
    var stat = 0;
    var token = req.headers["x-access-token"];
    if (!token) {
      return res
        .status(401)
        .send({ auth: false, message: "Please login first." });
    }
    jwt.verify(token, config.secret, async function(err, decoded) {
      if (err) {
        return res
          .status(500)
          .send({ auth: false, message: "Failed to authenticate token." });
      }
      stat = decoded.id;
    });
    const owner = await CarOwner.findById(stat);
    if (!owner) {
      return res.status(404).send({ error: "Owner does not exist" });
    }
    const cars = await Car.find({ status: "Idle" ,carOwnerID:stat});
    if (cars.length === 0) {
      return res.send({ msg: "You Don't have any Idle cars" });
    }
    res.json({ msg: "Your available Cars:", data: cars });

  }catch(error){
    console.log(error);
    res.status(400).send({ msg: error });
  }
})


//test UserStory 9
router.get("/pending",async (req,res)=>{
  try{
    var stat = 0;
    var token = req.headers["x-access-token"];
    if (!token) {
      return res
        .status(401)
        .send({ auth: false, message: "Please login first." });
    }
    jwt.verify(token, config.secret, async function(err, decoded) {
      if (err) {
        return res
          .status(500)
          .send({ auth: false, message: "Failed to authenticate token." });
      }
      stat = decoded.id;
    });
    const owner = await CarOwner.findById(stat);
    if (!owner) {
      return res.status(404).send({ error: "Owner does not exist" });
    }
    const cars = await Car.find({"$or":[ { status: "PendingApproval" ,carOwnerID:stat},{ status: "Rejected" ,carOwnerID:stat}]});
    if (cars.length === 0) {
      return res.send({ msg: "You Don't have any cars that are still in the process" });
    }
    res.json({ msg: "Your available Cars:", data: cars });

  }catch(error){
    console.log(error);
    res.status(400).send({ msg: error });
  }
})

router.get("/MyCar/:id", async (req, res) => {
  try {
    var stat = 0;
    var token = req.headers["x-access-token"];
    if (!token) {
      return res
        .status(401)
        .send({ auth: false, message: "Please login first." });
    }
    jwt.verify(token, config.secret, async function(err, decoded) {
      if (err) {
        return res
          .status(500)
          .send({ auth: false, message: "Failed to authenticate token." });
      }
      stat = decoded.id;
    });
    const owner = await CarOwner.findById(stat);
    if (!owner) {
      return res.status(404).send({ error: "Owner does not exist" });
    }
    
    const cars = await Car.findById(req.params.id);
    if(cars.carOwnerID!=stat){
      return res
      .status(401)
      .send({ auth: false, message: "Not your Car" });
    }
    res.json({ data: cars });
  } catch (error) {
    console.log(error);
  }
});

router.delete("/MyCar/:id", async (req, res) => {
  try {
    var stat = 0;
    var token = req.headers["x-access-token"];
    if (!token) {
      return res
        .status(401)
        .send({ auth: false, message: "Please login first." });
    }
    jwt.verify(token, config.secret, async function(err, decoded) {
      if (err) {
        return res
          .status(500)
          .send({ auth: false, message: "Failed to authenticate token." });
      }
      stat = decoded.id;
    });
    const owner = await CarOwner.findById(stat);
    if (!owner) {
      return res.status(404).send({ error: "Owner does not exist" });
    }
    const car = await Car.findById(req.params.id);
    if(car.carOwnerID!=stat){
      return res
      .status(401)
      .send({ auth: false, message: "Not your Car" });
    }
    if(car.status==="Rented"){
      return res
      .status(401)
      .send({ auth: false, message: "You Cannot remove a rented Car" });
    }
    await Car.findByIdAndRemove(req.params.id);
    var index = owner.carsOwned.indexOf(car._id);
    owner.carsOwned.splice(index,1)
    await CarOwner.findByIdAndUpdate(stat,{carsOwned:owner.carsOwned})
    res.json({ msg: "Car was deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).send({ msg: error });
  }
});


router.post("/RentMyCar/:id", async (req, res) => {
  try {
    var stat = 0;
    var token = req.headers["x-access-token"];
    if (!token) {
      return res
        .status(401)
        .send({ auth: false, message: "Please login first." });
    }
    jwt.verify(token, config.secret, async function(err, decoded) {
      if (err) {
        return res
          .status(500)
          .send({ auth: false, message: "Failed to authenticate token." });
      }
      stat = decoded.id;
    });
    const owner = await CarOwner.findById(stat);
    if (!owner) {
      return res.status(404).send({ error: "Owner does not exist" });
    }
    const car = await Car.findById(req.params.id);
    if(car.carOwnerID!=stat){
      return res
      .status(401)
      .send({ auth: false, message: "Not your Car" });
    }
    if(car.status!="Idle"){
      return res
      .status(401)
      .send({ message: "This Car Cannot be up for Rent" });
    }
    req.body.carOwnerID=stat
    req.body.carID=req.params.id
    req.body.dateAdded = Date.now();
    const newTransaction = await Transaction.create(req.body);
    car.status="UpForRent"
    await Car.findByIdAndUpdate(req.params.id,car)
    res.json({ msg: "Your Car is up for Rent", data: newTransaction });
  } catch (error) {
    res.status(400).send({ msg: error });
    console.log(error);
  }
});

router.get("/UpcomingRents/:id",async(req,res)=>{

  try {
    var stat = 0;
    var token = req.headers["x-access-token"];
    if (!token) {
      return res
        .status(401)
        .send({ auth: false, message: "Please login first." });
    }
    jwt.verify(token, config.secret, async function(err, decoded) {
      if (err) {
        return res
          .status(500)
          .send({ auth: false, message: "Failed to authenticate token." });
      }
      stat = decoded.id;
    });
    const owner = await CarOwner.findById(stat);
    if (!owner) {
      return res.status(404).send({ error: "Owner does not exist" });
    }
    const car = await Car.findById(req.params.id);
    if(car.carOwnerID!=stat){
      return res
      .status(401)
      .send({ auth: false, message: "Not your Car" });
    }
    const transactions = await Transaction.find({status: "Upcoming" ,carID:req.params.id});
    if (transactions.length === 0) {
      return res.send({ msg: "This Car has not been Rented" });
    }
    res.json({ msg: "The Upcoming rents of this Car:", data: transactions });


  }catch(error){

  }

})

router.get("/UpcomingRents",async(req,res)=>{

  try {
    var stat = 0;
    var token = req.headers["x-access-token"];
    if (!token) {
      return res
        .status(401)
        .send({ auth: false, message: "Please login first." });
    }
    jwt.verify(token, config.secret, async function(err, decoded) {
      if (err) {
        return res
          .status(500)
          .send({ auth: false, message: "Failed to authenticate token." });
      }
      stat = decoded.id;
    });
    const owner = await CarOwner.findById(stat);
    if (!owner) {
      return res.status(404).send({ error: "Owner does not exist" });
    }
    const car = await Car.findById(req.params.id);
    if(car.carOwnerID!=stat){
      return res
      .status(401)
      .send({ auth: false, message: "Not your Car" });
    }
    const transactions = await Transaction.find({status: "Upcoming" ,carID:{$in:owner.carsOwned}});
    if (transactions.length === 0) {
      return res.send({ msg: "You don't have any rented cars" });
    }
    res.json({ msg: "The Upcoming rents of your Cars:", data: transactions });


  }catch(error){

  }

})

router.post("/UnPublishMyCar/:id", async (req, res) => {
  try {
    var stat = 0;
    var token = req.headers["x-access-token"];
    if (!token) {
      return res
        .status(401)
        .send({ auth: false, message: "Please login first." });
    }
    jwt.verify(token, config.secret, async function(err, decoded) {
      if (err) {
        return res
          .status(500)
          .send({ auth: false, message: "Failed to authenticate token." });
      }
      stat = decoded.id;
    });
    const owner = await CarOwner.findById(stat);
    if (!owner) {
      return res.status(404).send({ error: "Owner does not exist" });
    }
    const car = await Car.findById(req.params.id);
    if(car.carOwnerID!=stat){
      return res
      .status(401)
      .send({ auth: false, message: "Not your Car" });
    }
    if(car.status!="UpForRent"){
      return res
      .status(401)
      .send({ message: "This Car is not Up For Rent" });
    }
    req.body.carOwnerID=stat
    req.body.carID=req.params.id
    req.body.dateAdded = Date.now();
    const newTransaction = await Transaction.create(req.body);
    car.status="Idle"
    await Car.findByIdAndUpdate(req.params.id,car)
    res.json({ msg: "Your Car is unPublished", data: newTransaction });
  } catch (error) {
    res.status(400).send({ msg: error });
    console.log(error);
  }
});
module.exports = router;
