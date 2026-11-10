import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const sections = await prisma.homepageSection.findMany();
    return NextResponse.json({ success: true, sections });
  } catch (error) {
    console.error("Fetch CMS sections error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch CMS content" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { sectionKey, contentJson } = await req.json();
    if (!sectionKey || !contentJson) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const updated = await prisma.homepageSection.update({
      where: { sectionKey },
      data: { contentJson: typeof contentJson === "string" ? contentJson : JSON.stringify(contentJson) },
    });

    await prisma.auditLog.create({
      data: {
        action: "UPDATE",
        entity: "HomepageSection",
        entityId: updated.id,
        details: `Updated CMS section "${sectionKey}".`,
      },
    });

    return NextResponse.json({ success: true, section: updated });
  } catch (error) {
    console.error("Update CMS section error:", error);
    return NextResponse.json({ success: false, message: "Failed to save CMS content" }, { status: 500 });
  }
}
