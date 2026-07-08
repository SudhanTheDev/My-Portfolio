import { readFile, stat } from "fs/promises";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const sourceRoots: Record<string, string> = {
  "rock-paper-scissors": "F:\\games for web\\rock-paper-scissors",
  "tic-tac-toe": "F:\\games for web\\Tic Tac Toe\\Tic-Tac-Toe-main\\Tic-Tac-Toe-main\\TicTacToe",
  snake: "F:\\games for web\\Snake Game JS-20260708T115159Z-3-001\\Snake Game JS",
  "typing-speed": "F:\\games for web\\Typing speed Game\\typing-speed-test-app\\tying test by JavaScript",
  "game-2048": "F:\\games for web\\2048\\2048",
  pacman: "F:\\games for web\\pacman\\pacman",
  "dino-runner": "F:\\games for web\\Dino Runner\\t-rex-runner",
};

const contentTypes: Record<string, string> = {
  ".css": "text/css; charset=utf-8",
  ".eot": "application/vnd.ms-fontobject",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".mp3": "audio/mpeg",
  ".otf": "font/otf",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ttf": "font/ttf",
  ".txt": "text/plain; charset=utf-8",
  ".wav": "audio/wav",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function badRequest(message: string, status = 400) {
  return new Response(message, { status });
}

async function resolveRequestedFile(root: string, segments: string[]) {
  const normalizedSegments = segments.length > 0 ? segments : ["index.html"];

  if (normalizedSegments.some((segment) => segment.includes("..") || path.isAbsolute(segment))) {
    return null;
  }

  const absoluteRoot = path.resolve(root);
  let requestedPath = path.resolve(absoluteRoot, ...normalizedSegments);

  if (!requestedPath.startsWith(absoluteRoot)) {
    return null;
  }

  try {
    const details = await stat(requestedPath);
    if (details.isDirectory()) {
      requestedPath = path.join(requestedPath, "index.html");
    }
  } catch {
    return null;
  }

  return requestedPath;
}

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string; path?: string[] }> },
) {
  const { slug, path: requestedPath = [] } = await context.params;
  const root = sourceRoots[slug];

  if (!root) {
    return badRequest("Game not found.", 404);
  }

  const absoluteFile = await resolveRequestedFile(root, requestedPath);
  if (!absoluteFile) {
    return badRequest("File not found.", 404);
  }

  const extension = path.extname(absoluteFile).toLowerCase();
  const contentType = contentTypes[extension] ?? "application/octet-stream";

  try {
    const file = await readFile(absoluteFile);

    if (contentType.startsWith("text/html")) {
      const baseHref = `/user-games/${slug}/`;
      const html = file.toString("utf-8").replace(/<head(\s*?)>/i, `<head$1><base href="${baseHref}">`);

      return new Response(html, {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
          "Content-Type": contentType,
        },
      });
    }

    return new Response(file, {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": contentType,
      },
    });
  } catch {
    return badRequest("Unable to read requested file.", 500);
  }
}
