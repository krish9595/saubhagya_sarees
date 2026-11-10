import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword, getAdminUserFromCookies } from "@/lib/auth";

export async function GET() {
  try {
    const [users, roles] = await Promise.all([
      prisma.user.findMany({
        include: { role: true },
        orderBy: { createdAt: "asc" },
      }),
      prisma.role.findMany({
        include: { permissions: { include: { permission: true } } },
        orderBy: { name: "asc" },
      }),
    ]);

    // Omit passwordHash before sending
    const safeUsers = users.map(({ passwordHash, ...u }) => u);

    return NextResponse.json({ success: true, users: safeUsers, roles });
  } catch (error) {
    console.error("Staff fetch error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch staff" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, roleId, phone } = body;

    if (!name || !email || !password || !roleId) {
      return NextResponse.json({ success: false, message: "Name, email, password and role are required" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      return NextResponse.json({ success: false, message: "A user with this email already exists" }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        passwordHash,
        roleId,
        phone: phone ? phone.trim() : null,
        isActive: true,
      },
      include: { role: true },
    });

    await prisma.auditLog.create({
      data: {
        action: "CREATE",
        entity: "User",
        entityId: newUser.id,
        details: `Created staff account: ${newUser.name} (${newUser.email}) with role ${newUser.role.displayName}.`,
      },
    });

    const { passwordHash: _, ...safeUser } = newUser;
    return NextResponse.json({ success: true, user: safeUser });
  } catch (error: any) {
    console.error("Staff create error:", error);
    return NextResponse.json({ success: false, message: error?.message || "Failed to create staff member" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, email, phone, roleId, isActive, password } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "Staff ID required" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, message: "Staff user not found" }, { status: 404 });
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name.trim();
    if (email !== undefined) updateData.email = email.toLowerCase().trim();
    if (phone !== undefined) updateData.phone = phone ? phone.trim() : null;
    if (roleId !== undefined) updateData.roleId = roleId;
    if (isActive !== undefined) updateData.isActive = !!isActive;

    if (password && password.trim().length >= 6) {
      updateData.passwordHash = await hashPassword(password.trim());
    }

    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
      include: { role: true },
    });

    await prisma.auditLog.create({
      data: {
        action: "UPDATE",
        entity: "User",
        entityId: id,
        details: `Updated staff account for ${updated.name} (${updated.email}).`,
      },
    });

    const { passwordHash: _, ...safeUser } = updated;
    return NextResponse.json({ success: true, user: safeUser });
  } catch (error: any) {
    console.error("Staff update error:", error);
    return NextResponse.json({ success: false, message: error?.message || "Failed to update staff member" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "Staff ID required" }, { status: 400 });
    }

    // Protect super admin count
    const target = await prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });

    if (!target) {
      return NextResponse.json({ success: false, message: "Staff member not found" }, { status: 404 });
    }

    if (target.role.name === "SUPER_ADMIN") {
      const superAdminCount = await prisma.user.count({
        where: { role: { name: "SUPER_ADMIN" } },
      });
      if (superAdminCount <= 1) {
        return NextResponse.json({ success: false, message: "Cannot delete the primary Super Administrator account." }, { status: 400 });
      }
    }

    await prisma.user.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        action: "DELETE",
        entity: "User",
        entityId: id,
        details: `Deleted staff user: ${target.name} (${target.email}).`,
      },
    });

    return NextResponse.json({ success: true, message: "Staff member deleted" });
  } catch (error: any) {
    console.error("Staff delete error:", error);
    return NextResponse.json({ success: false, message: error?.message || "Failed to delete staff member" }, { status: 500 });
  }
}
