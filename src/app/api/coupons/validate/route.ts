import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code")?.trim().toUpperCase();
    const subtotal = parseFloat(searchParams.get("subtotal") || "0");

    if (!code) {
      return NextResponse.json({ success: false, message: "Coupon code is required" }, { status: 400 });
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code },
    });

    if (!coupon || !coupon.isActive) {
      return NextResponse.json({ success: false, message: "Invalid or inactive promo code." }, { status: 404 });
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return NextResponse.json({ success: false, message: "This coupon code has expired." }, { status: 400 });
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return NextResponse.json({ success: false, message: "This promo code usage limit has been reached." }, { status: 400 });
    }

    const minVal = Number(coupon.minOrderValue);
    if (subtotal < minVal) {
      return NextResponse.json({
        success: false,
        message: `Minimum cart value of ₹${minVal.toLocaleString("en-IN")} required for this coupon.`,
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: Number(coupon.discountValue),
        minOrderValue: minVal,
        maxDiscount: coupon.maxDiscount ? Number(coupon.maxDiscount) : null,
      },
      message: `Coupon applied: ${coupon.description || coupon.code}`,
    });
  } catch (error) {
    console.error("Coupon validation error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
