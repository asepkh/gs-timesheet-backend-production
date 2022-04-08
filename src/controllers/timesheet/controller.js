import moment from "moment";
import { Op } from "sequelize";

import { Timesheet, User } from "../../models";
import {
  successResponse,
  errorResponse,
  toPlain,
  calendarCalculation,
  sumArrayOfObject,
} from "../../helpers";

const transformTimesheet = (d) => {
  const totalHours = sumArrayOfObject(d.timesheets, "workHours") || 0;
  return {
    ...d,
    timesheets: {
      totalHours,
      descriptions: d.timesheets
        .map((t) =>
          t.izin !== "hadir" || t.description !== null
            ? {
                date: t.date,
                description: `${
                  t.izin.charAt(0).toUpperCase() + t.izin.slice(1)
                } - ${t.description || "Tanpa Keterangan"}`,
              }
            : null
        )
        .filter((t) => t !== null),
      cuti: d.timesheets.filter((t) => t.izin === "cuti").length,
      izin: d.timesheets.filter((t) => t.izin === "izin").length,
      sakit: d.timesheets.filter((t) => t.izin === "sakit").length,
      hadir: d.timesheets.filter((t) => t.izin === "hadir").length,
    },
  };
};

export const get = async (req, res) => {
  try {
    const page = req.query.page || null,
      limit = req.query.limit || null,
      date = req.query.date,
      userId = req.query.id || req.user.id;

    const data = await Timesheet.findAll({
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
      ...((page && limit && { offset: (page - 1) * limit, limit }) || {}),
    });

    const timesheets = await toPlain(data).map((d) => ({
      ...d,
      date: moment(d.date).format("YYYY-MM-DD"),
    }));

    const calendarData = await calendarCalculation(date);
    const result = {
      timesheets,
      timesheetsTotal: sumArrayOfObject(timesheets, "workHours"),
      overtimeTotal:
        sumArrayOfObject(timesheets, "workHours") - calendarData.totalHours,
      ...calendarData,
    };

    return successResponse(req, res, result, {
      page,
      limit,
      totalPages: Math.ceil(result.count / limit) || null,
    });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const create = async (req, res) => {
  try {
    const { timesheets } = req.body,
      id = req.user.id || req.params.id,
      data = await timesheets.map((item) => ({ ...item, userId: id }));

    // await console.log(data);

    const result = await Timesheet.bulkCreate(data, {
      updateOnDuplicate: [
        "workHours",
        "description",
        "projectId",
        "izin",
        "workLocationId",
      ],
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

    const query = !id
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
      : { where: { id } };

    const project = id
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

export const getDataSummary = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1,
      limit = req.query.limit || 8,
      date = req.query.date || moment(date),
      id = req.params.id || null;

    const include = {
      model: Timesheet,
      as: "timesheets",
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
    const userTimesheets = id
      ? await transformTimesheet(toPlain(data))
      : await toPlain(data).map((d) => transformTimesheet(d));

    const calendarData = await calendarCalculation(date);
    return successResponse(
      req,
      res,
      userTimesheets,
      id
        ? null
        : {
            page,
            limit,
            totalPages: Math.ceil(userTimesheets.length / limit) || null,
            ...calendarData,
          }
    );
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};
