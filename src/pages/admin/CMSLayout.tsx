
import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/admin/Sidebar";

export const CMSLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="grid lg:grid-cols-[240px_1fr]">
        <Sidebar />
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
