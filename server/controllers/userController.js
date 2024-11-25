import { hash, compare } from "bcrypt";
import * as UserModel from "../models/User.js";
import { ApiError } from "../helpers/apiError.js";
import jwt from "jsonwebtoken";
const { sign } = jwt;

export const registration = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!isEmailValid(email)) {
      return next(new ApiError("Invalid email format", 400));
    }
    if (!isPasswordValid(password)) {
      return next(
        new ApiError(
          "Invalid password. The password should contain at least one capital letter and number.",
          400
        )
      );
    }
    const emailExists = await UserModel.isEmailExisting(email);
    if (emailExists) {
      return next(new ApiError("Email already exists", 409));
    }

    const hashedPassword = await hash(password, 10);
    const result = await UserModel.insertUser(email, hashedPassword);
    const user = result.rows[0];
    return res.status(201).json(createUserObj(user.id, user.email));
  } catch (error) {
    return next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await UserModel.searchUserByEmail(email);

    if (result.rowCount === 0)
      return next(new ApiError("Invalid credentials", 400));

    const user = result.rows[0];
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) return next(new ApiError("Invalid password", 401));

    const payload = { id: user.id, email: user.email };
    const token = sign(payload, process.env.JWT_SECRET);

    return res.status(200).json(createUserObj(user.id, user.email, token));
  } catch (error) {
    return next(error);
  }
};

export const getUserProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await UserModel.searchUserById(id);
    if (result.rowCount === 0) {
      return next(new ApiError("User not found", 404));
    }
    const user = result.rows[0];
    const profile = createProfileObj(
      user.id,
      user.email,
      user.firstname,
      user.lastname,
      user.address,
      user.phone
    );
    return res.status(200).json(profile);
  } catch (error) {
    return next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.user;
    await UserModel.deleteUserById(id);
    const response = {
      user: req.user,
      message: `User ID ${req.user.id} deleted successfully.`,
    };
    return res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
};

export const passwordCheck = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await UserModel.searchUserByEmail(email);

    if (result.rowCount === 0)
      return next(new ApiError("Invalid credentials", 400));

    const user = result.rows[0];
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) return next(new ApiError("Invalid password", 401));
    const response = {
      user: req.user,
      message: `ID:${req.user.id} user is confirmed.`,
    };
    return res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const updateInfo = { ...req.body };

    if (Object.keys(updateInfo).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    if (updateInfo.password) {
      updateInfo.password = await hash(updateInfo.password, 10);
    }

    const updatedUser = await UserModel.updateUserById(id, updateInfo);

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json({ message: "Error updating profile" });
  }
};

export const getGroupPendingRequests = async (req, res) => {
  try {
    const { id } = req.user;
    const result = await UserModel.getGroupPendingRequestsById(id);
    console.log(result);
    if (result.rowCount == 0) {
      return res.status(404).json({ message: "No group pending requests" });
    }

    return res.status(200).json(result);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error get group pending requests" });
  }
};

export const createUserObj = (id, email, token = undefined) => {
  return {
    id: id,
    email: email,
    ...(token !== undefined && { token: token }),
  };
};

export const createProfileObj = (
  id,
  email,
  firstname,
  lastname,
  address,
  phone
) => {
  return {
    id: id,
    email: email,
    firstname: firstname,
    lastname: lastname,
    address: address,
    phone: phone,
  };
};

export const isEmailValid = (email) => {
  return email && email.trim().length > 0;
};

export const isPasswordValid = (password) => {
  const regex = /^(?=.*[A-Z])(?=.*[0-9]).*$/;
  return regex.test(password);
};
