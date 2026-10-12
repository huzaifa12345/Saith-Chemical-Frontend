'use client';

import { useState } from 'react';

export default function ProductGallery({ product }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const imageList =
    product.images?.length > 0
      ? product.images
      : [product.image_url || '/placeholder.png'];

  return (
    <div className="image-main-card">
      <div className="main-view-img">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageList[selectedImage] || '/placeholder.png'}
          alt={`${product.name} - Saith Chemical`}
          className="img-fluid"
        />
      </div>
      <div className="thumb-row mt-3 d-flex gap-2">
        {imageList.map((img, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={`${img}-${i}`}
            src={img || '/placeholder.png'}
            alt=""
            className={`thumb-img ${selectedImage === i ? 'active' : ''}`}
            onClick={() => setSelectedImage(i)}
          />
        ))}
      </div>
    </div>
  );
}
