const jwt = require("jsonwebtoken");

const deleteCookies = async (res) => {
  try {
     res.cookie("accessToken", "", { expires: new Date(0) });
     res.cookie("refreshToken", "", { expires: new Date(0) });
  } catch (err) {
    return err;
  }
};

module.exports = { deleteCookies };
