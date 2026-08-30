import { useState, useRef, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { products, frameSizes, frameMaterials, textures, getSizePrice } from '../data/products';
import { useCart } from '../context/CartContext';
import { uploadImage } from '../hooks/uploadImage';
import { formatPrice } from '../utils/currency';
import { useHead } from '../hooks/useHead';
import styles from './Customize.module.css';

// Only framed-posters products are available for customization
const framedProducts = products.filter((p) => p.category === 'framed-posters' && p.status === 'Active');

function getCoverFit(sourceW, sourceH, frameW, frameH) {
  const srcRatio = sourceW / sourceH;
  const frameRatio = frameW / frameH;
  if (srcRatio > frameRatio) {
    const displayH = frameH;
    const displayW = frameH * srcRatio;
    return { displayW, displayH, cropped: 'sides' };
  }
  const displayW = frameW;
  const displayH = frameW / srcRatio;
  return { displayW, displayH, cropped: 'top/bottom' };
}

export default function Customize() {
  const { addItem } = useCart();
  const fileInputRef = useRef(null);
  useHead({ title: 'Custom Frame', description: 'Design your own custom frame at Gen X Gallery. Choose your print, frame material, size, and finish.' });

  const [source, setSource] = useState('browse');
  const [selectedDesign, setSelectedDesign] = useState(products[0]);
  const [customImage, setCustomImage] = useState(null);
  const [uploadedNatural, setUploadedNatural] = useState(null);
  const [selectedSize, setSelectedSize] = useState('a4');
  const [selectedMaterial, setSelectedMaterial] = useState('black');
  const [selectedTexture, setSelectedTexture] = useState('matte');
  const [uploadError, setUploadError] = useState(null);

  const previewImage = source === 'upload' && customImage
    ? customImage
    : selectedDesign?.image;

  const sourceRatio = (() => {
    if (source === 'upload' && uploadedNatural) {
      return uploadedNatural.w / uploadedNatural.h;
    }
    if (selectedDesign?.naturalRatio) {
      return selectedDesign.naturalRatio;
    }
    return 0.75;
  })();

  const currentPrice = getSizePrice(selectedSize);
  const textureFee = textures.find((t) => t.id === selectedTexture)?.upcharge || 0;
  const totalPrice = currentPrice + textureFee;

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
    const texture = textures.find((t) => t.id === selectedTexture);

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
        texture: selectedTexture,
        textureName: texture?.name,
        textureFee,
        customImage: source === 'upload',
      }
    );
  };

  // Memoize frame dimensions — only recalculates when selectedSize changes
  const frameDims = useMemo(() => {
    const size = frameSizes.find((s) => s.id === selectedSize);
    if (!size) return { width: 200, height: 280, scale: 0.7 };

    const a4Size = frameSizes.find((s) => s.id === 'a4');
    const maxPreviewWidth = 280;
    const maxPreviewHeight = 380;

    const a4Ratio = a4Size.width / a4Size.height;
    let a4Width = maxPreviewWidth;
    let a4Height = maxPreviewWidth / a4Ratio;
    if (a4Height > maxPreviewHeight) {
      a4Height = maxPreviewHeight;
      a4Width = maxPreviewHeight * a4Ratio;
    }

    const scaleFactor = Math.sqrt((size.width * size.height) / (a4Size.width * a4Size.height));
    return { width: Math.round(a4Width), height: Math.round(a4Height), scale: scaleFactor };
  }, [selectedSize]);

  const material = frameMaterials.find((m) => m.id === selectedMaterial);

  // Memoize material styles — only recalculates when selectedMaterial changes
  // Width/height are constant (always A4); only transform scale changes per size
  const materialStyles = useMemo(() => {
    const base = {
      width: frameDims.width + 32,
      height: frameDims.height + 32,
    };
    switch (selectedMaterial) {
      case 'black':
        return {
          ...base,
          background: 'linear-gradient(145deg, #2a2a2a 0%, #1A1A1A 30%, #111111 70%, #1a1a1a 100%)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.3), inset 1px 0 0 rgba(255,255,255,0.04), inset -1px 0 0 rgba(0,0,0,0.2)',
        };
      case 'white':
        return {
          ...base,
          background: 'linear-gradient(145deg, #ffffff 0%, #f8f8f8 30%, #efefef 70%, #f5f5f5 100%)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(0,0,0,0.08), inset 1px 0 0 rgba(255,255,255,0.6), inset -1px 0 0 rgba(0,0,0,0.05)',
        };
      case 'silver':
        return {
          ...base,
          background: 'linear-gradient(145deg, #d8d8d8 0%, #e8e8e8 15%, #f5f5f5 30%, #c8c8c8 50%, #b0b0b0 70%, #c5c5c5 85%, #d5d5d5 100%)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.7), inset 0 -1px 0 rgba(0,0,0,0.15), inset 1px 0 0 rgba(255,255,255,0.5), inset -1px 0 0 rgba(0,0,0,0.1)',
        };
      default:
        return { ...base, background: material?.hex || '#1A1A1A' };
    }
  }, [selectedMaterial, frameDims.width, frameDims.height, material]);

  // Only the transform changes on size selection — this is the animated property
  const frameStyle = useMemo(() => ({
    ...materialStyles,
    transform: `scale(${frameDims.scale})`,
    transformOrigin: 'center center',
  }), [materialStyles, frameDims.scale]);

  const frameRatio = frameDims.width / frameDims.height;
  const ratioDiff = Math.abs(sourceRatio - frameRatio);
  const isSignificantCrop = ratioDiff > 0.35;

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
                style={frameStyle}
              >
                <div
                  className={`${styles.frameInner} ${selectedTexture === 'glossy' ? styles.glossy : styles.matte}`}
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
                Image aspect ({sourceRatio > 1 ? 'landscape' : 'portrait'}) differs from frame. Significant cropping may occur.
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
                  {framedProducts.map((product) => (
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
              <p className={styles.optionLabel}>Frame</p>
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
                  </button>
                ))}
              </div>
            </div>

            {/* Texture */}
            <div className={styles.optionGroup}>
              <p className={styles.optionLabel}>Finish</p>
              <div className={styles.textureGrid}>
                {textures.map((tex) => (
                  <button
                    key={tex.id}
                    className={`${styles.textureBtn} ${selectedTexture === tex.id ? styles.textureBtnActive : ''}`}
                    onClick={() => setSelectedTexture(tex.id)}
                  >
                    <span className={styles.textureIcon}>
                      {tex.id === 'glossy' ? '✦' : '●'}
                    </span>
                    {tex.name}
                    {tex.upcharge > 0 && ` +${formatPrice(tex.upcharge)}`}
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
              {textureFee > 0 && (
                <div className={styles.priceRow}>
                  <span className={styles.priceLabel}>Finish upgrade</span>
                  <span className={styles.priceValue}>+{formatPrice(textureFee)}</span>
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
            <p style={{ fontSize: '0.8rem', color: 'var(--color-ink-muted)', textAlign: 'center', marginTop: '12px' }}>
              Custom orders are made to spec · <Link to="/returns" style={{ color: 'var(--color-accent-text)' }}>Final sale — see returns policy</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
