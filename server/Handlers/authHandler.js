// Handlers/AuthHandler.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { connectToDatabase } = require('../Database/database');

exports.registerUser = async (req, res) => {
    const db = await connectToDatabase();
    const usersCollection = db.collection('users');
    const { username, password } = req.body;
    
    try {
        const existingUser = await usersCollection.findOne({ username });
        if (existingUser) {
            return res.status(400).send('User already exists');
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        await usersCollection.insertOne({ username, password: hashedPassword });
        res.status(201).send('User created successfully');
    } catch (error) {
        res.status(500).send('Server error: ' + error.message);
    }
};

exports.loginUser = async (req, res) => {
    const db = await connectToDatabase();
    const usersCollection = db.collection('users');
    const { username, password } = req.body;
    console.log('Username:', username); 
    
    try {
        const user = await usersCollection.findOne({ username });
        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ userId: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '1h' });
            console.log('Generated token:', token); // Log the generated token
            res.status(200).json({ token });
        } else {
            res.status(401).send('Username or password is incorrect');
        }
    } catch (error) {
        res.status(500).send('Server error: ' + error.message);
    }
};


