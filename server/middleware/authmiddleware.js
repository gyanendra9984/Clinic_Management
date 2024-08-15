const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                res.status(200).send({
                    message: "auth failed",
                    success: false,
                })
            } else {
                req.body.userId = decoded.id;
                next();
            }
         
        });
    } catch (error) {
      res.status(401).send({
        message: "auth failed",
        success: false,
      });
    }
  
};
