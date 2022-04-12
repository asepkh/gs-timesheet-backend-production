module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define("Project", {
    name: {
      type: DataTypes.INTEGER,
    },
    description: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
  });
  Project.associate = function (models) {
    // associations can be defined here
    Project.hasMany(models.Timesheet, {
      as: "project",
      foreignKey: "projectId",
      onDelete: "CASCADE",
    });
  };
  return Project;
};
