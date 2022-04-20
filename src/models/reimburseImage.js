module.exports = (sequelize, DataTypes) => {
  const ReimburseImage = sequelize.define("ReimburseImage", {
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  });
  ReimburseImage.associate = function (models) {};
  return ReimburseImage;
};
