const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const CarRenter = require("../models/CarRenter.models");
const Car = require("../models/Car.models");
const CarOwner = require("../models/CarOwner.models");
const Transaction = require("../models/Transaction.models");
const Complaint = require("../models/Complaint.models");
var config = require("../config/jwt");
var jwt = require("jsonwebtoken");
var Db = require("mongodb").Db;
//create
router.post("/", async (req, res) => {
  try {
    // const isValidated = validator.createCarValidation(req.body);
    // if (isValidated.error)
    //   return res
    //     .status(400)
    //     .send({ error: isValidated.error.details[0].message });
    const renter = await CarRenter.findOne({
      mobileNumber: req.body.mobileNumber
    });
    if (renter) return res.status(400).json({ error: "Phone already exists" });
    req.body.dateAdded = Date.now();
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);
    req.body.password = hashedPassword;
    const newCarRenter = await CarRenter.create(req.body);
    res.json({ msg: "Renter was added successfully", data: newCarRenter });
  } catch (error) {
    res.status(400).send({ msg: error });
    console.log(error);
  }
});

router.post("/login", function(req, res) {
  CarRenter.findOne({ mobileNumber: req.body.mobileNumber }, function(
    err,
    user
  ) {
    if (!user) {
      return res.status(401).send({ auth: false, message: "No user found." });
    }
    const loginPassword = req.body.password;
    if (!loginPassword) {
      return res
        .status(401)
        .send({ auth: false, message: "Please enter password." });
    }
    const userPassword = user.password;
    const match = bcrypt.compareSync(loginPassword, userPassword);
    if (!match) return res.status(401).send({ auth: false, token: null });
    var token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 86400 // expires in 24 hours
    });
    res.status(200).send({ auth: true, token: token, id: user._id });
  });
});

//read
router.get("/", async (req, res) => {
  const carRenters = await CarRenter.find();
  res.json({ data: carRenters });
});

//read specific
router.get("/:id", async (req, res) => {
  try {
    const carRenters = await CarRenter.findById(req.params.id);
    res.json({ data: carRenters });
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
    const renter = await CarRenter.findById(stat);
    if (!renter) {
      return res.status(404).send({ error: "Renter does not exist" });
    }
    if (stat != req.params.id)
      return res.status(401).send({ error: "You can change other Renters" });
    const carRenter = await CarRenter.findOne({}, { _id: req.params.id });
    if (!carRenter)
      return res.status(404).send({ error: "Renter does not exist" });
    // const isValidated = validator.updateValidations(req.body);
    // if (isValidated.error)
    //   return res
    //     .status(400)
    //     .send({ error: isValidated.error.details[0].message });
    await CarRenter.findByIdAndUpdate(req.params.id, req.body);
    res.json({ msg: "Renter updated successfully" });
  } catch (error) {
    // We will be handling the error later
    console.log(error);
  }
});

//delete
router.delete("/:id", async (req, res) => {
  try {
    await CarRenter.findByIdAndRemove(req.params.id);
    res.json({ msg: "Renter was deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).send({ msg: error });
  }
});

//26
router.post("/view/availableCars", async (req, res) => {
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
    const renter = await CarRenter.findById(stat);
    if (!renter) {
      return res.status(404).send({ error: "Renter does not exist" });
    }
  
    const cars = await Transaction.aggregate([
      {
        $lookup: {
          from: "cars",
          let: {
            car: "$carID",
            rentStart: "$rentingDateStart",
            rentEnd: "$rentingDateEnd",
            stat: "$status",
            c: "$cars"
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$$stat", "Upcoming"] },
                    { $eq: ["$_id", "$$car"] },
                    { $lte: ["$$rentStart", new Date(req.body.rentingDateStart)] },
                    { $gte: ["$$rentEnd", new Date(req.body.rentingDateEnd)] },
                  ]
                }
              }
            }
          ],
          as: "cars"
        }
      },
      {
        $match: { cars: { $ne: [] } }
      }
    ]);
    carsSorted = cars.sort((a, b) => {
      return b.rating - a.rating;
    });
    res.status(200).send({ msg: "cars", data: cars });
  } catch (error) {
    console.log(error);
    res.status(400).send({ msg: error });
  }
});

