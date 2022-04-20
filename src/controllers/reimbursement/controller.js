import moment from "moment";
import { Op } from "sequelize";

import { Reimbursement, ReimburseImage, User } from "../../models";
import { successResponse, errorResponse, toPlain } from "../../helpers";

export const get = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || null,
      limit = req.query.limit || null,
      date = req.query.date,
      userId = req.query.id || req.user.id;

    const include = {
      model: ReimburseImage,
      as: "images",
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    };

    const data = await Reimbursement.findAll({
      order: [["date", "ASC"]],
      where: {
        userId,
        date: {
          [Op.and]: {
            [Op.gte]: moment(date).startOf("month"),
            [Op.lte]: moment(date).endOf("month"),
          },
        },
      },
      include,
      ...((page && limit && { offset: (page - 1) * limit, limit }) || {}),
    });

    const result = await toPlain(data).map((d) => ({
      ...d,
      date: moment(d.date).format("YYYY-MM-DD"),
    }));

    return successResponse(req, res, result, {
      page,
      limit,
      totalPages: Math.ceil(result.length / limit) || null,
    });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const create = async (req, res) => {
  try {
    const { images, ...payload } = req.body;
    const reimburse = await Reimbursement.create({ ...payload, userId: req.user.id });

    const imagesPayload = images.map((d) => ({
      reimburseId: reimburse.id,
      url:
        d.url ||
        "https://us.123rf.com/450wm/pavelstasevich/pavelstasevich1811/pavelstasevich181101028/112815904-no-image-available-icon-flat-vector-illustration.jpg",
    }));

    await ReimburseImage.bulkCreate(imagesPayload);

    // const result = { ...reimburse, images: reimburseImages };
    return successResponse(req, res, reimburse);
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const update = async (req, res) => {
  try {
    const { images, ...payload } = req.body,
      id = payload.id || req.params.id;

    const isExist = await Reimbursement.findOne({
      where: { id },
    });

    if (!isExist) {
      throw new Error("Reimbursement not existed");
    }

    await Reimbursement.update(payload, { where: { id } });

    const imagesPayload = await images.map((d) => ({
      reimburseId: id,
      url:
        d.url ||
        "https://us.123rf.com/450wm/pavelstasevich/pavelstasevich1811/pavelstasevich181101028/112815904-no-image-available-icon-flat-vector-illustration.jpg",
    }));

    // Delete existing images first
    await ReimburseImage.destroy({ where: { reimburseId: id } });
    await ReimburseImage.bulkCreate(imagesPayload);

    return successResponse(req, res, req.body);
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const remove = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const reimburse = await Reimbursement.findOne({ where: { id } });

    if (!reimburse) {
      throw new Error("Data not found");
    }

    await Reimbursement.destroy({ where: { id } });

    return successResponse(req, res, {
      id,
      message: "Successfully Deleted",
    });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const getDataSummary = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1,
      limit = req.query.limit || 15,
      date = req.query.date || moment(date),
      id = req.params.id || null;

    const include = {
      model: Reimbursement,
      as: "reimbursements",
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      where: {
        date: {
          [Op.and]: {
            [Op.gte]: moment(date).startOf("month"),
            [Op.lte]: moment(date).endOf("month"),
          },
        },
      },
    };

    const data = id
      ? await User.findOne({
          where: { id },
          include,
        })
      : await User.findAll({
          order: [
            ["firstName", "ASC"],
            ["lastName", "ASC"],
          ],
          include,
          attributes: {
            exclude: [
              "createdAt",
              "updatedAt",
              "email",
              "isVerified",
              "gender",
              "phone",
              "profilePic",
              "isAdmin",
            ],
          },
          ...((page && limit && { offset: (page - 1) * limit, limit }) || {}),
        });

    // console.log(toPlain(data)[0].timesheets);
    const userReimbursements = id ? await toPlain(data) : await toPlain(data).map((d) => d);

    return successResponse(
      req,
      res,
      userReimbursements,
      id
        ? null
        : {
            ...((page &&
              limit && {
                page,
                limit,
                totalPages: Math.ceil(userReimbursements.length / limit) || 0,
              }) ||
              {}),
          }
    );
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};
