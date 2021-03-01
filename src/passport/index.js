
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const UserSchema = require("../database/users");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { authenticate } = require("../routes/users/auth");

passport.use(
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
        },
        function (email, password, cb) {
            return UserSchema.findOne({ where: { email } })
                .then(async (user) => {
                    if (!user) {
                        return cb(null, false, { message: "incorrect email or password" });
                    } else if (!user.validPassword(password)) {
                        return cb(null, false, { message: "Incorrect email or password." });
                    } else {
                        return cb(null, user, { message: "Log In Success" });
                    }
                })
                .catch((err) => cb(err));
        }
    )
);

passport.use(
    new JWTStrategy(
        {
            jwtFromRequest: function (req) {
                let token = null;
                if (req && req.cookies) {
                    token = req.cookies["accessToken"];
                }
                return token;
            },
            secretOrKey: process.env.JWT_KEY,
        },
        async function (jwtPayload, cb) {
            console.log("jwtPayload", jwtPayload);
            const expirationDate = new Date(jwtPayload.exp * 1000);

            const user = await UserSchema.findOne({ where: { _id: jwtPayload._id } });
            if (user) {
                return cb(null, user.dataValues);
            } else {
                return cb(null, false, { message: "unauthorized" });
            }
        }
    )
);


passport.use(
    "google",
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
            callbackURL: "http://localhost:9001/users/googleRedirect",
        },
        async (accessToken, refreshToken, profile, done) => {
            const newUser = {
                googleid: profile.id,
                email: profile.emails[0].value,
                refresh_tokens: [],
                favourites: [],
            };

            try {
                let user = await UserSchema.findOne({
                    where: { googleid: profile.id },
                });
                if (user) {
                    console.log(user);
                    const result = await authenticate(user.dataValues);
                    done(null, {
                        user: result.user,
                        token: result.token,
                        refreshToken: result.refreshToken,
                    });
                } else {
                    user = await UserSchema.create(newUser);
                    console.log(user);
                    const result = await authenticate(user.dataValues);
                    done(null, {
                        user: result.user,
                        token: result.token,
                        refreshToken: result.refreshToken,
                    });
                }
            } catch (error) {
                done(error);
            }
        }
    )
);

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

module.exports = passport