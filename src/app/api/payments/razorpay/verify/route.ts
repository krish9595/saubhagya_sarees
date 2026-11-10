import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const {
      orderNumber,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    } = await req.json();

    if (!orderNumber || !razorpay_payment_id) {
      return NextResponse.json({ success: false, message: "Missing payment details." }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found." }, { status: 404 });
    }

    // Prevent duplicate payment processing
    if (order.paymentStatus === "PAID") {
      return NextResponse.json({
        success: true,
        message: "Order already confirmed and paid.",
        orderNumber: order.orderNumber,
      });
    }

    // Verify signature if secret is live
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (secret && secret !== "rzp_test_saubhagya_dummy_secret" && razorpay_order_id && razorpay_signature) {
      const generated_signature = crypto
        .createHmac("sha256", secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      if (generated_signature !== razorpay_signature) {
        // Record failed attempt
        await prisma.order.update({
          where: { id: order.id },
          data: {
            paymentStatus: "FAILED",
            statusHistory: {
              create: {
                fromStatus: order.status,
                toStatus: "PAYMENT_PENDING",
                notes: `Razorpay signature verification failed for payment ID: ${razorpay_payment_id}`,
              },
            },
          },
        });
        return NextResponse.json({ success: false, message: "Payment verification failed." }, { status: 400 });
      }
    }

    // Update order, stock, and payment in transaction
    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: order.id },
        data: {
          status: "CONFIRMED",
          paymentStatus: "PAID",
          paymentId: razorpay_payment_id,
          statusHistory: {
            create: {
              fromStatus: order.status,
              toStatus: "CONFIRMED",
              notes: `Online payment of ₹${order.totalAmount} captured successfully via Razorpay (Txn ID: ${razorpay_payment_id}).`,
            },
          },
        },
      });

      // Deduct stock for all items
      for (const item of order.items) {
        if (item.variantId) {
          const updatedVariant = await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stockQuantity: { decrement: item.quantity } },
          });

          await tx.inventoryMovement.create({
            data: {
              productId: item.productId,
              variantId: item.variantId,
              changeType: "SALE",
              quantityDelta: -item.quantity,
              balanceAfter: updatedVariant.stockQuantity,
              notes: `Order ${orderNumber} - payment verified`,
            },
          });
        }

        await tx.product.update({
          where: { id: item.productId },
          data: { salesCount: { increment: item.quantity } },
        });
      }

      // Record payment
      await tx.payment.create({
        data: {
          orderId: order.id,
          paymentMethod: "RAZORPAY",
          amount: order.totalAmount,
          currency: "INR",
          transactionId: razorpay_payment_id,
          gatewayOrderId: razorpay_order_id || null,
          signature: razorpay_signature || null,
          status: "SUCCESS",
        },
      });

      // Notification
      await tx.notification.create({
        data: {
          title: `New Order Confirmed: ${orderNumber}`,
          message: `Customer ${order.guestName} placed an order of ₹${order.totalAmount} via Razorpay.`,
          type: "ORDER",
          link: `/admin/orders/${order.id}`,
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: "Payment successfully verified and order confirmed.",
      orderNumber: order.orderNumber,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json({ success: false, message: "Payment verification failed." }, { status: 500 });
  }
}
