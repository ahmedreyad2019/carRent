const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const CarOwner = require("../models/CarOwner.models");
const CarRenter = require("../models/CarRenter.models");
var config = require("../config/jwt");
var jwt = require("jsonwebtoken");
const Car = require("../models/Car.models");
const Transaction = require("../models/Transaction.models");
const Complaint = require("../models/Complaint.models");

//create
//Not needed (Do Not Use it)
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

//Not needed (Do Not Use it)
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
//Not needed (Do Not Use it)
router.get("/", async (req, res) => {
  const carOwners = await CarOwner.find();
  res.json({ data: carOwners });
});

//read specific
//Not needed (Do Not Use it)
router.get("/Me", async (req, res) => {
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


    const carOwners = await CarOwner.findById(stat);
    res.json({ data: carOwners });
  } catch (error) {
    console.log(error);
  }
});

//put
//Not needed (Do Not Use it)
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
//Not needed (Do Not Use it)
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
    const owner = await CarRenter.findById(stat);
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
    const owner = await CarRenter.findById(stat);
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

//test UserStory 9
router.get("/myCars",async (req,res)=>{
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
    const owner = await CarRenter.findById(stat);
    if (!owner) {
      return res.status(404).send({ error: "Owner does not exist" });
    }
    const cars = await Car.find({carOwnerID:stat});
    if (cars.length === 0) {
      return res.send({ msg: "You Don't have any cars" });
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
    const owner = await CarRenter.findById(stat);
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
    const owner = await CarRenter.findById(stat);
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
    await CarRenter.findByIdAndUpdate(stat,{carsOwned:owner.carsOwned})
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
    const owner = await CarRenter.findById(stat);
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
    const owner = await CarRenter.findById(stat);
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
    const owner = await CarRenter.findById(stat);
    if (!owner) {
      return res.status(404).send({ error: "Owner does not exist" });
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
    const owner = await CarRenter.findById(stat);
    if (!owner) {
      return res.status(404).send({ error: "Owner does not exist" });
    }
    const transaction = await Transaction.findById(req.params.id);
    if(transaction.carOwnerID!=stat){
      return res
      .status(401)
      .send({ auth: false, message: "Not your Car" });
    }
    if(transaction.carRenterID){
      return res
      .status(401)
      .send({ message: "You cannot remove a car that is already Rented" });
    }
  await Transaction.findByIdAndDelete(req.params._id);
  const otherTransaction=await Transaction.find({carID:transaction.carID})
  var upcoming=false;
  var rented=false;
  var UpForRent=false;
  for(var i=0;i<otherTransaction.length;i++){
    if(otherTransaction[i].status=="Upcoming"&&otherTransaction[i].carRenterID)
      upcoming=true;
    if(otherTransaction[i].status=="Upcoming"&&!otherTransaction[i].carRenterID)
      UpForRent=true;
      
    if(otherTransaction[i].status=="In process")
      rented=true;
  } 
  var state="idle"
  if(upcoming)
    state="Rented"
  if(rented){
    state="Rented"
  }
  if(UpForRent)
    state="UpForRent"


    car.status=state
    await Car.findByIdAndUpdate(req.params.id,car)
    res.json({ msg: "Your Car is unPublished", data: newTransaction });
  } catch (error) {
    res.status(400).send({ msg: error });
    console.log(error);
  }
});

router.get("/RenterDetails/:id", async (req, res) => {
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
    const owner = await CarRenter.findById(stat);
    if (!owner) {
      return res.status(404).send({ error: "Owner does not exist" });
    }
    const otherTransaction=await Transaction.find({carOwnerID:stat,carRenterID:req.params.id})
   if(otherTransaction.length==0){
    return res
    .status(401)
    .send({ auth: false, message: "You cannot view this renter." });
   }
    const carRenters = await CarRenter.findById(req.params.id);
    res.json({ data: carRenters });
  } catch (error) {
    console.log(error);
  }
});


router.get("/PastRents/:id",async(req,res)=>{

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
    const owner = await CarRenter.findById(stat);
    if (!owner) {
      return res.status(404).send({ error: "Owner does not exist" });
    }
    const car = await Car.findById(req.params.id);
    if(car.carOwnerID!=stat){
      return res
      .status(401)
      .send({ auth: false, message: "Not your Car" });
    }
    const transactions = await Transaction.find({status: "Done" ,carID:req.params.id});
    if (transactions.length === 0) {
      return res.send({ msg: "This Car has not been Rented Before" });
    }
    res.json({ msg: "The Past rents of this Car:", data: transactions });


  }catch(error){

  }

})

router.get("/PastRents",async(req,res)=>{
 
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
    const owner = await CarRenter.findById(stat);
    if (!owner) {
      return res.status(404).send({ error: "Owner does not exist" });
    }

    const transactions = await Transaction.find({status: "Done" ,carID:{$in:owner.carsOwned}});
    if (transactions.length === 0) {
      return res.send({ msg: "You do not own a Car that has been Rented" });
    }
    res.json({ msg: "The Past rents of your Cars:", data: transactions });
  }catch(error){
    console.log(error)
  }

})

router.post("/view/pastRentals/:id/fileComplaint", async (req, res) => {
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
  const owner = await CarRenter.findById(stat);
  if (!owner) {
    return res.status(404).send({ error: "Owner does not exist" });
  }
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      carOwnerID: stat,
      status: "Done"
    });
    if (!transaction)
      return res.status(404).send({ msg: "transaction not found" });

    const complaint = await Complaint.create({
      issuedFrom: "Owner",
      comment: req.body.comment,
      transactionID: req.params.id,
      issuedAgainst:req.body.issuedAgainst
    });

    return res
      .status(200)
      .send({ msg: "complaint successfully filed:", data: complaint });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ msg: "error", error: error });
  }
});

router.post("/RateRenter/:id", async (req, res) => {
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
  const owner = await CarRenter.findById(stat);
  if (!owner) {
    return res.status(404).send({ error: "Owner does not exist" });
  }
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      carOwnerID: stat,
      status: "Done"
    });
    if (!transaction)
      return res.status(404).send({ msg: "transaction not found" });
    if(!req.body.rating||req.body.rating<0||req.body.rating>5){
      return res
      .status(401)
      .send({ error:true, message: "Please Enter A valid Rating" });
  
    }
    transaction.renterRating=req.body.rating
    await Transaction.findByIdAndUpdate(transaction._id,{renterRating:req.body.rating})
    return res
      .status(200)
      .send({ msg: "Your Rating has been Submitted:", data: transaction });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ msg: "error", error: error });
  }
});


module.exports = router;
