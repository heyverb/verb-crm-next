import { OtpModel } from "@/backend/db/otp";
import { getErrorMessage } from "@/lib/error.helper";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, otp } = body;

  console.log("body", body);

  try {
    const Otpmodel = new OtpModel();
    const otpData: { otp: string; email: string } | undefined =
      await Otpmodel.getOtp(email);
    if (!otpData) {
      return NextResponse.json({ message: "Otp not found" }, { status: 404 });
    }
    if (otpData.otp !== otp) {
      return NextResponse.json(
        { message: "Otp is not valid" },
        { status: 400 }
      );
    }
    await Otpmodel.deleteOtp(email);

    return NextResponse.json(
      { message: "Otp verified successfully" },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json({ message: getErrorMessage(e) }, { status: 500 });
  }
}
