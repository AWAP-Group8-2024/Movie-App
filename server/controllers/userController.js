import { hash, compare } from "bcrypt";
import {
  insertUser,
  searchUserByEmail,
  searchUserById,
  deleteUserById,
  isEmailExisting,
} from "../models/User.js";
import { ApiError } from "../helpers/apiError.js";
import jwt from "jsonwebtoken";
const { sign } = jwt;

const registration = async (req, res, next) => {
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
    const emailExists = await isEmailExisting(email);
    if (emailExists) {
      return next(new ApiError("Email already exists", 409));
    }

    const hashedPassword = await hash(password, 10);
    const result = await insertUser(email, hashedPassword);
    const user = result.rows[0];
    return res.status(201).json(createUserObj(user.id, user.email));
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await searchUserByEmail(email);

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

const getUserProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await searchUserById(id);
    if (result.rowCount === 0) {
      return next(new ApiError("User not found", 404));
    }
    const user = result.rows[0];
    const profile = createProfileObj(
      user.id,
      user.email,
      user.password,
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

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params; //session user id
    const { email, password } = req.body;

    const result = await searchUserByEmail(email);
    if (result.rowCount === 0)
      return next(new ApiError("Invalid credentials", 400));

    const user = result.rows[0];
    const isPasswordValid = await compare(password, user.password); //compare password from account delete form with session user password
    if (!isPasswordValid) return next(new ApiError("Invalid password", 401));
    await deleteUserById(id);
    const response = {
      user: req.user,
      message: `User ID ${req.user.id} deleted successfully.`,
    };
    return res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
};

const createUserObj = (id, email, token = undefined) => {
  return {
    id: id,
    email: email,
    ...(token !== undefined && { token: token }),
  };
};

const createProfileObj = (id, email, password, firstname, lastname) => {
  return {
    id: id,
    email: email,
    password: password,
    firstname: firstname,
    lastname: lastname,
  };
};

const isEmailValid = (email) => {
  return email && email.trim().length > 0;
};

const isPasswordValid = (password) => {
  const regex = /^(?=.*[A-Z])(?=.*[0-9]).*$/;
  return regex.test(password);
};

export { registration, login, getUserProfile, deleteUser, createUserObj };
