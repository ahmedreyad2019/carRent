const express = require("express");
const router = express.Router();

const CarOwner = require("../models/CarOwner.models");

//create
router.post("/", async (req, res) => {
  try {
    // const isValidated = validator.createCarValidation(req.body);
    // if (isValidated.error)
    //   return res
    //     .status(400)
    //     .send({ error: isValidated.error.details[0].message });
    const newCarOwner = await CarOwner.create(req.body);
    newCarOwner.dateAdded = Date.now();
    res.json({ msg: "Car Owner was added successfully", data: newCarOwner });
  } catch (error) {
    res.status(400).send({ msg: error });
    console.log(error);
  }
});

//read
router.get("/", async (req, res) => {
  const carOwners = await CarOwner.find();
  res.json({ data: carOwners });
});

//read specific
router.get("/:id", async (req, res) => {
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
    const carOwner = await CarOwner.findOne({}, { _id: req.params.id });
    if (!carOwner) return res.status(404).send({ error: "Renter does not exist" });
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
router.delete("/:id", async (req, res) => {
  try {
    await CarOwner.findByIdAndRemove(req.params.id);
    res.json({ msg: "Car Owner was deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).send({ msg: error });
  }
});
module.exports = router;
