export const runtime = "nodejs";

import { getErrorMessage } from "@/lib/error.helper";
import MailService from "@/backend/services/mailer.service";
import { NextResponse } from "next/server";
import { OtpModel } from "@/backend/db/otp";

export async function POST(req: Request) {
  const body = await req.json();
  const { email } = body;

  try {
    const mail = new MailService();
    const Otpmodel = new OtpModel();
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await Otpmodel.updateOtp(email, otp);
    await mail.sendOtpEmail(email, otp);
    return NextResponse.json(
      { message: "Otp sent successfully" },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json({ message: getErrorMessage(e) }, { status: 500 });
  }
}
