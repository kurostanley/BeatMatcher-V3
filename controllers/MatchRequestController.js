const { Op } = require('sequelize'); // Import Op for Sequelize operators
const MatchRequest = require('../models/MatchRequest'); // Assuming you have a MatchRequest model
const constants = require('../utils/constants'); // Import constants

class MatchRequestController {
    static async getMatchRequests(ccUid) {
        try {
            const matchRequests = await MatchRequest.findAll({
                where: {
                    [Op.or]: [
                        { match_request_from: ccUid },
                        { match_request_to: ccUid }
                    ]
                }
            });
            return matchRequests;
        } catch (err) {
            console.error("Error fetching match requests:", err);
            throw new Error("Unable to fetch match requests");
        }
    }
}

module.exports = MatchRequestController;