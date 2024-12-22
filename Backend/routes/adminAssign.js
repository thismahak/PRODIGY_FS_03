const express = require('express');
const router = express.Router();
const {protectAdmin} = require('../middlewares/adminMiddleware');
const User = require('../models/User');
// Admin Role Assignment (Only accessible by admin)
router.put('/assign-admin/:userId', protectAdmin, async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Only admin can assign roles
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Only admin can assign roles.' });
      }
  
      user.role = 'admin';
      await user.save();
  
      res.status(200).json({ message: 'Role updated to admin', user });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });
  
module.exports = router;