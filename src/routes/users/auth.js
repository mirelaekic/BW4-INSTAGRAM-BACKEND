const jwt = require("jsonwebtoken");
const UserSchema = require("./schema");

const authenticate = async (user) => {
    const token = jwt.sign({ id: user.id }, process.env.JWT_KEY, {
        expiresIn: "15000",
    });
    const refreshToken = jwt.sign(
        { id: user.id },
        process.env.JWT_REFRESH_KEY,
        {
            expiresIn: "1 week",
        }
    );
    user.refresh_tokens = user.refresh_tokens.concat(refreshToken);
    await UserSchema.update(
        { refresh_tokens: user.refresh_tokens },
        { where: { id: user.id } }
    );
    return { user, token, refreshToken };
};

const deleteCookies = async (res) => {
  try {
    res.cookie("accessToken", "", { expires: new Date(0) });
    res.cookie("refreshToken", "", { expires: new Date(0) });
  } catch (err) {
    return err;
  }
};

module.exports = { authenticate, deleteCookies };
