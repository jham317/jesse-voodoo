const bcrypt = require('bcrypt');
const fs = require('fs');
const usersDataPath = './Database/user.json';

// Helper function to read users data from JSON file
function readUsersData() {
  const data = fs.readFileSync(usersDataPath);
  return JSON.parse(data);
}

// Helper function to write users data to JSON file
function writeUsersData(users) {
  fs.writeFileSync(usersDataPath, JSON.stringify(users, null, 2));
}

// Get all users
function getAllUsers(req, res) {
  const users = readUsersData();
  res.json(users);
}

// Create a new user
async function createUser(req, res) {
  const users = readUsersData();
  const newUser = {
    user_id: req.body.user_id || '',
    username: req.body.username || '',
    email: req.body.email || '',
    password: await bcrypt.hash(req.body.password, 10),
    full_name: req.body.full_name || '',
    date_of_birth: req.body.date_of_birth || '',
    profile_picture: req.body.profile_picture || '',
    created_at: req.body.created_at || '',
    updated_at: req.body.updated_at || '',
    reviews: [],
  };

  users.push(newUser);
  writeUsersData(users);

  res.status(201).json(newUser);
}

async function loginUser(req, res) {
  const { username, password } = req.body;
  const users = readUsersData();
  const user = users.find((u) => u.username === username);

  if (!user) {
    return res.status(401).json({ message: 'Authentication failed' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (isPasswordValid) {
    // Authentication successful
    return res.status(200).json({ message: 'Authentication successful' });
  } else {
    // Authentication failed
    return res.status(401).json({ message: 'Authentication failed' });
  }
}

// Create a new handler for user signup
async function signupUser(req, res) {
  const users = readUsersData();
  const { username, email, password } = req.body;

  // Check if the username or email already exists (you can add more validation)
  const userExists = users.some((user) => user.username === username || user.email === email);

  if (userExists) {
    return res.status(400).json({ message: 'Username or email already exists' });
  }

  // Generate a salt and hash the password
  bcrypt.genSalt(10, async function(err, salt) {
    if (err) {
      return res.status(500).json({ message: 'Internal server error' });
    }
    
    bcrypt.hash(password, salt, async function(err, hashedPassword) {
      if (err) {
        return res.status(500).json({ message: 'Internal server error' });
      }

      const newUser = {
        user_id: users.length + 1, // Replace with a unique identifier for the user
        username: username,
        email: email,
        password: hashedPassword,
        // Add other user information as needed
      };

      users.push(newUser);
      writeUsersData(users);

      res.status(201).json({ message: 'User registered successfully' });
    });
  });
}

module.exports = {
  getAllUsers,
  createUser,
  loginUser,
  signupUser, // Add the new signup handler to the exports
};
