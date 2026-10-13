import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="wrap max-w-xl">
        <h1 className="section-title text-forest">Page not found</h1>
        <p className="lede mt-4 text-stone">
          The page you&rsquo;re looking for doesn&rsquo;t exist or has moved.
        </p>
        <Link href="/" className="btn btn-primary mt-8">
          Back to the homepage
        </Link>
      </div>
    </section>
  );
}
