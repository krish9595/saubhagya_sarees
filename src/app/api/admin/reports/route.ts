import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "orders";

    if (type === "orders") {
      const orders = await prisma.order.findMany({
        orderBy: { createdAt: "desc" },
      });

      const header = "Order Number,Customer Name,Phone,Date,Status,Total Amount (INR),Payment Method,Payment Status\n";
      const rows = orders.map((o) => {
        return `"${o.orderNumber}","${o.guestName || ""}","${o.guestPhone || ""}","${o.createdAt.toISOString()}","${o.status}","${o.totalAmount}","${o.paymentMethod}","${o.paymentStatus}"`;
      });

      const csvContent = header + rows.join("\n");
      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename=orders_report.csv`,
        },
      });
    } else if (type === "inventory") {
      const variants = await prisma.productVariant.findMany({
        include: { product: true },
      });

      const header = "Product Title,Variant SKU,Size,Color,Stock Quantity,Unit Price (INR),Total Valuation (INR)\n";
      const rows = variants.map((v) => {
        const val = v.stockQuantity * Number(v.product.price);
        return `"${v.product.title}","${v.sku}","${v.size || "Free Size"}","${v.color || "Standard"}","${v.stockQuantity}","${v.product.price}","${val}"`;
      });

      const csvContent = header + rows.join("\n");
      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename=inventory_report.csv`,
        },
      });
    } else {
      // Sales & Tax
      const orders = await prisma.order.findMany({
        where: { paymentStatus: "PAID" },
      });

      const header = "Order Number,Subtotal (INR),Discount (INR),GST Tax 5% (INR),Total (INR),Payment ID\n";
      const rows = orders.map((o) => {
        return `"${o.orderNumber}","${o.subtotal}","${o.discountAmount}","${o.taxAmount}","${o.totalAmount}","${o.paymentId || ""}"`;
      });

      const csvContent = header + rows.join("\n");
      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename=sales_tax_report.csv`,
        },
      });
    }
  } catch (error) {
    console.error("Report generation error:", error);
    return NextResponse.json({ success: false, message: "Export failed" }, { status: 500 });
  }
}
