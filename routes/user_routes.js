const express = require('express');
const router = express.Router();
const User = require('../models/user_model.js');
const UserDetails = require('../models/user_details.js');



// Get all users (name, number, roll, and salary)
router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        // const users = await User.find({}, 'name number roll');

        const userIds = users.map(user => user._id);
        const userDetails = await UserDetails.find({ userId: { $in: userIds } });

        const combinedData = users.map(user => {
            const details = userDetails.find(detail => detail.userId.toString() === user._id.toString());
            return {
                _id: user._id,
                name: user.name,
                number: user.number,
                roll: user.roll,
                salary: details ? details.salary : null
            };
        });

        res.json({ status: true, data: combinedData });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
});


// Create user and user details
router.post('/user', async (req, res) => {
    try {
        const { name, number, roll, salary, exp, address } = req.body;

        // Create user
        const user = new User({ name, number, roll });
        const savedUser = await user.save();

        // Create user details with reference to userId
        const userDetails = new UserDetails({ userId: savedUser._id, salary, exp, address });
        const savedUserDetails = await userDetails.save();

        // Combine user and userDetails
        const combinedData = {
            _id: savedUser._id,
            name: savedUser.name,
            number: savedUser.number,
            roll: savedUser.roll,
            salary: savedUserDetails.salary,
            exp: savedUserDetails.exp,
            address: savedUserDetails.address
        };

        res.json({ status: true, data: combinedData });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
});

// Get user details by user ID
router.get('/user/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ status: false, message: "User not found" });
        }

        const userDetails = await UserDetails.findOne({ userId: req.params.id });
        if (!userDetails) {
            return res.status(404).json({ status: false, message: "User details not found" });
        }

        // Combine user and userDetails
        const combinedData = {
            _id: user._id,
            name: user.name,
            number: user.number,
            roll: user.roll,
            salary: userDetails.salary,
            exp: userDetails.exp,
            address: userDetails.address
        };

        res.json({ status: true, data: combinedData });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
});

// Update user and user details
router.put('/user/:id', async (req, res) => {
    try {
        const { name, number, roll, salary, exp, address } = req.body;

        // Update user
        const updatedUser = await User.findByIdAndUpdate(req.params.id, { name, number, roll }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ status: false, message: "User not found" });
        }

        // Update user details
        const updatedUserDetails = await UserDetails.findOneAndUpdate({ userId: req.params.id }, { salary, exp, address }, { new: true });
        if (!updatedUserDetails) {
            return res.status(404).json({ status: false, message: "User details not found" });
        }

        // Combine updated user and userDetails
        const combinedData = {
            _id: updatedUser._id,
            name: updatedUser.name,
            number: updatedUser.number,
            roll: updatedUser.roll,
            salary: updatedUserDetails.salary,
            exp: updatedUserDetails.exp,
            address: updatedUserDetails.address
        };

        res.json({ status: true, data: combinedData });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
});

// Delete user and user details
router.delete('/user/:id', async (req, res) => {
    try {
        // Delete user
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ status: false, message: "User not found" });
        }

        // Delete user details
        const deletedUserDetails = await UserDetails.findOneAndDelete({ userId: req.params.id });
        if (!deletedUserDetails) {
            return res.status(404).json({ status: false, message: "User details not found" });
        }

        res.json({ status: true, message: "User and user details deleted successfully" });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
});

// Get all users (only name, number, and roll)
// router.get('/users', async (req, res) => {
//     try {

//         const users = await User.find({}, 'name number roll'); // Select only name, number, and roll fields
//         res.json({ status: true, data: users });
//     } catch (error) {
//         res.status(500).json({ status: false, message: error.message });
//     }
// });




module.exports = router;
