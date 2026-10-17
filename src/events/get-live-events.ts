import { CatalogSchema } from "@/src/schemas/events";

//eventos que están transmitiendo ahora mismo: el backend es quien decide el estado Live
export async function getLiveEvents() {
  const req = await fetch(`${process.env.API_URL}/api/events?status=Live&pageSize=50`, {
    cache: "no-store",
  });

  if (!req.ok) throw new Error("No se pudieron cargar las transmisiones");

  return CatalogSchema.parse(await req.json()).items;
}