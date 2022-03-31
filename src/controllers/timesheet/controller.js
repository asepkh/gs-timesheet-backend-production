import moment from "moment";
import { Op } from "sequelize";
import { Timesheet } from "../../models";
import { successResponse, errorResponse } from "../../helpers";

export const get = async (req, res) => {
  try {
    const page = req.query.page || null,
      limit = req.query.limit || null,
      date = req.query.date,
      userId = req.query.id || req.user.id;

    const timesheets = await Timesheet.findAndCountAll({
      order: [
        ["createdAt", "DESC"],
        ["date", "ASC"],
      ],
      where: {
        userId,
        date: {
          [Op.and]: {
            [Op.gte]: moment(date).startOf("month"),
            [Op.lte]: moment(date).endOf("month"),
          },
        },
      },
      ...((page && limit && { offset: (page - 1) * limit, limit }) || {}),
    });
    return successResponse(req, res, timesheets);
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const create = async (req, res) => {
  try {
    const { timesheets } = req.body,
      user = req.user,
      data = await timesheets.map((item) => ({ ...item, userId: user.userId }));

    await console.log(data);

    const result = await Timesheet.bulkCreate(data, {
      updateOnDuplicate: ["userId", "date"],
    });

    return successResponse(req, res, result);
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};
