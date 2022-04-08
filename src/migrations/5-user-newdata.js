module.exports = {
  up: (queryInterface, Sequelize) =>
    Promise.all([
      queryInterface.addColumn("Users", "phone", {
        type: Sequelize.STRING,
        defaultValue: "-",
      }),
      queryInterface.addColumn("Users", "gender", {
        type: Sequelize.ENUM("Male", "Female"),
        defaultValue: "Male",
        allowNull: false,
      }),
    ]),

  down: (queryInterface, Sequelize) =>
    Promise.all([
      queryInterface.removeColumn("Users", "phone"),
      queryInterface.removeColumn("Users", "gender"),
    ]),
};
