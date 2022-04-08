module.exports = (sequelize, DataTypes) => {
  const WorkLocation = sequelize.define("WorkLocation", {
    name: {
      type: DataTypes.INTEGER,
    },
    description: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
  });
  WorkLocation.associate = function (models) {
    // associations can be defined here
    WorkLocation.hasMany(models.Timesheet, {
      foreignKey: "workLocationId",
      onDelete: "CASCADE",
    });
  };
  return WorkLocation;
};
