import { errorResponse } from "../helpers";
import multer from "multer";

const max_size = parseInt(process.env.MULTER_MAX_SIZE) || 5;
const maxSize = max_size * 1024 * 1024;

// eslint-disable-next-line no-unused-vars
const filesUpload = (single = false, uploadFields) => {
  const storage = multer.memoryStorage();
  const typeFileFilters = (req, file, cb) => {
    if (file.fieldname === "images" && !file.mimetype.match("image.*")) {
      req.errorValidation = "Only Image Files Are Allowed";
      return cb(new Error(req.errorValidation.message));
    }

    cb(null, true);
  };

  const upload = single
    ? multer({
        storage,
        fileFilter: typeFileFilters,
        limits: {
          fileSize: parseInt(maxSize),
        },
      }).single(uploadFields)
    : multer({
        storage,
        fileFilter: typeFileFilters,
        limits: {
          fileSize: parseInt(maxSize),
        },
      }).fields(uploadFields);

  return (req, res, next) => {
    upload(req, res, (err) => {
      if (req.errorValidation) return errorResponse(req, res, req.errorValidation, 400, err);

      if (!err && !req.file)
        return errorResponse(req, res, "Please select file to upload", 400, err);

      if (err) {
        if (err.code === "LIMIT_FILE_SIZE")
          return errorResponse(req, res, `Max file sized ${maxSize / 1000000}MB`, 400, err);

        return res.status(400).send(err);
      }

      return next();
    });
  };
};

export default filesUpload;
