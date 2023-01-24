module.exports = function ({ app, dbConn, bcrypt, jwt }) {
    app.post("/login", (req, res) => {
      const { email, password } = req.body;
      if (email && password) {
        const sql = "SELECT * FROM user_account WHERE user_email = ?";
        dbConn.query(sql, [email], async function (err, result) {
          if (result && result.length !== 0) {
            const correctPassword = await bcrypt.compare(password, result[0].user_password);
            if(correctPassword){
              // Success Login
              console.log(result[0])
              const {position, avatar, uid, name} = {position: result[0].user_position, avatar: result[0].user_avatar, uid: result[0].user_uid, name: result[0].user_full_name}
              const token = jwt.sign({...result[0]}, email, {expiresIn: 60*24});
              res.status(200).jsonp({ token, position, avatar, uid, name});
            }
            else{
              res.status(200).jsonp({ message: "Your username or password is not correct" });
            }
          } else {
            res.status(200).jsonp({ message: "Your username or password is not correct" });
          }
        });
      } else {
        res.status(200).jsonp({ message: "Your username or password is not correct" });
      }
    });
  };
  