import { WorkLocation } from "../../models";
import { successResponse, errorResponse } from "../../helpers";

export const get = async (req, res) => {
  try {
    const id = req.params.id || null;
    const page = req.query.page || null,
      limit = req.query.limit || null;

    const result = req.params.id
      ? await WorkLocation.findOne({ where: { id } })
      : await WorkLocation.findAndCountAll({
          order: [
            ["name", "ASC"],
            ["createdAt", "DESC"],
          ],
          ...((page && limit && { offset: (page - 1) * limit, limit }) || {}),
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

export const create = async (req, res) => {
  try {
    const payload = req.body,
      { name } = payload;
    const workLocation = await WorkLocation.findOne({
      where: { name },
    });

    if (workLocation) {
      throw new Error("Work location already exists with same name");
    }

    const result = await WorkLocation.create(payload);
    console.log(result);

    return successResponse(req, res, result);
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const remove = async (req, res) => {
  try {
    const id = req.params.id;

    const workLocation = await WorkLocation.findOne({
      where: { id },
    });

    if (!workLocation) {
      throw new Error("Work location not found");
    }

    await WorkLocation.destroy({
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

export const update = async (req, res) => {
  try {
    const id = req.params.id || null,
      payload = req.body;

    const user = await WorkLocation.findOne({
      where: { id },
    });

    if (!user) {
      throw new Error("Work location not found");
    }

    await WorkLocation.update(payload, { where: { id: user.id } });
    return successResponse(req, res, payload);
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};
