import fs from "node:fs";
import path from "node:path";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import { componentTagger } from "lovable-tagger";
import { injectSeoMeta, OG_IMAGE_ASSET_PATH, PAGE_SEO } from "./src/seo/meta.ts";

/**
 * Emits the static OG image from `assets/` without relocating it and generates
 * per-route HTML entry points with build-time Open Graph and Twitter meta tags.
 */
function seoMetaPlugin(): Plugin {
  const ogImageSourcePath = path.resolve(__dirname, OG_IMAGE_ASSET_PATH);

  return {
    name: "seo-meta-plugin",
    configureServer(server) {
      server.middlewares.use(`/${OG_IMAGE_ASSET_PATH}`, (_req, res, next) => {
        if (!fs.existsSync(ogImageSourcePath)) {
          next();
          return;
        }
        res.setHeader("Content-Type", "image/png");
        fs.createReadStream(ogImageSourcePath).pipe(res);
      });
    },
    transformIndexHtml(html, ctx) {
      const routePath = ctx.originalUrl ?? "/";
      return injectSeoMeta(html, routePath);
    },
    generateBundle() {
      if (fs.existsSync(ogImageSourcePath)) {
        this.emitFile({
          type: "asset",
          fileName: OG_IMAGE_ASSET_PATH,
          source: fs.readFileSync(ogImageSourcePath),
        });
      }
    },
    writeBundle(outputOptions) {
      const outDir = outputOptions.dir ?? path.resolve(__dirname, "dist");
      const rootHtmlPath = path.join(outDir, "index.html");
      if (!fs.existsSync(rootHtmlPath)) {
        return;
      }

      const rootHtml = fs.readFileSync(rootHtmlPath, "utf8");
      for (const routePath of Object.keys(PAGE_SEO)) {
        if (routePath === "/") continue;
        const cleanSegment = routePath.replace(/^\/+/, "");
        const routeDir = path.join(outDir, cleanSegment);
        fs.mkdirSync(routeDir, { recursive: true });
        fs.writeFileSync(path.join(routeDir, "index.html"), injectSeoMeta(rootHtml, routePath), "utf8");
      }
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
  plugins: [react(), seoMetaPlugin(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
