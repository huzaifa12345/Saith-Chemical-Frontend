import { notFound } from 'next/navigation';
import { getProductPageData } from '@/lib/api-server';
import { isProductAvailable } from '@/lib/schema';
import { buildProductMetadata } from '@/lib/seo';
import ProductPageChrome from '@/components/product/ProductPageChrome';
import ProductJsonLd from '@/components/product/ProductJsonLd';
import ProductInfoSSR from '@/components/product/ProductInfoSSR';
import ProductSpecs from '@/components/product/ProductSpecs';
import ProductFaq from '@/components/product/ProductFaq';
import ProductGallery from '@/components/product/ProductGallery';
import ProductPurchaseActions from '@/components/product/ProductPurchaseActions';
import ProductReviews from '@/components/product/ProductReviews';
import ProductApiUnavailable from '@/components/product/ProductApiUnavailable';
import '@/styles/ThemeProductDetail.css';

export async function generateMetadata({ params }) {
  const { barcode } = await params;

  let product = null;
  let apiDown = false;

  try {
    const data = await getProductPageData(barcode);
    product = data.product;
  } catch {
    apiDown = true;
  }

  // Missing product → real 404 (do not wrap notFound() in try/catch)
  if (!apiDown && !product) {
    notFound();
  }

  if (apiDown || !product) {
    return {
      title: {
        absolute: 'Product | Saith Chemical',
      },
      description:
        'Browse premium home-care and cleaning products from Saith Chemical.',
      robots: 'noindex, nofollow',
    };
  }

  return buildProductMetadata(product, barcode);
}

export default async function ProductPage({ params }) {
  const { barcode } = await params;

  let product = null;
  let reviews = [];
  let apiDown = false;

  try {
    const data = await getProductPageData(barcode);
    product = data.product;
    reviews = data.reviews;
  } catch {
    apiDown = true;
  }

  if (!apiDown && !product) {
    notFound();
  }

  if (apiDown || !product) {
    return (
      <ProductPageChrome>
        <ProductApiUnavailable barcode={barcode} />
      </ProductPageChrome>
    );
  }

  const isAvailable = isProductAvailable(product);

  return (
    <>
      <ProductJsonLd
        product={product}
        reviews={reviews}
        isAvailable={isAvailable}
      />

      <ProductPageChrome>
        <main className="container py-5">
          <div className="row g-5">
            <div className="col-lg-6">
              <ProductGallery product={product} />
            </div>

            <div className="col-lg-6">
              <article className="product-content-box">
                <ProductInfoSSR
                  product={product}
                  reviews={reviews}
                  isAvailable={isAvailable}
                />

                <ProductSpecs product={product} isAvailable={isAvailable} />

                <ProductPurchaseActions
                  product={product}
                  isAvailable={isAvailable}
                />
              </article>
            </div>
          </div>

          <ProductFaq product={product} />
          <ProductReviews productId={product.id} initialReviews={reviews} />
        </main>
      </ProductPageChrome>
    </>
  );
}
