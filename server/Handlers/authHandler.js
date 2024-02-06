const bcrypt = require('bcrypt');
const fs = require('fs');

// Helper function to read user data from JSON file
function readUserData() {
  const data = fs.readFileSync('./Database/user.json'); // Replace with your actual user data file path
  return JSON.parse(data);
}

// Helper function to write user data to JSON file
function writeUserData(users) {
  fs.writeFileSync('./user.json', JSON.stringify(users, null, 2)); // Replace with your actual user data file path
}

// User Registration
function registerUser(req, res) {
  const users = readUserData();
  const { username, email, password, full_name, date_of_birth, profile_picture } = req.body;

  // Check if the username or email already exists (you can add more validation)
  const userExists = users.some((user) => user.username === username || user.email === email);

  if (userExists) {
    return res.status(400).json({ message: 'Username or email already exists' });
  }

  // Generate a salt and hash the password
  bcrypt.genSalt(10, function(err, salt) {
    if (err) {
      return res.status(500).json({ message: 'Internal server error' });
    }
    
    bcrypt.hash(password, salt, function(err, hashedPassword) {
      if (err) {
        return res.status(500).json({ message: 'Internal server error' });
      }

      const newUser = {
        user_id: users.length + 1, // Replace with a unique identifier for the user
        username: username,
        email: email,
        password: hashedPassword,
        full_name: full_name,
        date_of_birth: date_of_birth,
        profile_picture: profile_picture,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        reviews: []
      };

      users.push(newUser);
      writeUserData(users);

      res.status(201).json({ message: 'User registered successfully' });
    });
  });
}

// User Login
function loginUser(req, res) {
  const users = readUserData();
  const { username, password } = req.body;

  // Find the user by username
  const user = users.find((user) => user.username === username);

  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  // Compare the provided password with the stored hashed password
  bcrypt.compare(password, user.password, function(err, passwordMatch) {
    if (err || !passwordMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Passwords match, user is authenticated
    // You can generate a JWT or manage the user's session here
    res.status(200).json({ message: 'Login successful', user: user.username });
  });
}

module.exports = {
  registerUser,
  loginUser,
};
