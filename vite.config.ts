import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";

function backendDevApiPlugin(): Plugin {
  return {
    name: "backend-dev-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url || "", "http://localhost");

        if (url.pathname.startsWith("/api/pagamento/")) {
          const envFile = path.resolve(process.cwd(), ".env.local");
          if (fs.existsSync(envFile)) {
            const lines = fs.readFileSync(envFile, "utf-8").split("\n");
            for (const line of lines) {
              const trimmed = line.trim();
              if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
                const [k, ...rest] = trimmed.split("=");
                const v = rest.join("=").trim().replace(/^['"]|['"]$/g, "");
                if (k.trim()) process.env[k.trim()] = v;
              }
            }
          }

          let body: Record<string, unknown> = {};
          if (req.method === "POST") {
            const chunks: Buffer[] = [];
            for await (const chunk of req) {
              chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
            }
            const raw = Buffer.concat(chunks).toString("utf-8");
            try {
              body = JSON.parse(raw);
            } catch {
              body = {};
            }
          }

          const query = Object.fromEntries(url.searchParams.entries());

          const mockReq = {
            method: req.method,
            headers: req.headers,
            body,
            query,
            url: req.url,
          };

          const mockRes = {
            statusCode: 200,
            setHeader(name: string, val: string) {
              res.setHeader(name, val);
            },
            status(code: number) {
              this.statusCode = code;
              res.statusCode = code;
              return this;
            },
            json(data: unknown) {
              res.setHeader("Content-Type", "application/json; charset=utf-8");
              res.end(JSON.stringify(data));
            },
          };

          try {
            if (url.pathname === "/api/pagamento/pix") {
              // @ts-expect-error import dinâmico de função backend em tempo de dev
              const { default: handler } = await import("./backend/api/pagamento/pix.js");
              await handler(mockReq, mockRes);
            } else if (url.pathname === "/api/pagamento/status") {
              // @ts-expect-error import dinâmico de função backend em tempo de dev
              const { default: handler } = await import("./backend/api/pagamento/status.js");
              await handler(mockReq, mockRes);
            } else if (url.pathname === "/api/pagamento/boleto") {
              // @ts-expect-error import dinâmico de função backend em tempo de dev
              const { default: handler } = await import("./backend/api/pagamento/boleto.js");
              await handler(mockReq, mockRes);
            } else if (url.pathname === "/api/pagamento/cartao") {
              // @ts-expect-error import dinâmico de função backend em tempo de dev
              const { default: handler } = await import("./backend/api/pagamento/cartao.js");
              await handler(mockReq, mockRes);
            } else {
              next();
            }
          } catch (err: unknown) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            const msg = err instanceof Error ? err.message : "Erro interno dev";
            res.end(JSON.stringify({ ok: false, message: msg }));
          }
          return;
        }

        next();
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(() => ({
  base: '/',
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), backendDevApiPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Garante que arquivos públicos (incluindo .htaccess) sejam copiados
    copyPublicDir: true,
  },
}));
