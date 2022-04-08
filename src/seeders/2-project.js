module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.bulkInsert(
      "Projects",
      [
        {
          name: "Self Learning",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "RiaMiranda",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    ),

  down: (queryInterface, Sequelize) =>
    queryInterface.bulkDelete("Projects", null, {}),
};
