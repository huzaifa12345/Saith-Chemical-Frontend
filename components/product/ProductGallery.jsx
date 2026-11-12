'use client';

import { useState } from 'react';
import {
  getProductImageList,
  optimizeImageUrl,
} from '@/lib/images';

export default function ProductGallery({ product }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const imageList = getProductImageList(product);
  const mainSrc = imageList[selectedImage] || '/placeholder.png';

  return (
    <div className="image-main-card">
      <div className="main-view-img">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={mainSrc}
          alt={`${product.name} - Saith Chemical`}
          className="img-fluid"
          width={1200}
          height={1200}
          fetchPriority="high"
          decoding="async"
        />
      </div>
      <div className="thumb-row mt-3 d-flex gap-2">
        {imageList.map((img, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={`${img}-${i}`}
            src={optimizeImageUrl(img, { width: 160 }) || '/placeholder.png'}
            alt=""
            className={`thumb-img ${selectedImage === i ? 'active' : ''}`}
            width={80}
            height={80}
            loading="lazy"
            onClick={() => setSelectedImage(i)}
          />
        ))}
      </div>
    </div>
  );
}
