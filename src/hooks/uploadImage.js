/**
 * uploadImage.js
 *
 * Handles client-side image upload, validation, and preview generation.
 * Currently implements front-end-only logic (FileReader → Data URL).
 *
 * ──────────────────────────────────────────────────────────────────────
 * REAL IMPLEMENTATION (future swap-in)
 * ──────────────────────────────────────────────────────────────────────
 *
 * To wire up actual storage, replace the body of `uploadImage()` with:
 *
 * 1. VALIDATE
 *    - Check file type against allowed MIME types:
 *      ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
 *    - Check file size against a max (e.g. 10MB):
 *      if (file.size > 10 * 1024 * 1024) throw new Error('File too large')
 *    - Optionally validate image dimensions (min/max width/height)
 *
 * 2. UPLOAD TO OBJECT STORAGE
 *    Option A: Signed upload (recommended)
 *      - Call your API: POST /api/upload/sign { filename, contentType }
 *      - Returns: { uploadUrl, key, publicUrl }
 *      - PUT file directly to uploadUrl (S3/R2 signed URL)
 *      - Return publicUrl
 *
 *    Option B: Server-proxied upload
 *      - POST /api/upload with FormData (file field)
 *      - Server stores to S3/R2, returns public URL
 *
 *    Providers: AWS S3, Cloudflare R2, Uploadthing, Supabase Storage
 *
 * 3. RETURN
 *    - Return the public URL of the stored image
 *    - The caller (Customize page) uses it as the preview src
 *    - Store the URL (or key) in cart state for order processing
 *
 * 4. ERROR HANDLING
 *    - Network errors, storage quota, invalid file type
 *    - Surface user-friendly messages
 *
 * 5. OPTIONAL ENHANCEMENTS
 *    - Client-side image compression/resize before upload
 *    - Generate thumbnails for cart/order views
 *    - Progress callback for upload percentage
 *    - Drag-and-drop support (already partially in the UI)
 * ──────────────────────────────────────────────────────────────────────
 */

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

/**
 * Validate a file before upload.
 * @param {File} file
 * @throws {Error} with a user-readable message on invalid file
 */
export function validateFile(file) {
  if (!file) {
    throw new Error('No file selected');
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(`Invalid file type. Allowed: ${ALLOWED_TYPES.map(t => t.split('/')[1]).join(', ')}`);
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error(`File too large. Maximum size: ${MAX_SIZE_BYTES / 1024 / 1024}MB`);
  }
}

/**
 * Read a file as a Data URL (current implementation).
 * For real storage, replace this with the signed-upload or proxy flow.
 *
 * @param {File} file
 * @returns {Promise<{ dataUrl: string, width: number, height: number }>}
 */
export function uploadImage(file) {
  validateFile(file);

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error('Failed to read file'));

    reader.onload = (ev) => {
      const dataUrl = ev.target.result;

      // Detect natural dimensions for aspect-ratio-aware preview
      const img = new Image();
      img.onload = () => {
        resolve({
          dataUrl,
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
      };
      img.onerror = () => reject(new Error('Failed to load image preview'));
      img.src = dataUrl;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Format a file size for display.
 * @param {number} bytes
 * @returns {string}
 */
export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
