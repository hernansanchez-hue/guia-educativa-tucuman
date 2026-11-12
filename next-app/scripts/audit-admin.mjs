/** Read-only inventory. Run from next-app: node scripts/audit-admin.mjs
 * Prints JSON; never reads .env values or writes source files/database records.
 */
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { dirname, resolve, relative, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { cityPages, institutions } from "../app/data/institutions.js";
import { careers } from "../app/data/careers.js";
import { offerings } from "../app/data/offerings.js";
import { trainingPrograms } from "../app/data/trainingPrograms.js";
import { trainingOfferings } from "../app/data/trainingOfferings.js";
import { teacherCourses } from "../app/data/teacherCourses.js";
import { services, servicePlans } from "../app/data/services.js";
import { events } from "../app/data/events.js";
import { getLocalPublicRoutePaths } from "../lib/public-catalog/public-routes-catalog.js";
import { ADMIN_BRANDING, ADMIN_MODULES } from "../lib/admin/module-registry.mjs";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = resolve(appRoot, "..");
const normalized = (path) => path.replaceAll("\\", "/");
const localPath = (path) => normalized(relative(appRoot, path));

function walk(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  }).sort();
}

function dependencyPath(file, specifier) {
  if (!specifier.startsWith(".")) return null;
  const base = resolve(dirname(file), specifier);
  return [base, `${base}.js`, `${base}.mjs`, `${base}.css`].find((path) => existsSync(path) && statSync(path).isFile()) ?? null;
}

function scanFile(file) {
  const text = readFileSync(file, "utf8");
  const imports = [...text.matchAll(/(?:\bfrom\s*|\bimport\s*)["']([^"']+)["']/g)].map((match) => match[1]);
  const resources = [...text.matchAll(/(?:https:\/\/[^\s"'`<>]+|\/assets\/[^\s"'`<>)}]+)/g)].map((match) => match[0]);
  return {
    file: localPath(file),
    kind: localPath(file).startsWith("app/data/") ? "local-data" : file.endsWith(".css") ? "style" : file.endsWith("/page.js") || file.endsWith("\\page.js") ? "route" : "component-or-adapter",
    client: /^\s*["']use client["']/.test(text),
    imports: [...new Set(imports)],
    dependencies: imports.map((specifier) => dependencyPath(file, specifier)).filter(Boolean).map(localPath),
    exports: [...text.matchAll(/export\s+(?:default\s+)?(?:async\s+)?(?:function|const|class)\s+(\w+)/g)].map((match) => match[1]),
    inlineCollections: [...text.matchAll(/(?:const|let)\s+(\w+)\s*=\s*\[/g)].map((match) => match[1]),
    resources: [...new Set(resources)].sort(),
    revalidate: text.match(/export const revalidate\s*=\s*(\d+)/)?.[1] ?? null,
    dynamicParams: text.match(/export const dynamicParams\s*=\s*(true|false)/)?.[1] ?? "default",
    hasMetadata: /export\s+(?:const metadata|(?:async\s+)?function generateMetadata)/.test(text),
    hasStaticParams: /export\s+(?:async\s+)?function generateStaticParams/.test(text),
  };
}

const sourceFiles = [
  ...walk(resolve(appRoot, "app")),
  ...walk(resolve(appRoot, "lib/public-catalog")),
  ...walk(resolve(appRoot, "lib/seo")),
].filter((file) => [".js", ".mjs", ".css"].includes(extname(file)));
const files = sourceFiles.map(scanFile);
const fileByPath = new Map(files.map((item) => [item.file, item]));

function dependencyClosure(file, found = new Set()) {
  if (found.has(file)) return found;
  found.add(file);
  for (const dependency of fileByPath.get(file)?.dependencies ?? []) dependencyClosure(dependency, found);
  return found;
}

const routes = files.filter((file) => file.kind === "route").map((file) => ({
  pattern: `/${file.file.replace(/^app\//, "").replace(/\/?page\.js$/, "")}`.replace(/\/$/, "") || "/",
  file: file.file,
  dependencyClosure: [...dependencyClosure(file.file)].sort(),
  hasMetadata: file.hasMetadata,
  hasStaticParams: file.hasStaticParams,
  dynamicParams: file.dynamicParams,
  revalidate: file.revalidate,
}));

const collections = { cities: Object.values(cityPages), institutions, careers, offerings, trainingPrograms, trainingOfferings, teacherCourses, events, services, servicePlans };
const entityInventory = Object.fromEntries(Object.entries(collections).map(([name, rows]) => [name, {
  count: rows.length,
  fields: [...new Set(rows.flatMap((row) => Object.keys(row)))].sort(),
  identities: rows.map((row) => ({ id: row.id ?? null, slug: row.slug ?? null, citySlug: row.citySlug ?? null })),
}]));

const literalPublicPaths = [...new Set([
  ...getLocalPublicRoutePaths(), "/eventos", "/servicios",
  ...events.map((event) => `/eventos/${event.slug}`),
  ...services.map((service) => `/servicios/${service.slug}`),
])].sort();

const assets = walk(resolve(appRoot, "public")).map((file) => {
  const url = `/${normalized(relative(resolve(appRoot, "public"), file))}`;
  return { url, bytes: statSync(file).size, referencedBy: files.filter((source) => source.resources.some((resource) => resource === url || resource.startsWith(`${url}?`))).map((source) => source.file) };
});

console.log(JSON.stringify({
  schemaVersion: 1,
  scope: "Read-only filesystem inventory. Literal references and local sample data; computed resources may require manual review.",
  framework: JSON.parse(readFileSync(resolve(appRoot, "package.json"), "utf8")).dependencies,
  logo: ADMIN_BRANDING,
  modules: ADMIN_MODULES,
  routes, literalPublicPaths, entityInventory, files, assets,
  externalOrigins: [...new Set(files.flatMap((file) => file.resources.filter((resource) => resource.startsWith("https://")).map((resource) => { try { return new URL(resource).origin; } catch { return resource; } })))].sort(),
  migrations: walk(resolve(repoRoot, "supabase/migrations")).map((file) => normalized(relative(repoRoot, file))),
}, null, 2));
