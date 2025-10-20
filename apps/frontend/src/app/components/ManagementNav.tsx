"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  FileText,
  CreditCard,
  Bell,
  Activity,
  Settings,
  BarChart3,
} from "lucide-react";

const navItems = [
  { href: "/management/users", label: "Users", icon: Users },
  { href: "/management/content", label: "Content", icon: FileText },
  { href: "/management/payments", label: "Payments", icon: CreditCard },
  { href: "/management/notifications", label: "Notifications", icon: Bell },
  { href: "/management/predictions", label: "Predictions", icon: Activity },
  { href: "/management/settings", label: "Settings", icon: Settings },
  { href: "/management/analytics", label: "Analytics", icon: BarChart3 },
];

export default function ManagementNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-4 p-4 border-b border-white/10" style={{
      background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)',
      backdropFilter: 'blur(16px)',
    }}>
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isActive
                ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30"
                : "text-gray-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Icon size={18} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}