/** @format */
const jwt = require("jsonwebtoken");

// ** Checks if an object is empty (returns boolean)
const isObjEmpty = (obj) => {
  return Object?.keys(obj).length === 0;
};

const uniqId = () => {
  const id = Math.floor(Math.random() * Date.now());
  return id;
};

const getClientUrl = (req) => {
  const baseUrl = req.headers.clienturl;
  return baseUrl;
};
const dateId = () => {
  const id = Math.floor(Date.now());
  return id;
};
const jsonFormat = (obj) => {
  const object = JSON.parse(JSON.stringify(obj));
  return object;
};

const getUserInfoByToken = (req) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  console.log(token);

  ///Make sure token is exit
  if (token) {
    console.log(token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    return decoded.id;
  } else {
    return null;
  }
};

module.exports = {
  isObjEmpty,
  getClientUrl,
  jsonFormat,
  dateId,
  uniqId,
  getUserInfoByToken,
};
