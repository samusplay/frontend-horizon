"use server";

import { GoLiveSchema } from "@/src/schemas/streams";

type ActionStateType = {
  errors: string[];
  success: string;
};

// ---------------------------------------------------------------------------
// Inicia una transmisión desde el dashboard del creador.
// TODO backend:
//   import { ProblemDetailsSchema } from "@/src/schemas/auth";
//
//   const res = await fetch(`${process.env.API_URL}/api/streams`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${await getToken()}`,
//     },
//     body: JSON.stringify(result.data),
//   });
//   if (!res.ok) {
//     const problem = ProblemDetailsSchema.safeParse(await res.json());
//     return { errors: [problem.success ? problem.data.detail : "Error."], success: "" };
//   }
// ---------------------------------------------------------------------------

export async function goLive(prevState: ActionStateType, formData: FormData) {
  const streamData = {
    title: formData.get("title"),
    categorySlug: formData.get("categorySlug"),
    description: formData.get("description") ?? "",
  };

  const result = GoLiveSchema.safeParse(streamData);

  if (!result.success) {
    const errors = result.error.issues.map((issue) => issue.message);
    return { errors, success: prevState.success };
  }

  return {
    errors: [],
    success: `Transmisión preparada: "${result.data.title}" (demo sin backend).`,
  };
}
