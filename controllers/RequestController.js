const MatchRequest = require('../models/MatchRequest'); // Assuming you have a MatchRequest model
const constants = require('../utils/constants'); // Import constants


class RequestController {
  static async createRequest(req, res) {
    const { matchRequestFrom, matchRequestTo, matchRequestSender, matchRequestReceiver } = req.body;
    if (matchRequestFrom && matchRequestTo && matchRequestSender && matchRequestReceiver) {
      try {
        const existingRequest = await MatchRequest.findOne({
          where: { match_request_from: matchRequestFrom, match_request_to: matchRequestTo },
        });
        if (existingRequest) {
          return res.status(200).json({ message: "The match request existed in the system." });
        } else {
          const newRequest = await MatchRequest.create({
            match_request_from: matchRequestFrom,
            match_request_to: matchRequestTo,
            match_request_sender: matchRequestSender,
            match_request_receiver: matchRequestReceiver,
            match_request_status: 0, // Assuming 0 is pending
          });
          return res.status(200).json({ message: "The match request has been created successfully" });
        }
      } catch (err) {
        console.error(err);
        return res.status(200).json({ message: "The system error. Please try again" });
      }
    } else {
      return res.status(200).json({ message: 'Please provide the match request from and the match request to' });
    }
  }
}

module.exports = RequestController;