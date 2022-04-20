module.exports = (sequelize, DataTypes) => {
  const WorkLocation = sequelize.define("WorkLocation", {
    name: {
      type: DataTypes.INTEGER,
    },
    description: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },
  });
  WorkLocation.associate = function (models) {
    WorkLocation.hasMany(models.Timesheet, {
      as: "workLocation",
      foreignKey: "workLocationId",
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  };
  return WorkLocation;
};
