import { Project } from "../../models";
import { successResponse, errorResponse } from "../../helpers";

export const get = async (req, res) => {
  try {
    const id = req.params.id || null;
    const page = req.query.page || null,
      limit = req.query.limit || null;

    const result = req.params.id
      ? await Project.findOne({ where: { id } })
      : await Project.findAndCountAll({
          order: [
            ["createdAt", "DESC"],
            ["name", "ASC"],
          ],
          ...((page && limit && { offset: (page - 1) * limit, limit }) || {}),
        });
    return successResponse(req, res, result);
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const create = async (req, res) => {
  try {
    const payload = req.body,
      { name } = payload;
    const project = await Project.findOne({
      where: { name },
    });

    if (project) {
      throw new Error("Project already exists with same name");
    }

    const result = await Project.create(payload);
    console.log(result);

    return successResponse(req, res, result);
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const remove = async (req, res) => {
  try {
    const id = req.params.id;

    const project = await Project.findOne({
      where: { id },
    });

    if (!project) {
      throw new Error("Project not found");
    }

    await Project.destroy({
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

    const user = await Project.findOne({
      where: { id },
    });

    if (!user) {
      throw new Error("Project not found");
    }

    await Project.update(payload, { where: { id: user.id } });
    return successResponse(req, res, payload);
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};
