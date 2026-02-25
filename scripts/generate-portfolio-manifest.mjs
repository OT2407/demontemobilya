import { existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { extname, join, posix, relative } from "node:path";

const supportedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
const requiredSlugs = [
  "erkan-ipek-residence",
  "fatih-ari-apartment",
  "sultan-erenkoylu-residence",
];

const cwd = process.cwd();
const portfolioRoot = join(cwd, "public", "images", "portfolio");
const galleryRoot = join(cwd, "public", "images", "gallery");

function ensureBaseStructure() {
  mkdirSync(portfolioRoot, { recursive: true });
  for (const slug of requiredSlugs) {
    mkdirSync(join(portfolioRoot, slug), { recursive: true });
  }
  mkdirSync(galleryRoot, { recursive: true });
}

function collectFilesRecursively(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...collectFilesRecursively(fullPath));
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    const ext = extname(entry.name).toLowerCase();
    if (!supportedExtensions.has(ext)) {
      continue;
    }

    const relativePath = relative(join(cwd, "public"), fullPath).split("\\").join("/");
    files.push(`/${posix.normalize(relativePath)}`);
  }

  return files;
}

function buildManifest() {
  if (!existsSync(portfolioRoot)) {
    return {};
  }

  const manifest = {};
  const slugDirs = readdirSync(portfolioRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));

  for (const slug of slugDirs) {
    const slugDir = join(portfolioRoot, slug);
    const files = collectFilesRecursively(slugDir).sort((a, b) => a.localeCompare(b));
    manifest[slug] = files;
  }

  return manifest;
}

function writeManifest(manifest) {
  const manifestPath = join(portfolioRoot, "manifest.json");
  const payload = {
    generatedAt: new Date().toISOString(),
    projects: manifest,
  };

  writeFileSync(manifestPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  console.log(`Generated ${manifestPath}`);
}

function writeGalleryManifest() {
  const manifestPath = join(galleryRoot, "manifest.json");
  const images = collectFilesRecursively(galleryRoot)
    .filter((path) => !path.endsWith("/manifest.json"))
    .sort((a, b) => a.localeCompare(b));
  const payload = {
    generatedAt: new Date().toISOString(),
    images,
  };

  writeFileSync(manifestPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  console.log(`Generated ${manifestPath}`);
}

ensureBaseStructure();
writeManifest(buildManifest());
writeGalleryManifest();
