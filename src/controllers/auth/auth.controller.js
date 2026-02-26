const { StatusCodes } = require("http-status-codes");
const { asyncHandler } = require("../../utils/async-handler");
const { HttpException } = require("../../utils/http-exception");
const { AuthModel } = require("../../models/auth/auth.model");
const { genSalt, hash, compare } = require("bcryptjs");
const { RoleConstands } = require("../../utils/constands");
const { sign } = require("jsonwebtoken");
const { JWT_SECRET_KEY, REG_KEY } = require("../../utils/secret");

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

    const isMatch = await compare(password, ExAdmin.password);

    if (!isMatch) {
      throw new HttpException(
        StatusCodes.UNAUTHORIZED,
        "Invalid telephone or password",
      );
    }

    const createToken = await sign({ userId: ExAdmin._id }, JWT_SECRET_KEY, {
      expiresIn: "24h",
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

    const requestingUser = await AuthModel.findById(userId);

    if (
      !requestingUser ||
      (requestingUser && requestingUser?.role !== RoleConstands.ADMIN)
    ) {
      throw new HttpException(
        StatusCodes.FORBIDDEN,
        "You do not have permission to access this resource.",
      );
    }

    const ExUser = await AuthModel.findById(id).select("-password").populate({
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

  static getAllUsers = asyncHandler(async (req, res) => {
    const { search, page = 1, limit = 10, role } = req.query;
    const { userId } = req.user;

    const requestingUser = await AuthModel.findById(userId);

    if (
      !requestingUser ||
      (requestingUser && requestingUser.role !== RoleConstands.ADMIN)
    ) {
      throw new HttpException(
        StatusCodes.FORBIDDEN,
        "You are not authorized to access this resource",
      );
    }

    const query = {};

    if (search && search.trim()) {
      query.$or = [
        { name: { $regex: search.trim(), $options: "i" } },
        { telephone: { $regex: search.trim(), $options: "i" } },
      ];
    }

    if (role) {
      query.role = role;
    }

    const exUsers = await AuthModel.find(query)
      .select("-password -dictionary")
      .skip((page - 1) * limit)
      .limit(limit);

    const totalCount = await AuthModel.countDocuments(query);

    res.status(StatusCodes.OK).json({
      success: true,
      data: exUsers,
      pagination: {
        totalCount,
        page: Number(page),
        limit: Number(limit),
        totalPage: Math.ceil(totalCount / limit),
        hasPrev: page > 1,
        hasNext: page * limit < totalCount,
      },
    });
  });

  static updateMePhone = asyncHandler(async (req, res) => {
    const { newPhone, password } = req.body;
    const { userId } = req.user;

    const exUser = await AuthModel.findOne({ telephone: newPhone });

    if (exUser) {
      throw new HttpException(
        StatusCodes.CONFLICT,
        "An account with this telephone number already exists.",
      );
    }

    const requestingUser = await AuthModel.findById(userId);

    const isMatch = await compare(password, requestingUser.password);

    if (!isMatch) {
      throw new HttpException(StatusCodes.UNAUTHORIZED, "Invalid password");
    }

    await AuthModel.findByIdAndUpdate(userId, { telephone: newPhone });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Phone number updated successfully",
    });
  });

  static updateMePassword = asyncHandler(async (req, res) => {
    const { newPassword, currentPassword } = req.body;
    const { userId } = req.user;

    if (newPassword === currentPassword) {
      throw new HttpException(
        StatusCodes.BAD_REQUEST,
        "New password must be different from the current password.",
      );
    }

    const requestingUser = await AuthModel.findById(userId);

    const isMatch = await compare(currentPassword, requestingUser.password);

    if (!isMatch) {
      throw new HttpException(StatusCodes.UNAUTHORIZED, "Invalid password");
    }

    const salt = await genSalt(10);
    const hashedPassword = await hash(newPassword, salt);

    await AuthModel.findByIdAndUpdate(userId, { password: hashedPassword });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "password update successfully",
    });
  });

  static deleteMe = asyncHandler(async (req, res) => {
    const { userId } = req.user;

    await AuthModel.findByIdAndDelete(userId);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "account deleted successfully",
    });
  });
}

module.exports = { AuthController };
