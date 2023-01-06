module.exports = function ({ app, dbConn, upload, constants }) {
    app.post('/users/sendMessage', (req, res) => {
        const { senderId, recipentId, message } = req.body;
        if (senderId && recipentId && message) {
          const insertSql = "INSERT INTO message (sender_uid, recipient_uid, message) VALUES ?";
          dbConn.query(insertSql, [[[senderId, recipentId, message]]], function (err, result) {
            if (err) {
              console.log(err);
              res.status(200).jsonp({ message: 'Cannot send the message' });
            } 
            else {
              res.status(200).json({message:"Successfully Send"});
            }
          });
        } 
        else {
          res.status(200).jsonp({ message: "Please provide complete info" });
        }
    
    })

    app.post('/users/getMessage', (req, res) => {
        const { senderId, recipentId } = req.body;
        if (senderId && recipentId ) {
          const sql = "SELECT message, created_at FROM message WHERE sender_uid = ? AND recipient_uid = ? ORDER BY created_at";
          dbConn.query(sql, [senderId, recipentId], function (err, result) {
            if (err) {
              console.log(err)
              res.status(200).jsonp({ message: 'Cannot get the message' });
            } else {
              res.status(200).jsonp(result)
            }
          });
        } else {
          res.status(200).jsonp({ message: "Please provide complete info" });
        }
    
    })

}