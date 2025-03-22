
import { Outlet, useLocation, Link } from "react-router-dom";
import { Sidebar } from "@/components/admin/Sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { Home } from "lucide-react";

interface BreadcrumbConfig {
  [key: string]: {
    label: string;
    translationId: string;
  };
}

export const CMSLayout = () => {
  const location = useLocation();
  const [breadcrumbs, setBreadcrumbs] = useState<Array<{ path: string, label: string, translationId: string }>>([]);

  // Configuration for breadcrumb paths
  const breadcrumbConfig: BreadcrumbConfig = {
    "admin": { label: "Admin", translationId: "admin.dashboard" },
    "dashboard": { label: "Dashboard", translationId: "admin.overview" },
    "news": { label: "News", translationId: "admin.news" },
    "create": { label: "Add News", translationId: "news.add" },
    "edit": { label: "Edit News", translationId: "news.edit" },
    "collaborators": { label: "Collaborators", translationId: "news.collaborate" },
    "users": { label: "Users", translationId: "admin.users" },
    "settings": { label: "Settings", translationId: "admin.settings" },
    "credentials": { label: "Credentials", translationId: "admin.credentials" },
    "docs": { label: "Documentation", translationId: "admin.documentation" },
    "deploy": { label: "Deployment", translationId: "admin.deployment" },
    "chatbots": { label: "Chatbots", translationId: "admin.chatbots" },
    "articles": { label: "Articles", translationId: "admin.articles" },
    "categories": { label: "Categories", translationId: "admin.categories" },
    "medias": { label: "Media Library", translationId: "admin.media" },
    "menus": { label: "Menus", translationId: "admin.menus" }
  };

  useEffect(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbItems = [];
    
    let currentPath = '';
    
    for (const segment of pathSegments) {
      currentPath += `/${segment}`;
      
      // Check if the segment is a dynamic parameter (starts with :)
      if (segment.match(/^[0-9a-fA-F-]+$/)) {
        // This is likely an ID, skip it in the breadcrumb
        continue;
      }
      
      const config = breadcrumbConfig[segment] || { 
        label: segment.charAt(0).toUpperCase() + segment.slice(1),
        translationId: `admin.${segment}`
      };
      
      breadcrumbItems.push({
        path: currentPath,
        label: config.label,
        translationId: config.translationId
      });
    }
    
    setBreadcrumbs(breadcrumbItems);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <div className="grid lg:grid-cols-[240px_1fr]">
        <Sidebar />
        <main className="flex flex-col">
          <div className="border-b p-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/admin">
                      <Home className="h-4 w-4" />
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                
                {breadcrumbs.map((breadcrumb, index) => (
                  <BreadcrumbItem key={breadcrumb.path}>
                    {index < breadcrumbs.length - 1 ? (
                      <>
                        <BreadcrumbLink asChild>
                          <Link to={breadcrumb.path}>
                            <FormattedMessage 
                              id={breadcrumb.translationId} 
                              defaultMessage={breadcrumb.label} 
                            />
                          </Link>
                        </BreadcrumbLink>
                        <BreadcrumbSeparator />
                      </>
                    ) : (
                      <BreadcrumbPage>
                        <FormattedMessage 
                          id={breadcrumb.translationId} 
                          defaultMessage={breadcrumb.label} 
                        />
                      </BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
