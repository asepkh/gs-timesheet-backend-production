module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable("ReimburseImages", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      url: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      reimburseId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Reimbursements",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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
  down: (queryInterface) => queryInterface.dropTable("ReimburseImages"),
};
