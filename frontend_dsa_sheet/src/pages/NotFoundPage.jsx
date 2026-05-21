import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <main className="page-shell centered-shell">
    <section className="notfound-card">
      <h1>Page not found</h1>
      <p>The page you are looking for doesn’t exist or has been moved.</p>
      <Link to="/dashboard" className="primary-button">
        Back to dashboard
      </Link>
    </section>
  </main>
);

export default NotFoundPage;
