const { StatusCodes } = require("http-status-codes");
const { asyncHandler } = require("../../utils/async-handler");
const { HttpException } = require("../../utils/http-exception");
const { REG_KEY, JWT_SECRET_KEY } = require("../../utils/secret");
const { AuthModel } = require("../../models/auth/auth.model");
const { genSalt, hash, compare } = require("bcryptjs");
const { RoleConstands } = require("../../utils/constands");
const { sign } = require("jsonwebtoken");
const { param } = require("express-validator");

class AuthController {
  static signUpAdmin = asyncHandler(async (req, res) => {
    const { name, telephone, password, regKey } = req.body;

    if (regKey !== REG_KEY) {
      throw new HttpException(
        StatusCodes.FORBIDDEN,
        "There was an error creating the account.",
      );
    }

    const ExAdmin = await AuthModel.findOne({ telephone });

    if (ExAdmin) {
      throw new HttpException(
        StatusCodes.CONFLICT,
        "An account with this telephone number already exists.",
      );
    }

    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    await AuthModel.create({
      name,
      telephone,
      password: hashedPassword,
      role: RoleConstands.ADMIN,
    });

    res
      .status(StatusCodes.CREATED)
      .json({ success: true, message: "created account successfully" });
  });

  static login = asyncHandler(async (req, res) => {
    const { telephone, password } = req.body;

    const ExAdmin = await AuthModel.findOne({ telephone });

    if (!ExAdmin) {
      throw new HttpException(
        StatusCodes.UNAUTHORIZED,
        "Invalid telephone or password",
      );
    }

    const isMatch = compare(password, ExAdmin.password);

    if (!isMatch) {
      throw new HttpException(
        StatusCodes.UNAUTHORIZED,
        "Invalid telephone or password",
      );
    }

    const createToken = sign({ userId: ExAdmin._id }, JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.status(StatusCodes.OK).json({
      success: true,
      token: createToken,
    });
  });

  static getMe = asyncHandler(async (req, res) => {
    const user = await AuthModel.findById(req.user.userId).select("-password");

    res.status(StatusCodes.OK).json({ success: true, data: user });
  });

  static getSingleUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { userId } = req.user;

    const requestinguser = await AuthModel.findById(userId);

    if (!requestinguser || requestinguser?.role !== RoleConstands.ADMIN) {
      throw new HttpException(
        StatusCodes.FORBIDDEN,
        "You do not have permission to access this resource.",
      );
    }

    const ExUser = await AuthModel.findById(id)
      .select("-password")
      .populate({
        path: "dictionary",
        limit: 5,
      });

    if (!ExUser) {
      throw new HttpException(StatusCodes.NOT_FOUND, "User not found");
    }

    res.status(StatusCodes.OK).json({
      success: true,
      data: ExUser,
    });
  });
}

module.exports = { AuthController };
