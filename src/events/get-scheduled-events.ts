import { CatalogSchema } from "@/src/schemas/events";

//eventos programados que aún no empiezan, o que debieron empezar hace poco y siguen esperando al creador
export async function getScheduledEvents() {
  const from = new Date(Date.now() - 2 * 3_600_000).toISOString();

  const req = await fetch(`${process.env.API_URL}/api/events?status=Scheduled&from=${from}&pageSize=50`, {
    cache: "no-store",
  });

  if (!req.ok) throw new Error("No se pudieron cargar los eventos programados");

  return CatalogSchema.parse(await req.json()).items;
}