import { Sequelize, DataTypes } from "sequelize";
import path from "path";

const databasePath = path.join(
  process.cwd(),
  "src/backend/db/otp",
  "otp.sqlite"
);

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: databasePath,
});

const Otpmodel = sequelize.define(
  "otp",
  {
    email: DataTypes.STRING,
    otp: DataTypes.STRING,
  },
  {
    tableName: "otp",
  }
);

export class OtpModel {
  constructor() {
    this.init();
  }

  async init() {
    console.log("Initializing OtpModel...");

    await sequelize.sync();
    console.log("sequelize synchronized with the database.");

    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    await Otpmodel.sync();
    console.log("Otpmodel synchronized with the database.");
  }

  async createOtp(email: string, otp: string) {
    await sequelize.sync();
    return await Otpmodel.create({ email, otp });
  }

  async getOtp(email: string): Promise<{ otp: string; email: string } | any> {
    await sequelize.sync();
    return await Otpmodel.findOne({ where: { email } });
  }

  async deleteOtp(email: string) {
    await sequelize.sync();
    return await Otpmodel.destroy({ where: { email } });
  }

  async deleteAllOtp() {
    await sequelize.sync();
    return await Otpmodel.truncate({});
  }

  async updateOtp(email: string, otp: string) {
    await sequelize.sync();
    return await Otpmodel.update({ otp }, { where: { email } });
  }

  async getAllOtps() {
    await sequelize.sync();
    return await Otpmodel.findAll();
  }
}
