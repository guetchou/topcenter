
import { defineConfig } from "tinacms";

export default defineConfig({
  branch: "main",
  clientId: process.env.TINA_CLIENT_ID || "",
  token: process.env.TINA_TOKEN || "",
  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "uploads",
      publicFolder: "public",
    },
  },
  schema: {
    collections: [
      {
        name: "post",
        label: "Articles",
        path: "content/posts",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Titre",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "description",
            label: "Description",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "rich-text",
            name: "body",
            label: "Contenu",
            isBody: true,
          },
          {
            type: "datetime",
            name: "date",
            label: "Date de publication",
          },
          {
            type: "image",
            name: "featuredImage",
            label: "Image à la une",
          },
          {
            type: "string",
            name: "category",
            label: "Catégorie",
            list: true,
            options: [
              {
                value: "services",
                label: "Services",
              },
              {
                value: "technology",
                label: "Technologie",
              },
              {
                value: "industry",
                label: "Industrie",
              },
              {
                value: "company",
                label: "Entreprise",
              },
            ],
          },
          {
            type: "string",
            name: "tags",
            label: "Tags",
            list: true,
          },
          {
            type: "string",
            name: "author",
            label: "Auteur",
          },
          {
            type: "boolean",
            name: "featured",
            label: "Mettre en avant",
          },
          {
            type: "string",
            name: "status",
            label: "Statut",
            options: [
              {
                value: "draft",
                label: "Brouillon",
              },
              {
                value: "published",
                label: "Publié",
              },
            ],
          },
        ],
      },
      {
        name: "service",
        label: "Services",
        path: "content/services",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Titre",
            isTitle: true,
            required: true,
          },
          {
            type: "rich-text",
            name: "description",
            label: "Description",
            isBody: true,
          },
          {
            type: "image",
            name: "image",
            label: "Image",
          },
          {
            type: "string",
            name: "icon",
            label: "Icône",
          },
          {
            type: "boolean",
            name: "featured",
            label: "Service vedette",
          },
          {
            type: "number",
            name: "order",
            label: "Ordre d'affichage",
          },
        ],
      },
      {
        name: "news",
        label: "Actualités",
        path: "content/news",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Titre",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "summary",
            label: "Résumé",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "rich-text",
            name: "content",
            label: "Contenu",
            isBody: true,
          },
          {
            type: "image",
            name: "image",
            label: "Image principale",
          },
          {
            type: "datetime",
            name: "publishedAt",
            label: "Date de publication",
          },
          {
            type: "string",
            name: "status",
            label: "Statut",
            options: [
              {
                value: "draft",
                label: "Brouillon",
              },
              {
                value: "published",
                label: "Publié",
              },
              {
                value: "archived",
                label: "Archivé",
              },
            ],
          },
          {
            type: "string",
            name: "author",
            label: "Auteur",
          },
          {
            type: "string",
            name: "categories",
            label: "Catégories",
            list: true,
          },
          {
            type: "string",
            name: "tags",
            label: "Tags",
            list: true,
          },
          {
            type: "boolean",
            name: "featured",
            label: "Mettre en avant",
          },
          {
            type: "string",
            name: "seoTitle",
            label: "Titre SEO",
          },
          {
            type: "string",
            name: "seoDescription",
            label: "Description SEO",
            ui: {
              component: "textarea",
            },
          },
        ],
      },
      {
        name: "page",
        label: "Pages",
        path: "content/pages",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Titre",
            isTitle: true,
            required: true,
          },
          {
            type: "rich-text",
            name: "content",
            label: "Contenu",
            isBody: true,
          },
          {
            type: "string",
            name: "layout",
            label: "Layout",
            options: [
              {
                value: "default",
                label: "Default",
              },
              {
                value: "landing",
                label: "Landing Page",
              },
              {
                value: "contact",
                label: "Contact",
              },
            ],
          },
          {
            type: "string",
            name: "slug",
            label: "Slug",
            required: true,
          },
          {
            type: "boolean",
            name: "published",
            label: "Publié",
          },
          {
            type: "string",
            name: "seoTitle",
            label: "Titre SEO",
          },
          {
            type: "string",
            name: "seoDescription",
            label: "Description SEO",
            ui: {
              component: "textarea",
            },
          },
        ],
      },
    ],
  },
});
