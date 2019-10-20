const bcrtpy = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");

module.exports = {
  createUser: args => {
    const input = args.userInput;
    //hash the password
    //check if the user is exist
    return User.findOne({ email: input.email })
      .then(user => {
        if (user) {
          throw new Error("The user was exist");
        }
        return bcrtpy.hash(input.password, 12);
      })
      .then(hashedPassword => {
        const user = new User({
          email: input.email,
          password: hashedPassword
        });

        return user.save();
      })
      .then(result => {
        return { ...result._doc, _id: result.id };
      })
      .catch(err => {
        throw err;
      });
  },
  login: async ({ email, password }) => {
    const user = await User.findOne({ email: email });
    if (!user) throw new Error("User not exist");
    const isEqual = await bcrtpy.compare(password, user.password);

    if (!isEqual) {
      throw new Error("Invalid username or password");
    }

    const token = await jwt.sign(
      { userId: user.id, email: user.email },
      process.env.KEY_TOKEN,
      {
        expiresIn: "1h"
      }
    );

    return { userId: user.id, token: token, tokenExpiration: 1 };
  }
};
