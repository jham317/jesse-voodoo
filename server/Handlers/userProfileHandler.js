const fs = require('fs');
const userProfilesDataPath = './database/userProfiles.json';

// Helper function to read user profiles data from JSON file
function readUserProfilesData() {
  const data = fs.readFileSync(userProfilesDataPath);
  return JSON.parse(data);
}

// Helper function to write user profiles data to JSON file
function writeUserProfilesData(userProfiles) {
  fs.writeFileSync(userProfilesDataPath, JSON.stringify(userProfiles, null, 2));
}

// Get all user profiles
function getAllUserProfiles(req, res) {
  const userProfiles = readUserProfilesData();
  res.json(userProfiles);
}

// Create or update a user profile
function updateUserProfile(req, res) {
  const userProfiles = readUserProfilesData();
  const userId = req.params.userId;
  const existingProfile = userProfiles.find((profile) => profile.userId === userId);

  if (existingProfile) {
    // Update existing profile
    existingProfile.bio = req.body.bio || '';
    existingProfile.favoriteGenres = req.body.favoriteGenres || [];
    existingProfile.createdAt = new Date();
  } else {
    // Create a new profile
    const newUserProfile = {
      userId: userId,
      bio: req.body.bio || '',
      favoriteGenres: req.body.favoriteGenres || [],
      createdAt: new Date(),
    };

    userProfiles.push(newUserProfile);
  }

  writeUserProfilesData(userProfiles);

  res.status(200).json({ message: 'User profile updated successfully' });
}

module.exports = {
  getAllUserProfiles,
  updateUserProfile,
};
