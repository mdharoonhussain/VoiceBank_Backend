const express = require("express");
const adminRouter = express.Router();
const AdminModel = require("../models/admin.model");
const bcrypt = require("bcrypt");

adminRouter.patch('/update/:id', async (req, res) => {
    const {id} = req.params;
    const { name, password, confirm_password } = req.body;
    try {

        if (!name && !password && !confirm_password) {
            return res.status(400).json({ message: 'At least one field is required' });
        }

        const admin = await AdminModel.findById({id});

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        if (name) {
            admin.name = name;
        }

        if (password) {
            if (password !== confirm_password) {
                return res.status(400).json({ message: 'Passwords do not match' });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            admin.password = hashedPassword;
        }

        await admin.save();

        res.status(200).json({ message: 'Admin information updated successfully' , user:admin});
    } catch (error) {
        console.error('Error updating admin information:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = adminRouter;