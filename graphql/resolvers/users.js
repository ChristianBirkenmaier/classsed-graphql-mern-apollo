const bcrypt = require("bcryptjs");
const { UserInputError } = require("apollo-server");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const { SECRET_KEY } = require("../../config");
const { validateRegisterInput, validateLoginInput } = require("../../util/validators");

module.exports = {
    Mutation: {
        async register(
            _,
            { registerInput: { username, email, password, confirmPassword } },
            context,
            info
        ) {
            // Validate user data
            const { valid, errors } = validateRegisterInput(
                username,
                email,
                password,
                confirmPassword
            );
            if (!valid) {
                throw new UserInputError("Errors", { errors });
            }
            //  Make sure user doesn't already exist
            const user = await User.findOne({ username });
            if (user) {
                throw new UserInputError("Username already exists", {
                    errors: {
                        username: "This username is taken",
                    },
                });
            }
            //  hash password and create an auth token
            password = await bcrypt.hash(password, 12);

            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString(),
            });

            const res = await newUser.save();

            const token = generateToken(res);

            return { ...res._doc, id: res._id, token };
        },
        async login(_, { username, password }, context, info) {
            const { valid, errors } = validateLoginInput(username, password);
            if (!valid) {
                throw new UserInputError("Errors", { errors });
            }
            const user = await User.findOne({ username });
            if (!user) {
                errors.general = "User not found";
                throw new UserInputError("User not found", { errors });
            }
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                errors.general = "Wrong credentials";
                throw new UserInputError("Wrong credentials", { errors });
            }

            const token = generateToken(user);

            return { ...user._doc, id: user._id, token };
        },
    },
};

function generateToken(user) {
    return jwt.sign({ id: user._id, email: user.email, username: user.username }, SECRET_KEY, {
        expiresIn: "1h",
    });
}
