const express = require("express");
const router = express.Router();

const Car = require("../models/Car.models");

//create
router.post("/", async (req, res) => {
  try {
    // const isValidated = validator.createCarValidation(req.body);
    // if (isValidated.error)
    //   return res
    //     .status(400)
    //     .send({ error: isValidated.error.details[0].message });
    const newCar = await Car.create(req.body);
    newCar.dateAdded = Date.now();
    res.json({ msg: "Car was added successfully", data: newCar });
  } catch (error) {
    res.status(400).send({ msg: error });
    console.log(error);
  }
});

//read
router.get("/", async (req, res) => {
  const cars = await Car.find();
  res.json({ data: cars });
});

//read specific
router.get("/:id", async (req, res) => {
  try {
    const cars = await Car.findById(req.params.id);
    res.json({ data: cars });
  } catch (error) {
    console.log(error);
  }
});

//put
router.put("/:id", async (req, res) => {
  try {
    const car = await Car.findOne({}, { _id: req.params.id });
    if (!car) return res.status(404).send({ error: "Car does not exist" });
    // const isValidated = validator.updateValidations(req.body);
    // if (isValidated.error)
    //   return res
    //     .status(400)
    //     .send({ error: isValidated.error.details[0].message });
await Car.findByIdAndUpdate(req.params.id, req.body);
    res.json({ msg: "Car updated successfully"});
  } catch (error) {
    // We will be handling the error later
    console.log(error);
  }
});

//delete
router.delete("/:id", async (req, res) => {
  try {
    await Car.findByIdAndRemove(req.params.id);
    res.json({ msg: "Car was deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).send({ msg: error });
  }
});
module.exports = router;
