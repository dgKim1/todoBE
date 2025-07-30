const User = require("../model/User");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const userController = {};

userController.createUser = async (req, res) => {
  try {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
      return res
        .status(400)
        .json({ status: "fail", message: "모든 필드를 입력해주세요." });
    }
    const user = await User.findOne({ email });

    if (user) {
      return res
        .status(400)
        .json({ status: "fail", message: "이미 가입 된 유저입니다." });
    }
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    console.log(hash, "hash");
    const newUser = new User({ email, name, password: hash });
    await newUser.save();
    res.status(200).json({ status: "success" });
  } catch (error) {
    res.status(400).json({ status: "fail", error });
  }
};

userController.loginWithEmail = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ status: "fail", message: "이메일과 비밀번호를 입력해주세요." });
    }
    const user = await User.findOne({ email }, "-createdAt -updatedAt -__v");
    if (user) {
      const isMatch = bcrypt.compareSync(password, user.password);
      if (isMatch) {
        const token = user.generateToken();
        return res.status(200).json({ status: "success", user, token });
      }
      throw new Error("아이디 또는 비밀번호가 일치하지 않습니다.");
    }
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

userController.getUser = async (req, res) => {
  try {
    const { userId } = req;
    const user = await User.findById(userId).lean();
    res.status(200).json({ status: "success", user });
    if (!user) {
      throw new Error("can not find User");
    }
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};
module.exports = userController;
