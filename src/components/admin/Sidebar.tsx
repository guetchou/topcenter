
import { NavLink } from "react-router-dom";
import { BookOpen, Image, FolderTree, Menu as MenuIcon, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    title: "Articles",
    icon: BookOpen,
    href: "/admin/articles"
  },
  {
    title: "Médias",
    icon: Image,
    href: "/admin/medias"
  },
  {
    title: "Catégories",
    icon: FolderTree,
    href: "/admin/categories"
  },
  {
    title: "Menus",
    icon: MenuIcon,
    href: "/admin/menus"
  },
  {
    title: "Paramètres",
    icon: Settings,
    href: "/admin/settings"
  }
];

export const Sidebar = () => {
  return (
    <div className="border-r bg-card h-screen p-4">
      <div className="space-y-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">Administration</h2>
        </div>
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};
