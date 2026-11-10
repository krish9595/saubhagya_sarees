import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customer,
      shippingAddress,
      cartItems,
      couponCode,
      paymentMethod = "RAZORPAY",
      customerNotes,
    } = body;

    if (!customer?.phone || !customer?.name) {
      return NextResponse.json({ success: false, message: "Customer name and phone number are required." }, { status: 400 });
    }

    if (!shippingAddress?.streetAddress || !shippingAddress?.city || !shippingAddress?.postalCode) {
      return NextResponse.json({ success: false, message: "Complete shipping address is required." }, { status: 400 });
    }

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json({ success: false, message: "Your shopping bag is empty." }, { status: 400 });
    }

    // 1. Fetch real product prices & stock from database (NEVER TRUST CLIENT PRICES)
    const productIds = cartItems.map((item: { productId: string }) => item.productId);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: {
        images: { where: { isPrimary: true } },
        variants: true,
      },
    });

    const productMap = new Map(dbProducts.map((p) => [p.id, p]));

    let calculatedSubtotal = 0;
    const validatedOrderItems: any[] = [];

    for (const item of cartItems) {
      const dbProd = productMap.get(item.productId);
      if (!dbProd) {
        return NextResponse.json(
          { success: false, message: `Product "${item.title || "item"}" is no longer available.` },
          { status: 400 }
        );
      }

      if (dbProd.status !== "PUBLISHED") {
        return NextResponse.json(
          { success: false, message: `Product "${dbProd.title}" is currently not available for purchase.` },
          { status: 400 }
        );
      }

      const variant = item.variantId
        ? dbProd.variants.find((v) => v.id === item.variantId)
        : null;

      // Check stock
      const availableStock = variant ? variant.stockQuantity : 10;
      if (availableStock < item.quantity) {
        return NextResponse.json(
          { success: false, message: `Insufficient stock for "${dbProd.title}". Only ${availableStock} left.` },
          { status: 400 }
        );
      }

      const unitPrice = Number(dbProd.price) + (variant ? Number(variant.additionalPrice) : 0);
      const mrp = Number(dbProd.mrp) + (variant ? Number(variant.additionalPrice) : 0);
      const itemTotal = unitPrice * item.quantity;
      calculatedSubtotal += itemTotal;

      const primaryImg = dbProd.images[0]?.url || item.image || "";

      validatedOrderItems.push({
        productId: dbProd.id,
        variantId: variant?.id || null,
        productName: dbProd.title,
        productSku: variant?.sku || dbProd.sku,
        unitPrice,
        mrp,
        quantity: item.quantity,
        totalPrice: itemTotal,
        imageUrl: primaryImg,
        customMeasurements: item.customMeasurements || null,
      });
    }

    // 2. Server-side coupon verification
    let discountAmount = 0;
    let appliedCoupon = null;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.trim().toUpperCase() },
      });

      if (coupon && coupon.isActive) {
        const minVal = Number(coupon.minOrderValue);
        if (calculatedSubtotal >= minVal) {
          if (coupon.discountType === "PERCENTAGE") {
            discountAmount = (calculatedSubtotal * Number(coupon.discountValue)) / 100;
            if (coupon.maxDiscount && discountAmount > Number(coupon.maxDiscount)) {
              discountAmount = Number(coupon.maxDiscount);
            }
          } else {
            discountAmount = Number(coupon.discountValue);
          }
          appliedCoupon = coupon;
        }
      }
    }

    // 3. Shipping & Taxes
    const shippingAmount = calculatedSubtotal >= 4999 || calculatedSubtotal === 0 ? 0 : 150;
    const taxAmount = Math.round(((calculatedSubtotal * 0.05) / 1.05) * 100) / 100;
    const finalTotal = Math.max(0, calculatedSubtotal - discountAmount + shippingAmount);

    // 4. Generate Unique Order Number: SSB-YYYY-XXXX
    const year = new Date().getFullYear();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `SSB-${year}-${randomSuffix}`;

    // 5. Find or create customer
    let dbCustomer = await prisma.customer.findUnique({
      where: { phone: customer.phone },
    });

    if (!dbCustomer) {
      dbCustomer = await prisma.customer.create({
        data: {
          name: customer.name,
          phone: customer.phone,
          email: customer.email || null,
          isGuest: true,
          addresses: {
            create: {
              fullName: shippingAddress.fullName || customer.name,
              phone: customer.phone,
              streetAddress: shippingAddress.streetAddress,
              landmark: shippingAddress.landmark || null,
              city: shippingAddress.city,
              state: shippingAddress.state || "Haryana",
              postalCode: shippingAddress.postalCode,
              isDefault: true,
            },
          },
        },
      });
    }

    // 6. Create Order and items in database transaction
    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          customerId: dbCustomer.id,
          guestName: customer.name,
          guestEmail: customer.email || null,
          guestPhone: customer.phone,
          status: paymentMethod === "COD" ? "CONFIRMED" : "PAYMENT_PENDING",
          subtotal: calculatedSubtotal,
          discountAmount,
          taxAmount,
          shippingAmount,
          totalAmount: finalTotal,
          paymentMethod,
          paymentStatus: paymentMethod === "COD" ? "PENDING" : "PENDING",
          couponCode: appliedCoupon ? appliedCoupon.code : null,
          customerNotes: customerNotes || null,
          shippingAddressJson: JSON.stringify(shippingAddress),
          items: {
            create: validatedOrderItems,
          },
          statusHistory: {
            create: {
              fromStatus: null,
              toStatus: paymentMethod === "COD" ? "CONFIRMED" : "PAYMENT_PENDING",
              notes: paymentMethod === "COD"
                ? "Order confirmed with Cash on Delivery (COD)."
                : "Order created, awaiting online payment confirmation via Razorpay.",
            },
          },
        },
      });

      // Update coupon usage count if used
      if (appliedCoupon) {
        await tx.coupon.update({
          where: { id: appliedCoupon.id },
          data: { usageCount: { increment: 1 } },
        });

        await tx.couponUsage.create({
          data: {
            couponId: appliedCoupon.id,
            orderId: createdOrder.id,
            customerId: dbCustomer.id,
            discountApplied: discountAmount,
          },
        });
      }

      // If COD, adjust stock immediately
      if (paymentMethod === "COD") {
        for (const item of validatedOrderItems) {
          if (item.variantId) {
            await tx.productVariant.update({
              where: { id: item.variantId },
              data: { stockQuantity: { decrement: item.quantity } },
            });
            await tx.inventoryMovement.create({
              data: {
                productId: item.productId,
                variantId: item.variantId,
                changeType: "SALE",
                quantityDelta: -item.quantity,
                balanceAfter: 0,
                notes: `Order ${orderNumber} (COD)`,
              },
            });
          }
          await tx.product.update({
            where: { id: item.productId },
            data: { salesCount: { increment: item.quantity } },
          });
        }
      }

      return createdOrder;
    });

    // 7. For Razorpay, generate mock or live order ID
    let razorpayOrder = null;
    if (paymentMethod === "RAZORPAY") {
      const razorpayOrderId = `order_${crypto.randomBytes(8).toString("hex")}`;
      razorpayOrder = {
        id: razorpayOrderId,
        amount: Math.round(finalTotal * 100), // in paise
        currency: "INR",
        receipt: order.orderNumber,
        key: process.env.RAZORPAY_KEY_ID || "rzp_test_saubhagya_dummy_key",
      };
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        totalAmount: finalTotal,
        paymentMethod,
        status: order.status,
      },
      razorpayOrder,
    });
  } catch (error) {
    console.error("Order creation failed:", error);
    return NextResponse.json(
      { success: false, message: "Order creation failed. Please check your details and try again." },
      { status: 500 }
    );
  }
}
