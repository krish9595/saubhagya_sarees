import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderNumber = searchParams.get("orderId")?.trim().toUpperCase();
    const phone = searchParams.get("phone")?.trim();

    if (!orderNumber) {
      return NextResponse.json({ success: false, message: "Order number is required" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: true,
        statusHistory: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!order) {
      return NextResponse.json({ success: false, message: "No order found with reference " + orderNumber }, { status: 404 });
    }

    // Optional phone validation if provided
    if (phone && order.guestPhone && !order.guestPhone.includes(phone.slice(-6))) {
      return NextResponse.json({ success: false, message: "Phone number does not match order record." }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        totalAmount: Number(order.totalAmount),
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        awbCode: order.awbCode,
        courierName: order.courierName,
        trackingUrl: order.trackingUrl,
        createdAt: order.createdAt,
        items: order.items.map((i) => ({
          id: i.id,
          productName: i.productName,
          quantity: i.quantity,
          totalPrice: Number(i.totalPrice),
          imageUrl: i.imageUrl,
        })),
        statusHistory: order.statusHistory,
      },
    });
  } catch (error) {
    console.error("Order tracking error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
