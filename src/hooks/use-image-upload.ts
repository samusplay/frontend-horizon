"use client";

import { getUploadUrl } from "@/actions/get-upload-url-action";
import { ALLOWED_IMAGE_TYPES } from "@/src/schemas/events";
import { useRef, useState } from "react";

type Options = { maxMB?: number };

export function useImageUpload({ maxMB = 5 }: Options = {}) {
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  //si el usuario elige otra imagen mientras sube, se ignora el resultado de la anterior
  const lastRequest = useRef(0);

  async function upload(file: File) {
    const requestId = ++lastRequest.current;
    setError("");
    setImageUrl("");

    if (!(ALLOWED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
      setError("Solo se permiten imágenes JPEG, PNG o WEBP");
      return;
    }

    if (file.size > maxMB * 1024 * 1024) {
      setError(`La imagen no puede superar ${maxMB} MB`);
      return;
    }

    setUploading(true);

    try {
      //1. pedimos la url firmada al backend
      const { errors, data } = await getUploadUrl(file.type);
      if (!data) throw new Error(errors[0] ?? "No se pudo preparar la subida");

      //2. el navegador sube directo a S3, sin Authorization y con el mismo Content-Type
      const res = await fetch(data.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      }).catch(() => null);

      if (!res?.ok) throw new Error("No se pudo subir la imagen");

      if (requestId === lastRequest.current) setImageUrl(data.publicUrl);
    } catch (e) {
      if (requestId === lastRequest.current) {
        setError(e instanceof Error ? e.message : "No se pudo subir la imagen");
      }
    } finally {
      if (requestId === lastRequest.current) setUploading(false);
    }
  }

  //limpia el estado, por ejemplo después de crear el evento
  function reset() {
    lastRequest.current++;
    setImageUrl("");
    setError("");
    setUploading(false);
  }

  return { imageUrl, uploading, error, upload, reset };
}