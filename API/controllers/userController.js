const User = require('../models/userModel');

const getUserById = async (req, res) => {
    try {
        const userId = req.params.userId;

        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user details', error: error.message });
    }
};

module.exports = {
    getUserById,
};