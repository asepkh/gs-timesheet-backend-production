const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
// eslint-disable-next-line import/no-dynamic-require
const config = require(`${__dirname}/../config/config.js`)[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

fs.readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// relationships for models
//= ==============================
// Define all relationships here below
//= ==============================

// db.User.hasMany(db.Reimbursement, {
//   as: "reimbursements",
//   foreignKey: "userId",
//   onUpdate: "CASCADE",
//   onDelete: "CASCADE",
// });

// db.User.hasMany(db.Timesheet, {
//   as: "timesheets",
//   foreignKey: "userId",
//   onUpdate: "CASCADE",
//   onDelete: "CASCADE",
// });

// db.Project.hasMany(db.Timesheet, {
//   as: "project",
//   foreignKey: "projectId",
//   onDelete: "CASCADE",
// });

// db.Reimbursement.hasMany(db.ReimburseImage, {
//   as: "images",
//   foreignKey: "reimburseId",
//   onUpdate: "CASCADE",
//   onDelete: "CASCADE",
// });

// db.Timesheet.belongsTo(db.WorkLocation, { as: "workLocation" });
// db.WorkLocation.hasMany(db.Timesheet, {
//   as: "workLocation",
//   foreignKey: "workLocationId",
//   onUpdate: "CASCADE",
//   onDelete: "CASCADE",
// });

module.exports = db;
