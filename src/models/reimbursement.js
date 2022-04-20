module.exports = (sequelize, DataTypes) => {
  const Reimbursement = sequelize.define("Reimbursement", {
    value: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      defaultValue: "-",
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });
  Reimbursement.associate = function (models) {
    Reimbursement.hasMany(models.ReimburseImage, {
      as: "images",
      foreignKey: "reimburseId",
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  };
  return Reimbursement;
};
