const fs = require('fs');
const usersDataPath = './user.json';

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
function createUser(req, res) {
  const users = readUsersData();
  const newUser = {
    user_id: req.body.user_id || '',
    username: req.body.username || '',
    email: req.body.email || '',
    password: req.body.password || '',
    full_name: req.body.full_name || '',
    date_of_birth: req.body.date_of_birth || '',
    profile_picture: req.body.profile_picture || '',
    created_at: req.body.created_at || '',
    updated_at: req.body.updated_at || '',
    reviews: []
  };

  users.push(newUser);
  writeUsersData(users);

  res.status(201).json(newUser);
}

module.exports = {
  getAllUsers,
  createUser,
};
