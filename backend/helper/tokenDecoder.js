const jwt = require("jsonwebtoken");

const TokenDecoder = (token) => {
  const secretKey = process.env.JWT_SECRET;
  const decodedToken = jwt.verify(token, secretKey);

  let userId = decodedToken.user?.id;

  if (!userId) {
    throw new Error("Invalid Token");
  }
  return userId;
};

module.exports = TokenDecoder;
