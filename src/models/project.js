module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define("Project", {
    name: {
      type: DataTypes.INTEGER,
    },
    description: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },
  });
  Project.associate = function (models) {
    Project.hasMany(models.Timesheet, {
      as: "project",
      foreignKey: "projectId",
      onDelete: "CASCADE",
    });
  };
  return Project;
};
