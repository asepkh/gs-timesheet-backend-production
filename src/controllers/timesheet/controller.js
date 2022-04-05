import moment from "moment";
import { Op } from "sequelize";

import { Timesheet } from "../../models";
import { successResponse, errorResponse, toPlain } from "../../helpers";

export const get = async (req, res) => {
  try {
    const page = req.query.page || null,
      limit = req.query.limit || null,
      date = req.query.date,
      userId = req.query.id || req.user.id;

    const timesheets = await Timesheet.findAll({
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

    const result = await toPlain(timesheets).map((d) => ({
      ...d,
      date: moment(d.date).format("YYYY-MM-DD"),
    }));

    return successResponse(req, res, result);
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const create = async (req, res) => {
  try {
    const { timesheets } = req.body,
      id = req.user.id || req.params.id,
      data = await timesheets.map((item) => ({ ...item, userId: id }));

    await console.log(data);

    const result = await Timesheet.bulkCreate(data, {
      updateOnDuplicate: ["workHours", "description", "projectId"],
    });

    return successResponse(req, res, result);
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const remove = async (req, res) => {
  try {
    const id = req.params.id,
      userId = req.user.id,
      date = req.query.date || null;

    const query = date
      ? {
          where: {
            userId,
            date: {
              [Op.and]: {
                [Op.gte]: moment(date).startOf("month"),
                [Op.lte]: moment(date).endOf("month"),
              },
            },
          },
        }
      : { where: id };

    const project = date
      ? await Timesheet.findAndCountAll(query)
      : await Timesheet.findOne(query);

    if (!project) {
      throw new Error("Data not found");
    }

    await Timesheet.destroy(query);

    return successResponse(req, res, {
      id,
      message: "Successfully Deleted",
    });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};
