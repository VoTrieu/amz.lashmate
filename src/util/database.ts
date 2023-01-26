import { Sequelize } from "sequelize";

const sequelize = new Sequelize("amz_lashmate", "root", "Admin@123", {
  dialect: "mysql",
  host: "localhost",
});

export default sequelize;