//27
router.post("/view/availableCars/filter", async (req, res) => {
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
    const renter = await CarRenter.findById(stat);
    if (!renter) {
      return res.status(404).send({ error: "Renter does not exist" });
    }
    const cars = await Car.find({ ...req.body, status: "UpForRent" });
    if (cars.length === 0) {
      return res.send({ msg: "no cars avaialble at the moment" });
    }
    carsSorted = cars.sort((a, b) => {
      return b.rating - a.rating;
    });
    res.json({ msg: "Cars available:", data: carsSorted });
  } catch (error) {}
});

//28
router.get("/view/availableCars/:id", async (req, res) => {
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
    const renter = await CarRenter.findById(stat);
    if (!renter) {
      return res.status(404).send({ error: "Renter does not exist" });
    }
    const cars = await Car.findOne({
      _id: req.params.id,
      status: "UpForRent",
      currentRenter: null
    });
    if (!cars) {
      return res.send({ msg: "no cars avaialble at the moment" });
    }

    res.json({ msg: "Cars available:", data: cars });
  } catch (error) {}
});

//29
router.post("/drivingLicense/submit", async (req, res) => {
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
  const renter = await CarRenter.findById(stat);
  if (!renter) {
    return res.status(404).send({ error: "Renter does not exist" });
  }
  try {
    if (!req.body.drivingLicenseLink) {
      return res.status(400).send({ msg: "please add your driving license" });
    }
    var updated = await CarRenter.findOneAndUpdate(
      { _id: stat },
      {
        $set: {
          drivingLicenseRequest: {
            drivingLicenseLink: req.body.drivingLicenseLink
          }
        }
      }
    );
    updated = await CarRenter.findById(stat);
    if (!updated) {
      return res.status(400).send({ msg: "something went wrong" });
    }
    return res.status(200).send({
      msg:
        "Request made successfully and should get a response within 24 hours",
      data: updated
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ msg: "error", error: error });
  }
});
router.post("/personalID/submit", async (req, res) => {
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
  try {
    const Renter = await CarRenter.findOneAndUpdate(
      { _id: stat },
      { personalID: req.body.personalID }
    );
    if (!Renter) return res.status(401).send({ msg: "authorization failed" });
    return res.status(200).send({ msg: "updated successfully", data: Renter });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ msg: "error", error: error });
  }
});

//30
router.post("/view/availableCars/:id/rent", async (req, res) => {
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
  const renter = await CarRenter.findById(stat);
  if (!renter) {
    return res.status(404).send({ error: "Renter does not exist" });
  }
  try {
    const Renter = await CarRenter.findOne({ _id: stat });
    if (Renter.drivingLicenseRequest.status !== "Accepted")
      return res.status(401).send({ msg: "Please add your driving license" });
    if (!Renter.personalID)
      return res.status(401).send({ msg: "Please add your personalID" });

    const cars = await Car.findOne({
      _id: req.params.id,
      status: "UpForRent"
    });
    if (!cars) {
      console.log("no cars");
      return res.status(404).send({ msg: "no cars avaialble at the moment" });
    }
    const transaction = await Transaction.findOneAndUpdate(
      { carID: cars._id, carOwnerID: cars.carOwnerID },
      {
        carRenterID: stat
      }
    );
    if (!transaction) {
      console.log("no");
      return res.status(404).send({ msg: "renting failed" });
    }

    const car = await Car.findOneAndUpdate(
      { _id: cars._id },
      {
        status: "Rented",
        currentRenter: Renter
      }
    );

    return res
      .status(200)
      .json({ msg: "Cars Rented", data: car, transaction: transaction });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ msg: "error", error: error });
  }
});

//31
router.put("/PaymentMethod/change", async (req, res) => {
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
  const renter = await CarRenter.findById(stat);
  if (!renter) {
    return res.status(404).send({ error: "Renter does not exist" });
  }
  try {
    if (req.body.paymentMethod === "Cash") {
      await CarRenter.findOneAndUpdate(
        { _id: stat },
        { paymentMethod: "Cash", cardNumber: null }
      ).then(res.status(200).send({ msg: "Updated to cash successfully" }));
    } else if (req.body.paymentMethod === "Card") {
      if (!req.body.cardNumber)
        return res.status(400).send({ msg: "Please enter card number" });
      await CarRenter.findOneAndUpdate(
        { _id: stat },
        { paymentMethod: "Card", cardNumber: req.body.cardNumber }
      ).then(res.status(200).send({ msg: "Updated to card successfully" }));
    } else {
      res.status(400).send({ msg: "Please choose a valid payment method" });
    }
  } catch (error) {
    return res.status(400).send({ msg: "error", error: errro });
  }
});

//32
router.get("/view/availableCars/:id/ownerDetails", async (req, res) => {
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
  const renter = await CarRenter.findById(stat);
  if (!renter) {
    return res.status(404).send({ error: "Renter does not exist" });
  }
  try {
    const cars = await Car.findOne({
      _id: req.params.id,
      status: "Rented",
      "currentRenter._id": stat
    });
    if (!cars) {
      return res.send({ msg: "no cars avaialble at the moment" });
    }
    const Owner = await CarOwner.findOne({ _id: cars.carOwnerID });
    return res.status(200).send({ msg: "Owner Details", data: Owner });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ msg: "error", error: error });
  }
});

//33
router.get("/view/upComingRentals", async (req, res) => {
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
  const renter = await CarRenter.findById(stat);
  if (!renter) {
    return res.status(404).send({ error: "Renter does not exist" });
  }
  try {
    const transactions = await Transaction.find({
      carRenterID: stat,
      status: "UpComing"
    });
    if (transactions.length === 0)
      return res.status(401).send({ msg: "no upcoming rentals" });
    return res
      .status(200)
      .send({ msg: "upcoming rentals:", data: transactions });
  } catch (error) {
    return res.status(400).send({ msg: "error", error: error });
  }
});

//34
router.get("/view/pastRentals", async (req, res) => {
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
  const renter = await CarRenter.findById(stat);
  if (!renter) {
    return res.status(404).send({ error: "Renter does not exist" });
  }
  try {
    const transactions = await Transaction.find({
      carRenterID: stat,
      status: "Done"
    });
    if (transactions.length === 0)
      return res.status(401).send({ msg: "no past rentals" });
    return res.status(200).send({ msg: "past rentals:", data: transactions });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ msg: "error", error: error });
  }
});

//35
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
  const renter = await CarRenter.findById(stat);
  if (!renter) {
    return res.status(404).send({ error: "Renter does not exist" });
  }
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      carRenterID: stat,
      status: "Done"
    });
    console.log(req.params.id + " " + stat);
    if (!transaction)
      return res.status(404).send({ msg: "transaction not found" });

    const complaint = await Complaint.create({
      issuedFrom: "Renter",
      comment: req.body.comment,
      transactionID: req.params.id,
      issuedAgainst: req.body.issuedAgainst
    });

    return res
      .status(200)
      .send({ msg: "complaint successfully filed:", data: complaint });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ msg: "error", error: error });
  }
});

router.post("/RateCar/:id", async (req, res) => {
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
  const renter = await CarRenter.findById(stat);
  if (!renter) {
    return res.status(404).send({ error: "Renter does not exist" });
  }
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      carRenterID: stat,
      status: "Done"
    });
    if (!transaction)
      return res.status(404).send({ msg: "transaction not found" });
    if (!req.body.rating || req.body.rating < 0 || req.body.rating > 5) {
      return res
        .status(401)
        .send({ error: true, message: "Please Enter A valid Rating" });
    }
    transaction.renterRating = req.body.rating;
    await Transaction.findByIdAndUpdate(transaction._id, {
      carRating: req.body.rating
    });
    return res
      .status(200)
      .send({ msg: "Your Rating has been Submitted:", data: transaction });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ msg: "error", error: error });
  }
});

module.exports = router;
