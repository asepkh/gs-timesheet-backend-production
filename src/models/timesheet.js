module.exports = (sequelize, DataTypes) => {
  const Timesheet = sequelize.define("Timesheet", {
    workHours: {
      type: DataTypes.INTEGER,
    },
    description: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });
  Timesheet.associate = function (models) {
    // associations can be defined here
  };
  return Timesheet;
};
