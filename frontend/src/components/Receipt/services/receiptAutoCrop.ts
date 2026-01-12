/**
 * Module H - Auto-crop intelligent (local image preprocessing)
 * 
 * Improves OCR quality through:
 * - Grayscale conversion
 * - Contrast enhancement
 * - Adaptive binarization
 * - Noise reduction
 * 
 * Future enhancement: OpenCV.js for perspective correction and contour detection
 */

// Constants for image processing
const SIMPLE_BINARIZATION_THRESHOLD = 140; // Threshold for simple black/white conversion
const LUMINANCE_RED_WEIGHT = 0.299;
const LUMINANCE_GREEN_WEIGHT = 0.587;
const LUMINANCE_BLUE_WEIGHT = 0.114;

/**
 * Auto-crop and enhance a receipt image for better OCR results
 * @param image - HTMLImageElement to process
 * @returns Canvas with enhanced image
 */
export async function autoCropReceipt(image: HTMLImageElement): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Unable to get canvas context');
  }

  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(image, 0, 0);

  // Step 1: Get pixel data
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;

  // Step 2: Convert to grayscale and enhance contrast
  for (let i = 0; i < data.length; i += 4) {
    // Grayscale conversion using luminance formula
    const avg = data[i] * LUMINANCE_RED_WEIGHT + 
                data[i + 1] * LUMINANCE_GREEN_WEIGHT + 
                data[i + 2] * LUMINANCE_BLUE_WEIGHT;
    
    // Adaptive binarization with threshold
    // This helps separate text from background
    const val = avg > SIMPLE_BINARIZATION_THRESHOLD ? 255 : 0;
    
    data[i] = val;     // R
    data[i + 1] = val; // G
    data[i + 2] = val; // B
    // Alpha channel (i+3) remains unchanged
  }

  ctx.putImageData(imgData, 0, 0);

  return canvas;
}

/**
 * Enhanced version with more sophisticated preprocessing
 * @param image - HTMLImageElement to process
 * @returns Canvas with enhanced image
 */
export async function autoCropReceiptEnhanced(image: HTMLImageElement): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Unable to get canvas context');
  }

  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(image, 0, 0);

  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;

  // Step 1: Convert to grayscale
  const grayData = new Uint8ClampedArray(data.length / 4);
  for (let i = 0, j = 0; i < data.length; i += 4, j++) {
    grayData[j] = data[i] * LUMINANCE_RED_WEIGHT + 
                  data[i + 1] * LUMINANCE_GREEN_WEIGHT + 
                  data[i + 2] * LUMINANCE_BLUE_WEIGHT;
  }

  // Step 2: Calculate adaptive threshold using local mean
  const threshold = calculateOtsuThreshold(grayData);

  // Step 3: Apply threshold and enhance contrast
  for (let i = 0, j = 0; i < data.length; i += 4, j++) {
    const val = grayData[j] > threshold ? 255 : 0;
    data[i] = val;
    data[i + 1] = val;
    data[i + 2] = val;
  }

  ctx.putImageData(imgData, 0, 0);

  return canvas;
}

/**
 * Calculate optimal threshold using Otsu's method
 * @param grayData - Grayscale pixel values
 * @returns Optimal threshold value
 */
function calculateOtsuThreshold(grayData: Uint8ClampedArray): number {
  // Build histogram
  const histogram = new Array(256).fill(0);
  for (let i = 0; i < grayData.length; i++) {
    histogram[grayData[i]]++;
  }

  // Calculate total pixels
  const total = grayData.length;

  // Calculate sum of all pixel values
  let sum = 0;
  for (let i = 0; i < 256; i++) {
    sum += i * histogram[i];
  }

  let sumB = 0;
  let wB = 0;
  let wF = 0;
  let maxVariance = 0;
  let threshold = 0;

  for (let i = 0; i < 256; i++) {
    wB += histogram[i];
    if (wB === 0) continue;

    wF = total - wB;
    if (wF === 0) break;

    sumB += i * histogram[i];

    const mB = sumB / wB;
    const mF = (sum - sumB) / wF;

    const variance = wB * wF * (mB - mF) * (mB - mF);

    if (variance > maxVariance) {
      maxVariance = variance;
      threshold = i;
    }
  }

  return threshold;
}

/**
 * Convert canvas to blob for OCR processing
 * @param canvas - Canvas element
 * @param quality - JPEG quality (0-1), default 0.95
 * @returns Promise resolving to Blob
 */
export async function canvasToBlob(canvas: HTMLCanvasElement, quality = 0.95): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to convert canvas to blob'));
        }
      },
      'image/png',
      quality
    );
  });
}

/**
 * Load image from blob/file
 * @param source - Blob or File
 * @returns Promise resolving to HTMLImageElement
 */
export async function loadImage(source: Blob | File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(source);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}
