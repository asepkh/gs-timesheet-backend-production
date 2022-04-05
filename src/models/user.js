module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      profilePic: {
        type: DataTypes.STRING,
        defaultValue:
          "https://freepikpsd.com/file/2019/10/default-profile-picture-png-1-Transparent-Images.png",
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      verifyToken: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: "-",
      },
      phone: {
        type: DataTypes.STRING,
        defaultValue: "-",
      },
      gender: {
        type: DataTypes.ENUM("Male", "Female"),
        defaultValue: "Male",
        allowNull: false,
      },
    },
    {
      defaultScope: {
        attributes: { exclude: ["password", "verifyToken"] },
      },
      scopes: {
        withSecretColumns: {
          attributes: { include: ["password", "verifyToken"] },
        },
      },
    }
  );
  User.associate = function (models) {
    User.hasMany(models.Timesheet, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
  };
  return User;
};
