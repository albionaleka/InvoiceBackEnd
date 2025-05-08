const express = require('express');
const router = express.Router();

const User = require('../models/user');
const bcrypt = require('bcrypt');

router.post('/signup', (req, res) => {
    let { name, email, password, picture } = req.body;
    name = name.trim();
    email = email.trim();
    password = password.trim();

    if (!name || !email || !password || name === '' || email === '' || password === '') {
        return res.status(400).json({ 
            status: 'error',
            message: 'Please fill all the fields'
        });
    } else if (!/^[a-zA-Z]+$/.test(name)) {
        return res.status(400).json({ 
            status: 'error',
            message: 'Name can only contain letters' 
        });
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        return res.status(400).json({ 
            status: 'error',
            message: 'Email is not valid' 
        });
    } else if (password.length < 6) {
        return res.status(400).json({ 
            status: 'error',
            message: 'Password must be at least 6 characters long' 
        });
    } else {
        User.findOne({ email: email }).then(async (user) => {
            if (user) {
                return res.status(400).json({ 
                    status: 'error',
                    message: 'User already exists' 
                });
            } else {
                const saltRounds = process.env.SALT || 10;
                const hashedPassword = await bcrypt.hashSync(password, saltRounds);

                const newUser = new User({
                    name,
                    email,
                    password: hashedPassword,
                    picture
                });

                newUser.save().then(result => {
                    return res.status(201).json({ 
                        status: 'success',
                        message: 'User created successfully',
                        data: result
                    });
                }).catch(err => {
                    console.error(err);
                    return res.status(500).json({ 
                        status: 'error',
                        message: 'Internal server error' 
                    });
                });            
            }
        }).catch(err => {
            console.error(err);
            return res.status(500).json({ 
                status: 'error',
                message: 'Internal server error' 
            });
        });
    }
});

router.post('/login', (req, res) => {
    let { email, password } = req.body;
    email = email.trim();
    password = password.trim();

    if (!email || !password || email === '' || password === '') {
        return res.status(400).json({ 
            status: 'error',
            message: 'Please fill all the fields' 
        });
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        return res.status(400).json({ 
            status: 'error',
            message: 'Email is not valid' 
        });
    } else {
        User.findOne({ email: email }).then(user => {
            if (!user) {
                return res.status(400).json({ 
                    status: 'error',
                    message: 'User does not exist' 
                });
            } else {
                const isPasswordValid = bcrypt.compareSync(password, user.password);
                if (!isPasswordValid) {
                    return res.status(400).json({ 
                        status: 'error',
                        message: 'Invalid password' 
                    });
                } else {
                    // return res.status(200).json({ 
                    //     status: 'success',
                    //     message: 'Login successful',
                    //     data: user
                    // });

                    const token = user.generateAuthToken();
                    return res.status(200).json({ 
                        status: 'success',
                        message: 'Login successful',
                        data: token
                    });
                }
            }
        }).catch(err => {
            console.error(err);
            return res.status(500).json({ 
                status: 'error',
                message: 'Internal server error' 
            });
        });
    }
});

module.exports = router;