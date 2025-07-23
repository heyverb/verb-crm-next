import { OtpModel } from "./otp";

const otpDb = new OtpModel();
otpDb
  .init()
  .then(async () => {
    console.log("Otp database initialized");
    await otpDb.deleteAllOtp();
    await otpDb
      .createOtp("test", "22")
      .then(() => {
        console.log("Otpmodel test data created.");
      })
      .catch((err) => {
        console.error("Error creating test data:", err);
      });
  })
  .catch((err) => {
    console.error("Error initializing Otp database:", err);
  });
