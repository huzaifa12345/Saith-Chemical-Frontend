import Link from 'next/link';

export default function ProductApiUnavailable({ barcode }) {
  return (
    <div className="container py-5 text-center" style={{ minHeight: '60vh' }}>
      <h1 className="h3 mb-3">Store API unavailable</h1>
      <p className="text-muted mb-2">
        The product page could not load data from the Express backend.
      </p>
      {barcode && (
        <p className="small text-muted mb-4">
          Requested barcode: <code>{barcode}</code>
        </p>
      )}
      <p className="small text-muted mb-4">
        Start the API with <code>cd Backend &amp;&amp; npm run dev</code>, ensure
        <code>API_URL</code> matches its port, then refresh Next.js.
      </p>
      <Link href="/" className="btn btn-primary">
        Back to home
      </Link>
    </div>
  );
}
