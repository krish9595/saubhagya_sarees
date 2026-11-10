import React from "react";
import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { FolderTree, Plus, ExternalLink } from "lucide-react";

export const revalidate = 0;

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { products: true } },
    },
    orderBy: { displayOrder: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-beige/60 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-normal text-espresso flex items-center gap-2">
            <FolderTree className="w-5 h-5 text-gold" />
            Category & Collection Architecture
          </h1>
          <p className="text-xs text-charcoal/60">
            {categories.length} active collection taxonomies in storefront navigation
          </p>
        </div>
      </div>

      <div className="bg-white border border-beige/60 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream/40 text-charcoal/70 uppercase tracking-wider text-[10px] border-b border-beige/40">
              <tr>
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4">Image</th>
                <th className="py-3 px-4">Category Name</th>
                <th className="py-3 px-4">URL Slug</th>
                <th className="py-3 px-4">Linked Designs</th>
                <th className="py-3 px-4">Storefront Status</th>
                <th className="py-3 px-4 text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige/20 text-charcoal">
              {categories.map((c) => (
                <tr key={c.id} className="hover:bg-cream/20 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-chocolate">#{c.displayOrder}</td>
                  <td className="py-3 px-4">
                    <div className="relative w-12 h-14 bg-cream border border-beige/40 overflow-hidden">
                      <Image
                        src={c.image || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=100"}
                        alt={c.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                  </td>
                  <td className="py-3 px-4 font-serif font-medium text-base text-espresso">
                    {c.name}
                  </td>
                  <td className="py-3 px-4 font-mono text-charcoal/60">/shop/{c.slug}</td>
                  <td className="py-3 px-4 font-semibold text-espresso">
                    {c._count.products} {c._count.products === 1 ? "piece" : "pieces"}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {c.isActive ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      href={`/shop/${c.slug}`}
                      target="_blank"
                      className="text-xs text-gold hover:text-espresso font-semibold flex items-center justify-end gap-1"
                    >
                      <span>Preview</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
