import jwt from "jsonwebtoken";
import crypto from "crypto";
import axios from "axios";

import { User } from "../../models";
import { successResponse, errorResponse, uniqueId } from "../../helpers";

export const get = async (req, res) => {
  try {
    const id = req.params.id || null;
    const page = req.query.page || 1,
      limit = req.query.limit || 8;

    const result = id
      ? await User.findOne({ where: { id } })
      : await User.findAndCountAll({
          order: [
            ["firstName", "ASC"],
            ["lastName", "ASC"],
          ],
          offset: (page - 1) * limit,
          limit,
        });

    return successResponse(
      req,
      res,
      result,
      id
        ? null
        : {
            page,
            limit,
            totalPages: Math.ceil(result.count / limit) || null,
          }
    );
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, ...field } = req.body;
    if (process.env.IS_GOOGLE_AUTH_ENABLE === "true") {
      if (!req.body.code) {
        throw new Error("code must be defined");
      }
      const { code } = req.body;
      const customUrl = `${process.env.GOOGLE_CAPTCHA_URL}?secret=${process.env.GOOGLE_CAPTCHA_SECRET_SERVER}&response=${code}`;
      const response = await axios({
        method: "post",
        url: customUrl,
        data: {
          secret: process.env.GOOGLE_CAPTCHA_SECRET_SERVER,
          response: code,
        },
        config: { headers: { "Content-Type": "multipart/form-data" } },
      });
      if (!(response && response.data && response.data.success === true)) {
        throw new Error("Google captcha is not valid");
      }
    }

    const user = await User.findOne({
      where: { email },
    });
    if (user) {
      throw new Error("User already exists with same email");
    }
    const reqPass = crypto.createHash("md5").update(password).digest("hex");
    const payload = {
      email,
      firstName,
      lastName,
      ...field,
      password: reqPass,
      isVerified: false,
      verifyToken: uniqueId(),
    };

    const newUser = await User.create(payload);
    return successResponse(req, res, { newUser });
  } catch (error) {
    console.log(error);
    return errorResponse(req, res, error.message);
  }
};

export const login = async (req, res) => {
  try {
    const user = await User.scope("withSecretColumns").findOne({
      where: { email: req.body.email },
    });
    if (!user) {
      throw new Error("Incorrect Email Id/Password");
    }

    const reqPass = crypto
      .createHash("md5")
      .update(req.body.password || "")
      .digest("hex");

    if (reqPass !== user.password) {
      throw new Error("Incorrect Email Id/Password");
    }
    const token = jwt.sign(
      {
        user: {
          userId: user.id,
          email: user.email,
          createdAt: new Date(),
        },
      },
      process.env.SECRET
    );
    delete user.dataValues.password;
    console.log(token);
    return successResponse(req, res, { user, token });
  } catch (error) {
    console.log(error);
    return errorResponse(req, res, error.message);
  }
};

export const profile = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.scope("withSecretColumns").findOne({
      where: { id: userId },
    });
    return successResponse(req, res, user);
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const changePassword = async (req, res) => {
  try {
    const newPass = crypto
      .createHash("md5")
      .update(req.body.newPassword)
      .digest("hex");

    await User.update({ password: newPass }, { where: { id: req.user.id } });
    return successResponse(req, res, {});
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const update = async (req, res) => {
  try {
    const password = req.body.password
      ? crypto.createHash("md5").update(req.body.password).digest("hex")
      : undefined;
    const id = req.params.id || req.user.id,
      payload = { ...req.body, ...(password ? { password } : {}) };

    const user = await User.findOne({
      where: { id },
    });

    if (!user) {
      throw new Error("User not found");
    }

    await User.update(payload, { where: { id: user.id } });
    return successResponse(req, res, payload);
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const remove = async (req, res) => {
  try {
    const id = req.params.id;

    const user = await User.findOne({
      where: { id },
    });

    if (!user) {
      throw new Error("Project not found");
    }

    await User.destroy({
      where: {
        id,
      },
    });

    return successResponse(req, res, {
      id,
      message: "Successfully Deleted",
    });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};
