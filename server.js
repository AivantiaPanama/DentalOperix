import "dotenv/config";
import { createServer } from "node:http";
import { promises as fs } from "node:fs";
import { Readable } from "node:stream";
import { EOL } from "node:os";
import { extname, join, resolve, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import serverModule from "./dist/server/server.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = __filename.substring(0, __filename.lastIndexOf("/"));
const clientDir = join(__dirname, "dist", "client");
const normalizedClientDir = resolve(clientDir);
const port = Number(process.env.PORT ?? 3000);

const mimeTypes = {
  ".js": "application/javascript",
  ".mjs": "application/javascript",
  ".css": "text/css",
  ".html": "text/html",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/vnd.microsoft.icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ttf": "font/ttf",
  ".eot": "application/vnd.ms-fontobject",
  ".txt": "text/plain",
};

function getMimeType(pathname) {
  return mimeTypes[extname(pathname).toLowerCase()] ?? "application/octet-stream";
}

async function serveStaticFile(res, filePath) {
  const resolvedPath = resolve(filePath);
  const normalizedPath = resolve(resolvedPath);
  const relativePath = relative(normalizedClientDir, normalizedPath);

  if (
    !normalizedPath.startsWith(normalizedClientDir + sep) &&
    normalizedPath !== normalizedClientDir &&
    (relativePath.startsWith("..") || relativePath === "")
  ) {
    res.writeHead(404, { "content-type": "text/plain" });
    res.end("Not found");
    return;
  }

  const file = await fs.readFile(normalizedPath);
  res.writeHead(200, { "content-type": getMimeType(normalizedPath) });
  res.end(file);
}

async function handleRequest(req, res) {
  const host = req.headers.host ?? "localhost";
  const url = new URL(req.url ?? "/", `http://${host}`);
  const pathname = url.pathname;

  if (
    pathname.startsWith("/assets/") ||
    pathname.startsWith("/favicon.") ||
    pathname === "/robots.txt"
  ) {
    const filePath = join(clientDir, pathname);
    try {
      await serveStaticFile(res, filePath);
      return;
    } catch {
      res.writeHead(404, { "content-type": "text/plain" });
      res.end("Not found");
      return;
    }
  }

  const request = new Request(url.toString(), {
    method: req.method,
    headers: req.headers,
    body: req.method === "GET" || req.method === "HEAD" ? undefined : req,
  });

  const response = await serverModule.default.fetch(request, {}, {});
  const headers = {};
  for (const [key, value] of response.headers) {
    if (value != null) {
      headers[key] = value;
    }
  }

  res.writeHead(response.status, headers);

  if (response.body == null) {
    res.end();
    return;
  }

  if (typeof response.body.getReader === "function") {
    const readable = Readable.fromWeb(response.body);
    readable.pipe(res);
    return;
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  res.end(buffer);
}

createServer((req, res) => {
  handleRequest(req, res).catch((error) => {
    console.error(error);
    res.writeHead(500, { "content-type": "text/plain" });
    res.end("Internal Server Error");
  });
}).listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
