/**
 * Turns a picked/dropped image file into a data URL small enough to survive in
 * localStorage.
 *
 * The comp used the design harness's <image-slot> custom element, which does
 * not exist outside claude.ai/design — this is its replacement. Full-size
 * phone photos are several MB and localStorage caps out around 5MB per origin,
 * so covers are downscaled and re-encoded as JPEG before they are stored.
 * Once covers move to real object storage this whole module goes away.
 */

const MAX_WIDTH = 1600;
const QUALITY = 0.82;

export const MAX_UPLOAD_BYTES = 12 * 1024 * 1024;

export async function fileToCoverDataUrl(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('That file is not an image.');
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error('That image is over 12MB. Use a smaller one.');
  }

  const dataUrl = await readAsDataUrl(file);

  // SVGs have no meaningful raster size and re-encoding them loses the vector;
  // pass them through untouched.
  if (file.type === 'image/svg+xml') return dataUrl;

  try {
    return await downscale(dataUrl);
  } catch {
    // Canvas can fail (tainted, decode error). The original still works if it
    // fits — the caller surfaces a quota error if it doesn't.
    return dataUrl;
  }
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Could not read that file.'));
    reader.readAsDataURL(file);
  });
}

function downscale(src: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, MAX_WIDTH / img.naturalWidth);
      if (scale === 1 && src.length < 600_000) {
        resolve(src);
        return;
      }
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.naturalWidth * scale);
      canvas.height = Math.round(img.naturalHeight * scale);
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('no 2d context'));
        return;
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', QUALITY));
    };
    img.onerror = () => reject(new Error('Could not decode that image.'));
    img.src = src;
  });
}
