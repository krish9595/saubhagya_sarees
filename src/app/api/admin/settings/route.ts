import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const settings = await prisma.storeSetting.findMany();
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("Fetch settings error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const settingsObj = await req.json();

    for (const [key, value] of Object.entries(settingsObj)) {
      await prisma.storeSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      });
    }

    await prisma.auditLog.create({
      data: {
        action: "UPDATE",
        entity: "StoreSetting",
        details: "Store administrative configurations updated.",
      },
    });

    return NextResponse.json({ success: true, message: "Settings saved successfully" });
  } catch (error) {
    console.error("Save settings error:", error);
    return NextResponse.json({ success: false, message: "Failed to save settings" }, { status: 500 });
  }
}
