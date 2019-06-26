const express = require("express");
const router = express.Router();

const Transaction = require("../models/Transaction.models");

//create
router.post("/", async (req, res) => {
  try {
    // const isValidated = validator.createCarValidation(req.body);
    // if (isValidated.error)
    //   return res
    //     .status(400)
    //     .send({ error: isValidated.error.details[0].message });
    const newTransaction = await Transaction.create(req.body);
    newTransaction.dateAdded = Date.now();
    res.json({ msg: "Transaction was added successfully", data: newTransaction });
  } catch (error) {
    res.status(400).send({ msg: error });
    console.log(error);
  }
});

//read
router.get("/", async (req, res) => {
  const transactions = await Transaction.find();
  res.json({ data: transactions });
});

//read specific
router.get("/:id", async (req, res) => {
  try {
    const transactions = await Transaction.findById(req.params.id);
    res.json({ data: transactions });
  } catch (error) {
    console.log(error);
  }
});

//put
router.put("/:id", async (req, res) => {
  try {
    const Transaction = await Transaction.findOne({}, { _id: req.params.id });
    if (!Transaction)
      return res.status(404).send({ error: "Renter does not exist" });
    // const isValidated = validator.updateValidations(req.body);
    // if (isValidated.error)
    //   return res
    //     .status(400)
    //     .send({ error: isValidated.error.details[0].message });
    await Transaction.findByIdAndUpdate(req.params.id, req.body);
    res.json({ msg: "Transaction updated successfully" });
  } catch (error) {
    // We will be handling the error later
    console.log(error);
  }
});

//delete
router.delete("/:id", async (req, res) => {
  try {
    await Transaction.findByIdAndRemove(req.params.id);
    res.json({ msg: "Transaction was deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).send({ msg: error });
  }
});
module.exports = router;
