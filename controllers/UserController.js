const { Op, Sequelize } = require('sequelize'); // Add this line at the top
const User = require('../models/User'); // Assuming you have a User model
const MatchRequest = require('../models/MatchRequest'); // Assuming you have a MatchRequest model
const bcrypt = require('bcrypt');
const constants = require('../utils/constants'); // Import constants
const MatchRequestController = require('./MatchRequestController'); // Import the new controller



class UserController {
    static async createUser(req, res) {
        try {
          const { email, password, fullname, age, position, ccUid, avatar, musicClip } = req.body;
      
          // Validate required fields
          if (!email || !password || !fullname || !age || !position || !avatar || !musicClip) {
            return res.status(400).json({ message: "All fields are required." });
          }
      
          const hashpassword = await bcrypt.hash(password, 10);
      
          const existingUser = await User.findOne({ where: { user_email: email } });
          if (existingUser) {
            return res.status(400).json({ message: 'The email already exists in the system' });
          } else {
            const newUser = await User.create({
              user_email: email,
              user_password: hashpassword,
              user_full_name: fullname,
              user_age: age,
              user_position: position,
              user_uid: ccUid,
              user_avatar: avatar,
              user_music_clip: musicClip,
            });
            return res.status(201).json({ avatar: newUser.user_avatar, insertId: newUser.id });
          }
        } catch (err) {
          console.error(err);
          return res.status(500).json({ message: "An error occurred while creating the user." });
        }
    }
  static async recommendUsers(req, res) {
    const { position, ccUid } = req.body;
    if (!position || !ccUid) {
        return res.status(400).json({ message: "Please provide both position and ccUid." });
    }

    try {
        // Fetch match requests using the new controller
        const matchRequests = await MatchRequestController.getMatchRequests(ccUid);
        const matchedUserIds = matchRequests.map(request => {
            return request.match_request_from === ccUid ? request.match_request_to : request.match_request_from;
        });

        const recommendedUsers = await User.findAll({
            where: {
                user_position: position,
                user_uid: {
                    [Op.not]: matchedUserIds // Exclude matched users
                }
            }
        });

        return res.status(200).json(recommendedUsers);
    } catch (err) {
        console.error("Error recommending users:", err);
        return res.status(500).json({ message: 'Cannot get your recommended users, please try again' });
    }
  }

  static async getMatches(req, res) {
    const { ccUid } = req.body;
    if (ccUid) {
      try {
        const matches = await MatchRequest.findAll({
          where: {
            [Op.or]: [
              { match_request_from: ccUid },
              { match_request_to: ccUid }
            ],
            match_request_status: constants.matchRequestStatus.accepted
          }
        });
        const friendList = matches.map(match => match.match_request_from === ccUid ? match.match_request_to : match.match_request_from);
        return res.status(200).json(friendList);
      } catch (err) {
        console.error(err);
        return res.status(200).json({ message: 'Cannot get your match users, please try again' });
      }
    } else {
      return res.status(200).json({ message: "Please provide uid" });
    }
  }
}

module.exports = UserController;