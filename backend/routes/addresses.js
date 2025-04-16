const express = require("express");
const TokenDecoder = require("../helper/tokenDecoder");
const Addresses = require("../models/address");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user;
    // Find user's addresses
    const userAddresses = await Addresses.findOne({ userId: userId.id });
    if (!userAddresses) {
      return res.status(200).json({ addresses: [] });
    }

    // Send the addresses array
    res.status(200).json({ addresses: userAddresses.addresses });
  } catch (error) {
    console.error(error); // Log error for debugging
    res
      .status(500)
      .json({ msg: "Error fetching addresses", error: error.message });
  }
});

router.post("/addAddress", auth, async (req, res) => {
  try {
    const userId = req.user;
    const { name, address, phone, email } = req.body;
    // Check if user already has an address document
    let userAddresses = await Addresses.findOne({ userId: userId.id });

    if (!userAddresses) {
      // Create new address document if user doesn't exist
      userAddresses = new Addresses({
        userId: userId.id,
        addresses: [{ name, address, phone, email }],
      });
      await userAddresses.save();
      return res
        .status(201)
        .json({ msg: "Address added", addresses: userAddresses.addresses });
    } else {
      // Add new address to existing user's addresses array
      userAddresses.addresses.push({ name, address, phone, email });
      await userAddresses.save();
      return res
        .status(200)
        .json({ msg: "Address added", addresses: userAddresses.addresses });
    }
  } catch (error) {
    console.error(error); // Log error for debugging
    return res
      .status(500)
      .json({ msg: "Server error while saving address", error: error.message });
  }
});

router.patch("/updateAddress/:addressIndex", auth, async (req, res) => {
  try {
    let userId = req.user;

    // Get the index of the address to update (from URL param)
    const addressIndex = parseInt(req.params.addressIndex, 10);
    if (isNaN(addressIndex) || addressIndex < 0) {
      return res.status(400).json({ msg: "Invalid address index" });
    }

    // Get update data from request body
    const { name, address, phone, email } = req.body;

    // Find the user's address document
    const userAddresses = await Addresses.findOne({ userId: userId.id });
    if (!userAddresses) {
      return res.status(404).json({ msg: "No addresses found for this user" });
    }

    // Check if the index is valid
    if (!userAddresses.addresses[addressIndex]) {
      return res
        .status(404)
        .json({ msg: "Address not found at specified index" });
    }

    // Update the specific address in the array
    const updatedAddress = {
      name: name || userAddresses.addresses[addressIndex].name,
      address: address || userAddresses.addresses[addressIndex].address,
      phone: phone || userAddresses.addresses[addressIndex].phone,
      email: email || userAddresses.addresses[addressIndex].email,
    };

    userAddresses.addresses[addressIndex] = updatedAddress;

    // Save the updated document
    await userAddresses.save();

    res.status(200).json({
      msg: "Address updated successfully",
      addresses: userAddresses.addresses,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ msg: "Error updating address", error: error.message });
  }
});

router.delete("/deleteAddress/:addressIndex", auth, async (req, res) => {
  try {
    const userId = req.user;
    // Get the index of the address to delete (from URL param)
    const addressIndex = parseInt(req.params.addressIndex, 10);
    if (isNaN(addressIndex) || addressIndex < 0) {
      return res.status(400).json({ msg: "Invalid address index" });
    }

    // Find the user's address document
    const userAddresses = await Addresses.findOne({ userId: userId.id });
    if (!userAddresses) {
      return res.status(404).json({ msg: "No addresses found for this user" });
    }

    // Check if the index is valid
    if (!userAddresses.addresses[addressIndex]) {
      return res
        .status(404)
        .json({ msg: "Address not found at specified index" });
    }

    // Remove the address from the array
    userAddresses.addresses.splice(addressIndex, 1);

    // If no addresses remain, you can choose to delete the entire document or keep it empty
    if (userAddresses.addresses.length === 0) {
      await Addresses.deleteOne({ userId: userId.id });
      return res
        .status(200)
        .json({ msg: "All addresses deleted for this user" });
    } else {
      // Save the updated document
      await userAddresses.save();
      return res.status(200).json({
        msg: "Address deleted successfully",
        addresses: userAddresses.addresses,
      });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ msg: "Error deleting address", error: error.message });
  }
});

module.exports = router;
