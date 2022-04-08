module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.bulkInsert(
      "WorkLocations",
      [
        {
          name: "Work From Home",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Kantor Ciputat, Tanggerang Selatan",
          description: "Rumah Burung",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Kantor Tanah Tinggi, Jakarta Pusat",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    ),

  down: (queryInterface, Sequelize) =>
    queryInterface.bulkDelete("WorkLocations", null, {}),
};
