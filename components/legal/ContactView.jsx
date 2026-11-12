import Link from 'next/link';
import ProductPageChrome from '@/components/product/ProductPageChrome';

const ADDRESS =
  'Shop No. D-2490, Near Mosque Qadir, Koocha Dogran, Alam Market, Lahore, Pakistan';
const PHONE_DISPLAY = '+92 322 7594213';
const WHATSAPP = 'https://wa.me/923227594213';
const MAPS_EMBED =
  'https://maps.google.com/maps?q=Alam%20Market%20Lahore&t=&z=15&ie=UTF8&iwloc=&output=embed';

export default function ContactView() {
  return (
    <ProductPageChrome>
      <main className="container py-5">
        <h1 className="h2 fw-bold mb-2">Contact Saith Chemical</h1>
        <p className="text-muted mb-4" style={{ maxWidth: 640 }}>
          Reach us for Grace Plus dishwash bars, washing powder, bulk supply and
          order support in Lahore.
        </p>

        <div className="row g-4">
          <div className="col-lg-5">
            <div className="p-4 bg-white rounded-3 shadow-sm h-100">
              <h2 className="h5 fw-bold">Store details</h2>
              <p className="mb-3">
                <strong>Address</strong>
                <br />
                {ADDRESS}
              </p>
              <p className="mb-3">
                <strong>Phone / WhatsApp</strong>
                <br />
                <a href="tel:+923227594213">{PHONE_DISPLAY}</a>
              </p>
              <a
                href={WHATSAPP}
                className="btn btn-primary"
                target="_blank"
                rel="noreferrer"
              >
                Chat on WhatsApp
              </a>
              <p className="small text-muted mt-3 mb-0">
                Or browse{' '}
                <Link href="/all-products">all products</Link> and place an
                order online.
              </p>
            </div>
          </div>
          <div className="col-lg-7">
            <div className="ratio ratio-16x9 rounded-3 overflow-hidden shadow-sm">
              <iframe
                title="Saith Chemical location map"
                src={MAPS_EMBED}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                style={{ border: 0 }}
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </main>
    </ProductPageChrome>
  );
}
