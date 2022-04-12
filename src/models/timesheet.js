module.exports = (sequelize, DataTypes) => {
  const Timesheet = sequelize.define("Timesheet", {
    workHours: {
      type: DataTypes.INTEGER,
    },
    description: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },
    izin: {
      type: DataTypes.ENUM("hadir", "sakit", "izin", "cuti"),
      defaultValue: "hadir",
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });
  Timesheet.associate = function (models) {
    Timesheet.belongsTo(models.WorkLocation, { as: "workLocation" });
  };
  return Timesheet;
};
