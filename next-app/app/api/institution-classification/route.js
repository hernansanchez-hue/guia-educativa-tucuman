import { createSupabaseServiceClient } from "../../../lib/supabase/service";
import { controlMode } from "../../../lib/control/store";
import { project } from "../../../lib/control/domain.mjs";
import { isExtendedRecord } from "../../../lib/control/extended.mjs";
import {
  editorialCatalog,
  cityPageFromCatalog,
} from "../../../lib/admin/editorial-model.mjs";
import {
  getVersionedPublicCatalogEntries,
  PUBLIC_CATALOG_VERSION,
} from "../../../lib/catalog/versioned-public-catalog.mjs";
import {
  buildCommercialSnapshot,
  createSnapshotRequestHandler,
  publicationReader,
  readStablePublications,
} from "../../../lib/integration/commercial-snapshot.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const handle = createSnapshotRequestHandler({
  getSecret: () => process.env.GET_CATALOG_SYNC_SECRET,
  async getSnapshot() {
    // Nunca informar el catálogo base como si fuera vigente cuando el almacén
    // publicado está apagado, mal configurado o no responde.
    if (controlMode() !== "supabase")
      throw new Error("Almacén publicado no disponible.");
    const reader = publicationReader(
      createSupabaseServiceClient(),
      AbortSignal.timeout(12000),
    );
    const { revision, publications } = await readStablePublications(reader);
    const entries = project(
      getVersionedPublicCatalogEntries(),
      publications.filter((row) => !isExtendedRecord(row)),
    );
    return buildCommercialSnapshot({
      entries,
      catalogVersion: PUBLIC_CATALOG_VERSION,
      revision,
      generatedAt: new Date().toISOString(),
      editorialCatalog,
      cityPageFromCatalog,
    });
  },
});

export async function GET(request) {
  return handle(request);
}
export async function HEAD(request) {
  return handle(request);
}
