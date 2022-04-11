const Sequelize = require('sequelize');

const sequelize = new Sequelize(
  use_env_variable: "DATABASE_URL",
  dialect: "postgres",
  protocol: "postgres",
  ssl: true,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
);

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });
