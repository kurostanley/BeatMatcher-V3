const Message = require('../models/Message'); // Assuming you have a Message model
const constants = require('../utils/constants'); // Import constants

class MessageController {
  static async sendMessage(req, res) {
    const { senderId, recipientId, message } = req.body;
    if (senderId && recipientId && message) {
      try {
        await Message.create({ sender_uid: senderId, recipient_uid: recipientId, message });
        return res.status(200).json({ message: "Successfully Sent" });
      } catch (err) {
        console.error(err);
        return res.status(200).json({ message: 'Cannot send the message' });
      }
    } else {
      return res.status(200).json({ message: "Please provide complete info" });
    }
  }

  static async getMessage(req, res) {
    const { senderId, recipientId } = req.body;
    if (senderId && recipientId) {
      try {
        const messages = await Message.findAll({
          where: { sender_uid: senderId, recipient_uid: recipientId },
          order: [['created_at', 'ASC']],
        });
        return res.status(200).json(messages);
      } catch (err) {
        console.error(err);
        return res.status(200).json({ message: 'Cannot get the message' });
      }
    } else {
      return res.status(200).json({ message: "Please provide complete info" });
    }
  }
}

module.exports = MessageController;