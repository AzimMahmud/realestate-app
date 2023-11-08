/** @format */

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

module.exports = { isObjEmpty, getClientUrl, jsonFormat, dateId, uniqId };
