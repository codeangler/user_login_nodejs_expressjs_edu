'use strict';
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost/nodeauth');

const db = mongoose.connection;

// User Schema
const UserSchema = mongoose.Schema({
  username: {
    type: String,
    index: true,

  },
  password: {
    type: String
  },
  email: {
    type: String
  },
  name: {
    type: String
  },
  profileImage: {
    type: String
  }

});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = (id, callback) => {
  User.findById(id, callback);
}

module.exports.getUserByUsername = (username, callback) => {
  const query = {username: username};
  User.findOne(query, callback);
}

module.exports.comparePassword  = (canidatePassword, hash, callback) => {
  // Load hash from your password DB. 
  bcrypt.compare(canidatePassword, hash, function(err, isMatch) {
    callback(null, isMatch);
  });
}

module.exports.createUser = function (newUser, callback) {
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
        // Store hash in your password DB. 
        newUser.password = hash;
        newUser.save(callback);
    });
  });
  
  
}