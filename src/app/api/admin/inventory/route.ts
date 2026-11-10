import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const [variants, movements] = await Promise.all([
      prisma.productVariant.findMany({
        include: {
          product: {
            select: { id: true, title: true, sku: true },
          },
          inventories: true,
        },
        orderBy: { stockQuantity: "asc" },
      }),
      prisma.inventoryMovement.findMany({
        take: 30,
        orderBy: { createdAt: "desc" },
        include: {
          createdByUser: { select: { name: true, email: true } },
        },
      }),
    ]);

    return NextResponse.json({ success: true, variants, movements });
  } catch (error) {
    console.error("Inventory fetch error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch inventory" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      variantId,
      changeDelta,
      exactQuantity,
      notes,
      changeType = "ADJUSTMENT",
    } = body;

    if (!variantId) {
      return NextResponse.json({ success: false, message: "Variant ID is required" }, { status: 400 });
    }

    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      include: { product: true },
    });

    if (!variant) {
      return NextResponse.json({ success: false, message: "Variant not found" }, { status: 404 });
    }

    let calculatedDelta = 0;
    let targetQuantity = 0;

    if (typeof exactQuantity === "number") {
      targetQuantity = Math.max(0, exactQuantity);
      calculatedDelta = targetQuantity - variant.stockQuantity;
    } else if (typeof changeDelta === "number") {
      calculatedDelta = changeDelta;
      targetQuantity = Math.max(0, variant.stockQuantity + changeDelta);
    } else {
      return NextResponse.json({ success: false, message: "Provide either changeDelta or exactQuantity" }, { status: 400 });
    }

    const updated = await prisma.$transaction(async (tx) => {
      const updatedVariant = await tx.productVariant.update({
        where: { id: variantId },
        data: {
          stockQuantity: targetQuantity,
        },
      });

      // Update or create inventory record
      await tx.inventory.upsert({
        where: {
          productId_variantId: {
            productId: variant.productId,
            variantId: variant.id,
          },
        },
        update: {
          quantity: updatedVariant.stockQuantity,
        },
        create: {
          productId: variant.productId,
          variantId: variant.id,
          quantity: updatedVariant.stockQuantity,
        },
      });

      // Record movement log
      await tx.inventoryMovement.create({
        data: {
          productId: variant.productId,
          variantId: variant.id,
          changeType,
          quantityDelta: calculatedDelta,
          balanceAfter: updatedVariant.stockQuantity,
          notes: notes || `Stock updated to ${targetQuantity} units (${calculatedDelta >= 0 ? `+${calculatedDelta}` : calculatedDelta})`,
        },
      });

      // Audit log
      await tx.auditLog.create({
        data: {
          action: "UPDATE",
          entity: "Inventory",
          entityId: variant.id,
          details: `Stock adjustment for ${variant.product.title} (${variant.sku}): ${calculatedDelta >= 0 ? `+${calculatedDelta}` : calculatedDelta} units. Balance: ${updatedVariant.stockQuantity}. Reason: ${changeType}`,
        },
      });

      return updatedVariant;
    });

    return NextResponse.json({ success: true, updated });
  } catch (error: any) {
    console.error("Inventory update error:", error);
    return NextResponse.json({ success: false, message: error?.message || "Failed to update inventory" }, { status: 500 });
  }
}
