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

export default function ManagementSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen flex flex-col" style={{
      background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
      backdropFilter: 'blur(20px)',
      borderRight: '1px solid rgba(255, 255, 255, 0.15)',
    }}>
      <div className="p-4 text-lg font-bold border-b border-white/10 text-white">
        ⚙️ Management
      </div>
      <nav className="flex flex-col flex-1 p-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all mb-2 ${
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/50"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`}
              style={{
                backdropFilter: isActive ? 'blur(10px)' : 'none',
              }}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}