import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || !email.includes("@")) {
      return NextResponse.json({ success: false, message: "Valid email address required" }, { status: 400 });
    }

    const trimmed = email.trim().toLowerCase();
    await prisma.newsletterSubscriber.upsert({
      where: { email: trimmed },
      update: { isActive: true },
      create: {
        email: trimmed,
        source: "HOMEPAGE_FOOTER",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Thank you for joining our exclusive bridal & festive inner circle!",
    });
  } catch (error) {
    console.error("Newsletter error:", error);
    return NextResponse.json({ success: false, message: "Subscription failed. Please try again." }, { status: 500 });
  }
}
