import moment from "moment";
import api from "../services/api";

export const successResponse = (req, res, data, any = {}, code = 200) =>
  res.send({
    code,
    data,
    success: true,
    ...any,
  });

export const errorResponse = (
  req,
  res,
  errorMessage = "Something went wrong",
  code = 500,
  error = {}
) =>
  res.status(500).json({
    code,
    errorMessage,
    error,
    data: null,
    success: false,
  });

export const validateEmail = (email) => {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const validateFields = (object, fields) => {
  const errors = [];
  fields.forEach((f) => {
    if (!(object && object[f])) {
      errors.push(f);
    }
  });
  return errors.length ? `${errors.join(", ")} are required fields.` : "";
};

export const uniqueId = (length = 13) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const toPlain = (response) => {
  const flattenDataValues = ({ dataValues }) => {
    const flattenedObject = {};

    Object.keys(dataValues).forEach((key) => {
      const dataValue = dataValues[key];

      if (
        Array.isArray(dataValue) &&
        dataValue[0] &&
        dataValue[0].dataValues &&
        typeof dataValue[0].dataValues === "object"
      ) {
        flattenedObject[key] = dataValues[key].map(flattenDataValues);
      } else if (
        dataValue &&
        dataValue.dataValues &&
        typeof dataValue.dataValues === "object"
      ) {
        flattenedObject[key] = flattenDataValues(dataValues[key]);
      } else {
        flattenedObject[key] = dataValues[key];
      }
    });

    return flattenedObject;
  };

  return Array.isArray(response)
    ? response.map(flattenDataValues)
    : flattenDataValues(response);
};

export const workdayCount = (start, end) => {
  var first = start.clone().endOf("week"); // end of first week
  var last = end.clone().startOf("week"); // start of last week
  var days = (last.diff(first, "days") * 5) / 7; // this will always multiply of 7
  var wfirst = first.day() - start.day(); // check first week
  if (start.day() == 0) --wfirst; // -1 if start with sunday
  var wlast = end.day() - last.day(); // check last week
  if (end.day() == 6) --wlast; // -1 if end with saturday
  return wfirst + Math.floor(days) + wlast; // get the total
};

export const sumArrayOfObject = (arr, key) =>
  arr.reduce((a, b) => +a + +b[key], 0) || null;

export const calendarCalculation = async (date) => {
  const startDate = moment(date).startOf("month"),
    endDate = moment(date).endOf("month"),
    isWeekend = (date) =>
      moment(date).isoWeekday() === 6 || moment(date).isoWeekday() === 7;

  try {
    const allHolidays = await api.get(
      "http://api-harilibur.vercel.app",
      "/api",
      {
        params: {
          month: moment(date).format("M"),
          year: moment(date).format("YYYY"),
        },
      }
    );

    const nationalHolidays = await allHolidays
      .filter((d) => d.is_national_holiday)
      .map((d) => ({
        ...d,
        holiday_name:
          d.holiday_name.slice(0, 27) +
          (d.holiday_name.length > 28 ? ".." : ""),
      }));

    const totalDays = moment(endDate).daysInMonth();
    const totalWorkDays =
      workdayCount(startDate, endDate) -
      nationalHolidays.filter((d) => !isWeekend(d.holiday_date)).length;
    const totalHolidays = totalDays - totalWorkDays;
    const totalWorkHours = totalWorkDays * 8;

    return {
      nationalHolidays,
      totalNationalHolidays: nationalHolidays.length || 0,
      totalWorkDays,
      totalHolidays,
      totalDays,
      totalWorkHours,
    };
  } catch (error) {
    const totalWorkDays = workdayCount(startDate, endDate);
    const totalHolidays = endDate.diff(startDate, "days") - totalWorkDays;
    const totalWorkHours = totalWorkDays * 8;
    const totalDays = moment(endDate).diff(startDate, "days");

    return {
      error,
      totalWorkDays,
      totalHolidays,
      totalDays,
      totalWorkHours,
    };
  }
};
