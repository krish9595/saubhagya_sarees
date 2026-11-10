import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, coupons });
  } catch (error) {
    console.error("Fetch coupons error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch coupons" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { code, description, discountType, discountValue, minOrderValue, maxDiscount } = await req.json();

    if (!code || !discountValue) {
      return NextResponse.json({ success: false, message: "Coupon code and discount value required" }, { status: 400 });
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: code.trim().toUpperCase(),
        description: description || null,
        discountType: discountType || "PERCENTAGE",
        discountValue: parseFloat(discountValue),
        minOrderValue: parseFloat(minOrderValue || "0"),
        maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
        isActive: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "CREATE",
        entity: "Coupon",
        entityId: coupon.id,
        details: `Created coupon ${coupon.code} (${coupon.discountValue} ${coupon.discountType}).`,
      },
    });

    return NextResponse.json({ success: true, coupon });
  } catch (error) {
    console.error("Create coupon error:", error);
    return NextResponse.json({ success: false, message: "Failed to create coupon" }, { status: 500 });
  }
}
