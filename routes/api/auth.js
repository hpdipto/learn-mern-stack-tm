const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const config = require('config');
const jwt = require('jsonwebtoken');

// Item model
const Item = require('../../models/User');

// @route   GET api/auth
// @desc    Register new user
// @access  Public
router.post('/', (req, res) => {
	const { email, password } = req.body;

	// Simple validation
	if(!email || !password) {
		return res.status(400).json({ msg: 'Please enter all fields' });
	}

	// Check for existing usre
	User.findOne({ email })
			.then(user => {
				if(!user) res.status(400).json({ msg: 'User does not exist' });

				// Validation password
				bcrypt.compare(password, user.password)
							.then(isMatch => {
								if(!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

								jwt.sign(
									{ id: user.id }, 
									config.get('jwtSecret'),
									{ expiresIn: 3600 },
									(err, token) => {
										if(err) throw err;

										res.json({
											token,
											user: {
												id: user.id,
												name: user.name,
												email: user.email
											}
										})
									}
								)
							})
			});
});


module.exports = router;