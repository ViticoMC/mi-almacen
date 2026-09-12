import { Directory, File, Paths } from "expo-file-system";
import { Platform } from "react-native";

const IMAGES_DIRECTORY_NAME = "product-images";

function getImagesDirectory(): Directory {
  return new Directory(Paths.document, IMAGES_DIRECTORY_NAME);
}

async function webUriToDataUrl(sourceUri: string): Promise<string> {
  const response = await fetch(sourceUri);

  if (!response.ok) {
    throw new Error(
      `No se pudo leer la imagen seleccionada (${response.status})`,
    );
  }

  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () =>
      reject(reader.error ?? new Error("No se pudo leer la imagen"));
    reader.readAsDataURL(blob);
  });
}

export async function persistProductImage(
  sourceUri: string,
  productId: string,
): Promise<string> {
  if (Platform.OS === "web") {
    return webUriToDataUrl(sourceUri);
  }

  const directory = getImagesDirectory();
  directory.create({ intermediates: true, idempotent: true });

  const source = new File(sourceUri);
  const extension = source.extension || ".jpg";
  const destination = new File(
    directory,
    `${productId}_${Date.now()}${extension}`,
  );

  await source.copy(destination);

  return destination.uri;
}

export function deleteProductImage(path: string | null | undefined) {
  if (!path || Platform.OS === "web") {
    return;
  }

  try {
    const file = new File(path);

    if (file.exists) {
      file.delete();
    }
  } catch {
    // La ruta puede apuntar a un archivo que ya no existe: se ignora.
  }
}