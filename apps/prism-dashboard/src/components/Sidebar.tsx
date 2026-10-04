"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, ShieldAlert, Target, Settings, Layers } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Dashboard", icon: Activity, exact: true },
    { href: "/investigation/TA-017", label: "Active Investigation", icon: Target, exact: false, matchPrefix: "/investigation" },
    { href: "/actor-clusters", label: "Actor Clusters", icon: Layers, exact: false, matchPrefix: "/actor-clusters" },
  ];

  const isActive = (item: typeof navItems[0]) => {
    if (item.exact) return pathname === item.href;
    if (item.matchPrefix) return pathname.startsWith(item.matchPrefix);
    return pathname === item.href;
  };

  const isSettingsActive = pathname === "/settings";

  return (
    <aside className="w-full md:w-64 glass-panel m-2 md:m-4 flex flex-col p-4 md:p-6 md:sticky md:top-4 md:h-[calc(100vh-2rem)] shrink-0 z-30">
      <div className="flex items-center gap-3 mb-6 md:mb-10">
        <ShieldAlert className="text-cream shrink-0" size={32} />
        <div>
          <h1 className="text-xl font-bold tracking-wider text-cream font-space-grotesk">PRISM</h1>
          <span className="text-[10px] text-platinum/50 uppercase tracking-widest block font-mono">Cyber Intelligence</span>
        </div>
      </div>

      <nav className="flex-1 space-y-2 md:space-y-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                active
                  ? "bg-white/10 text-cream font-semibold border border-white/15 shadow-sm"
                  : "text-platinum/70 hover:text-cream hover:bg-white/5"
              }`}
            >
              <Icon size={20} className={active ? "text-cream" : "text-platinum/70"} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <Link
        href="/settings"
        className={`mt-4 md:mt-auto flex items-center gap-3 p-3 rounded-xl transition-all ${
          isSettingsActive
            ? "bg-white/10 text-cream font-semibold border border-white/15 shadow-sm"
            : "text-platinum/70 hover:text-cream hover:bg-white/5"
        }`}
      >
        <Settings size={20} className={isSettingsActive ? "text-cream" : "text-platinum/70"} />
        <span>Settings</span>
      </Link>
    </aside>
  );
}
