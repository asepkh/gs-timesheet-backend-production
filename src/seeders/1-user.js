module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.bulkInsert(
      "Users",
      [
        {
          firstName: "Asep",
          lastName: "Khairul Anam",
          email: "asepkhair@gmail.com",
          password: "e10adc3949ba59abbe56e057f20f883e",
          isAdmin: true,
          role: "Frontend Developer",
          phone: "089665311925",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: "User",
          lastName: "User",
          email: "user@gmail.com",
          password: "e10adc3949ba59abbe56e057f20f883e",
          isAdmin: false,
          role: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: "Admin",
          lastName: "User",
          email: "admin@gmail.com",
          password: "e10adc3949ba59abbe56e057f20f883e",
          isAdmin: true,
          role: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    ),

  down: (queryInterface, Sequelize) =>
    queryInterface.bulkDelete("Users", null, {}),
};
