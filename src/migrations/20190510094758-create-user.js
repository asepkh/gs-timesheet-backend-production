module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      firstName: {
        defaultValue: null,
        type: Sequelize.STRING,
      },
      lastName: {
        defaultValue: null,
        type: Sequelize.STRING,
      },
      email: {
        defaultValue: null,
        type: Sequelize.STRING,
      },
      password: {
        defaultValue: null,
        type: Sequelize.STRING,
      },
      profilePic: {
        type: Sequelize.STRING,
        defaultValue:
          "https://freepikpsd.com/file/2019/10/default-profile-picture-png-1-Transparent-Images.png",
      },
      role: {
        defaultValue: null,
        type: Sequelize.STRING,
      },
      isAdmin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable("Users"),
};
