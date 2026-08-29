import { useState, useRef, useCallback } from 'react';
import { products, frameSizes, frameMaterials, orientations, getSizePrice } from '../data/products';
import { useCart } from '../context/CartContext';
import { uploadImage } from '../hooks/uploadImage';
import { formatPrice } from '../utils/currency';
import styles from './Customize.module.css';

/**
 * Returns the effective width/height of the image as it would sit inside
 * the frame, using object-fit: cover semantics. This tells us which
 * dimension of the source image is clipped.
 */
function getCoverFit(sourceW, sourceH, frameW, frameH) {
  const srcRatio = sourceW / sourceH;
  const frameRatio = frameW / frameH;
  if (srcRatio > frameRatio) {
    // source is wider relative to frame → crop sides
    const displayH = frameH;
    const displayW = frameH * srcRatio;
    return { displayW, displayH, cropped: 'sides' };
  }
  // source is taller relative to frame → crop top/bottom
  const displayW = frameW;
  const displayH = frameW / srcRatio;
  return { displayW, displayH, cropped: 'top/bottom' };
}

export default function Customize() {
  const { addItem } = useCart();
  const fileInputRef = useRef(null);

  const [source, setSource] = useState('browse');
  const [selectedDesign, setSelectedDesign] = useState(products[0]);
  const [customImage, setCustomImage] = useState(null);
  const [uploadedNatural, setUploadedNatural] = useState(null); // { w, h }
  const [selectedSize, setSelectedSize] = useState('11x14');
  const [selectedMaterial, setSelectedMaterial] = useState('black-matte');
  const [selectedOrientation, setSelectedOrientation] = useState('portrait');
  const [uploadError, setUploadError] = useState(null);

  const previewImage = source === 'upload' && customImage
    ? customImage
    : selectedDesign?.image;

  // Determine source image's natural aspect ratio (w/h)
  const sourceRatio = (() => {
    if (source === 'upload' && uploadedNatural) {
      return uploadedNatural.w / uploadedNatural.h;
    }
    if (selectedDesign?.naturalRatio) {
      return selectedDesign.naturalRatio;
    }
    return 0.75; // fallback: portrait 3:4
  })();

  const currentPrice = getSizePrice(selectedSize);
  const materialFee = selectedMaterial === 'brushed-gold' ? 500 : 0;
  const totalPrice = currentPrice + materialFee;

  const handleFileChange = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    try {
      const { dataUrl, width, height } = await uploadImage(file);
      setCustomImage(dataUrl);
      setUploadedNatural({ w: width, h: height });
    } catch (err) {
      setUploadError(err.message);
    }
  }, []);

  const handleAddToCart = () => {
    const size = frameSizes.find((s) => s.id === selectedSize);
    const material = frameMaterials.find((m) => m.id === selectedMaterial);
    const orientation = orientations.find((o) => o.id === selectedOrientation);

    addItem(
      {
        id: 'custom',
        name: source === 'upload' ? 'Custom Upload' : selectedDesign.name,
        category: 'custom',
        price: totalPrice,
      },
      {
        size: selectedSize,
        sizeLabel: size?.label,
        sizePrice: currentPrice,
        material: selectedMaterial,
        materialName: material?.name,
        materialFee,
        orientation: selectedOrientation,
        orientationLabel: orientation?.label,
        customImage: source === 'upload',
      }
    );
  };

  const getFrameDimensions = () => {
    const size = frameSizes.find((s) => s.id === selectedSize);
    if (!size) return { width: 200, height: 260 };

    // Scale frame proportionally based on actual print dimensions
    // so size changes are visually obvious in the preview
    const maxPreviewWidth = 280;
    const maxPreviewHeight = 360;
    const printRatio = size.width / size.height;

    let width, height;
    if (selectedOrientation === 'landscape') {
      // For landscape, swap the ratio: height/width becomes the dominant axis
      const landscapeRatio = size.height / size.width;
      width = maxPreviewWidth;
      height = maxPreviewWidth * landscapeRatio;
      if (height > maxPreviewHeight) {
        height = maxPreviewHeight;
        width = maxPreviewHeight / landscapeRatio;
      }
    } else if (selectedOrientation === 'square') {
      const dim = Math.min(maxPreviewWidth, maxPreviewHeight);
      width = dim;
      height = dim;
    } else {
      // Portrait: use print ratio directly
      width = maxPreviewWidth;
      height = maxPreviewWidth / printRatio;
      if (height > maxPreviewHeight) {
        height = maxPreviewHeight;
        width = maxPreviewHeight * printRatio;
      }
    }

    return { width: Math.round(width), height: Math.round(height) };
  };

  const frameDims = getFrameDimensions();
  const material = frameMaterials.find((m) => m.id === selectedMaterial);

  // Compute how the image covers the frame — used for crop warning
  const frameRatio = frameDims.width / frameDims.height;
  const ratioDiff = Math.abs(sourceRatio - frameRatio);
  const isSignificantCrop = ratioDiff > 0.35;

  // Determine which dimension the source is "off" by
  const { cropped } = getCoverFit(sourceRatio * 100, 100, frameRatio * 100, 100);

  return (
    <main className={styles.page}>
      <div className="container">
        <div className={styles.pageHeader}>
          <p className={styles.pageLabel}>Customization Studio</p>
          <h1 className={styles.pageTitle}>Build Your Frame</h1>
        </div>

        <div className={styles.layout}>
          {/* Preview */}
          <div className={styles.previewSection}>
            <div className={styles.previewFrame}>
              <div
                className={styles.frame}
                style={{
                  backgroundColor: material?.hex || '#1A1A1A',
                  width: frameDims.width + 32,
                  height: frameDims.height + 32,
                }}
              >
                <div
                  className={styles.frameInner}
                  style={{ width: frameDims.width, height: frameDims.height }}
                >
                  {previewImage ? (
                    <>
                      <img
                        src={previewImage}
                        alt="Preview"
                        className={styles.frameImage}
                      />
                      {isSignificantCrop && (
                        <span className={styles.cropWarning}>
                          {sourceRatio > frameRatio
                            ? 'Sides cropped'
                            : 'Top/bottom cropped'}
                        </span>
                      )}
                    </>
                  ) : (
                    <div
                      className={styles.uploadPlaceholder}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <svg className={styles.uploadIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="M21 15l-5-5L5 21" />
                      </svg>
                      <span className={styles.uploadText}>Click to upload</span>
                      <span className={styles.uploadHint}>JPG, PNG up to 10MB</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <p className={styles.previewLabel}>Live Preview</p>
            {isSignificantCrop && (
              <p className={styles.cropNote}>
                Image aspect ({sourceRatio > 1 ? 'landscape' : 'portrait'}) differs from frame ({selectedOrientation}). Significant cropping will occur.
              </p>
            )}
          </div>

          {/* Options */}
          <div className={styles.optionsSection}>
            {/* Source */}
            <div className={styles.optionGroup}>
              <p className={styles.optionLabel}>Image Source</p>
              <div className={styles.sourceTabs}>
                <button
                  className={`${styles.sourceTab} ${source === 'browse' ? styles.sourceTabActive : ''}`}
                  onClick={() => setSource('browse')}
                >
                  Browse Designs
                </button>
                <button
                  className={`${styles.sourceTab} ${source === 'upload' ? styles.sourceTabActive : ''}`}
                  onClick={() => setSource('upload')}
                >
                  Upload Photo
                </button>
              </div>

              {source === 'browse' ? (
                <div className={styles.designGrid}>
                  {products.map((product) => (
                    <button
                      key={product.id}
                      className={`${styles.designOption} ${selectedDesign?.id === product.id ? styles.designOptionActive : ''}`}
                      onClick={() => setSelectedDesign(product)}
                    >
                      <img src={product.image} alt={product.name} loading="lazy" />
                      <span className={styles.designOptionName}>{product.name}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                  <div
                    className={styles.uploadArea}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <svg className={styles.uploadAreaIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    <p className={styles.uploadAreaText}>
                      {customImage ? 'Change photo' : 'Drop a photo or click to browse'}
                    </p>
                    <p className={styles.uploadAreaHint}>JPG, PNG, WebP — up to 10MB</p>
                  </div>
                  {uploadError && (
                    <p className={styles.uploadError}>{uploadError}</p>
                  )}
                </div>
              )}
            </div>

            {/* Size */}
            <div className={styles.optionGroup}>
              <p className={styles.optionLabel}>Size</p>
              <div className={styles.sizeGrid}>
                {frameSizes.map((size) => (
                  <button
                    key={size.id}
                    className={`${styles.sizeBtn} ${selectedSize === size.id ? styles.sizeBtnActive : ''}`}
                    onClick={() => setSelectedSize(size.id)}
                  >
                    <span className={styles.sizeBtnLabel}>{size.label}</span>
                    <span className={styles.sizeBtnPrice}>{formatPrice(size.price)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Frame Material */}
            <div className={styles.optionGroup}>
              <p className={styles.optionLabel}>Frame Material</p>
              <div className={styles.materialGrid}>
                {frameMaterials.map((mat) => (
                  <button
                    key={mat.id}
                    className={`${styles.materialBtn} ${selectedMaterial === mat.id ? styles.materialBtnActive : ''}`}
                    onClick={() => setSelectedMaterial(mat.id)}
                  >
                    <span
                      className={styles.materialSwatch}
                      style={{ backgroundColor: mat.hex }}
                    />
                    {mat.name}
                    {mat.id === 'brushed-gold' && ` +${formatPrice(500)}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Orientation */}
            <div className={styles.optionGroup}>
              <p className={styles.optionLabel}>Orientation</p>
              <div className={styles.orientationGrid}>
                {orientations.map((o) => (
                  <button
                    key={o.id}
                    className={`${styles.orientationBtn} ${selectedOrientation === o.id ? styles.orientationBtnActive : ''}`}
                    onClick={() => setSelectedOrientation(o.id)}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className={styles.priceSummary}>
              <div className={styles.priceRow}>
                <span className={styles.priceLabel}>Print + Frame</span>
                <span className={styles.priceValue}>{formatPrice(currentPrice)}</span>
              </div>
              {materialFee > 0 && (
                <div className={styles.priceRow}>
                  <span className={styles.priceLabel}>Material upgrade</span>
                  <span className={styles.priceValue}>+{formatPrice(materialFee)}</span>
                </div>
              )}
              <div className={styles.priceRowTotal}>
                <span>Total</span>
                <span className={styles.priceAccent}>{formatPrice(totalPrice)}</span>
              </div>
            </div>

            <button onClick={handleAddToCart} className={styles.addToCartBtn}>
              Add to Cart — {formatPrice(totalPrice)}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
