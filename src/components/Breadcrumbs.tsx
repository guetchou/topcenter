import { Link, useLocation } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const routeNames: { [key: string]: string } = {
  "services": "Services",
  "call-center": "Centre d'Appels",
  "online-sales": "Vente en Ligne",
  "telephony": "Téléphonie",
  "about": "À propos",
  "contact": "Contact",
};

export const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <Link to="/" className="text-sm font-medium">
            Accueil
          </Link>
        </BreadcrumbItem>
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;

          return (
            <BreadcrumbItem key={to}>
              <BreadcrumbSeparator />
              {last ? (
                <BreadcrumbPage>{routeNames[value] || value}</BreadcrumbPage>
              ) : (
                <Link to={to} className="text-sm font-medium">
                  {routeNames[value] || value}
                </Link>
              )}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};