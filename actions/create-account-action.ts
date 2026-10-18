"use server";

import { ProblemDetailsSchema, RegisterResponseSchema, RegisterSchema, RegisterSuccessSchema } from "@/src/schemas/auth";



type ActionStateType = {
    errors: string[];
    success: string;
};

export async function register(prevState: ActionStateType, formData: FormData) {
    const registerData = {
        email: formData.get("email"),
        password: formData.get("password"),
        role: formData.get("role"),
    };

    const result = RegisterSchema.safeParse(registerData);

    if (!result.success) {
        const errors = result.error.issues.map((issues) => issues.message);
        return { errors, success: prevState.success };
    }

    const url = `${process.env.API_URL}/api/identity/users/register`;

    const req = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
    });

    const json = await req.json();

    if (!req.ok) {
        const problem = ProblemDetailsSchema.safeParse(json);
        const message = problem.success ? problem.data.detail : "Ocurrió un error inesperado.";
        return { errors: [message], success: "" };
    }

    const response = RegisterResponseSchema.parse(json);

    const success = RegisterSuccessSchema.parse({
        message: "Cuenta creada correctamente.",
        id: response.id,
    });

    return {
        errors: [],
        success: success.message
    };
}