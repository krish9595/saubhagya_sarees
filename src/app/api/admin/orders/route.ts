import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const where: any = {};
    if (status && status !== "ALL") {
      where.status = status;
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: true,
        statusHistory: { orderBy: { createdAt: "desc" } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("Fetch orders error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const {
      orderId,
      status,
      awbCode,
      courierName,
      trackingUrl,
      internalAdminNotes,
    } = await req.json();

    if (!orderId) {
      return NextResponse.json({ success: false, message: "Order ID is required" }, { status: 400 });
    }

    const currentOrder = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!currentOrder) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    const updated = await prisma.$transaction(async (tx) => {
      const order = await tx.order.update({
        where: { id: orderId },
        data: {
          status: status || currentOrder.status,
          awbCode: awbCode !== undefined ? awbCode : currentOrder.awbCode,
          courierName: courierName !== undefined ? courierName : currentOrder.courierName,
          trackingUrl: trackingUrl !== undefined ? trackingUrl : currentOrder.trackingUrl,
          internalAdminNotes: internalAdminNotes !== undefined ? internalAdminNotes : currentOrder.internalAdminNotes,
          deliveredAt: status === "DELIVERED" ? new Date() : currentOrder.deliveredAt,
          statusHistory: status && status !== currentOrder.status
            ? {
                create: {
                  fromStatus: currentOrder.status,
                  toStatus: status,
                  notes: internalAdminNotes || `Status updated to ${status} by admin.`,
                },
              }
            : undefined,
        },
      });

      // Audit Log
      await tx.auditLog.create({
        data: {
          action: "STATUS_CHANGE",
          entity: "Order",
          entityId: order.id,
          details: `Order ${order.orderNumber} updated to status "${order.status}". Courier: ${courierName || "N/A"}, AWB: ${awbCode || "N/A"}.`,
        },
      });

      return order;
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    console.error("Update order error:", error);
    return NextResponse.json({ success: false, message: "Failed to update order" }, { status: 500 });
  }
}
