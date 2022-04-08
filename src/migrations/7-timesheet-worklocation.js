module.exports = {
  up: (queryInterface, Sequelize) =>
    Promise.all([
      queryInterface.addColumn("Timesheets", "workLocationId", {
        type: Sequelize.INTEGER,
        references: {
          model: "WorkLocations",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        defaultValue: null,
      }),
      queryInterface.addColumn("Timesheets", "izin", {
        type: Sequelize.ENUM("hadir", "sakit", "izin", "cuti"),
        defaultValue: "hadir",
      }),
    ]),

  down: (queryInterface, Sequelize) =>
    Promise.all([
      queryInterface.removeColumn("Timesheets", "workLocationId"),
      queryInterface.removeColumn("Timesheets", "izin"),
    ]),
};
