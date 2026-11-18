import { Link, Route, Routes } from 'react-router-dom';
import AddusersApi from '../AddusersApi';
import DeleteApi from '../DeleteApi';
import ProductsApi from '../ProductsApi';
import UpdatePostApi from '../UpdatePostApi';
import HomePage from '../../pages/HomePage';

function RouteShell({ children }) {
  return <div className="page-shell route-shell">{children}</div>;
}

function AboutPage() {
  return (
    <section className="about-page">
      <span className="eyebrow">FROM OUR HOME TO YOURS</span>
      <h1>Thoughtful picks for everyday life.</h1>
      <p>Mustafa brings together useful, well-designed pieces for your home and daily routine.</p>
      <Link className="button button-dark" to="/products">Browse products</Link>
    </section>
  );
}

function NotFoundPage() {
  return (
    <section className="about-page">
      <span className="eyebrow">404</span>
      <h1>We couldn't find that page.</h1>
      <Link className="button button-dark" to="/">Back to home</Link>
    </section>
  );
}

export default function RoutesApi({ search, favoritesOnly }) {
  return (
    <Routes>
      <Route path="/" element={<HomePage search={search} favoritesOnly={favoritesOnly} />} />
      <Route path="/products" element={<RouteShell><ProductsApi search={search} favoritesOnly={favoritesOnly} /></RouteShell>} />
      <Route path="/users" element={<RouteShell><AddusersApi /></RouteShell>} />
      <Route path="/posts/update" element={<RouteShell><UpdatePostApi /></RouteShell>} />
      <Route path="/posts/delete" element={<RouteShell><DeleteApi /></RouteShell>} />
      <Route path="/about" element={<RouteShell><AboutPage /></RouteShell>} />
      <Route path="*" element={<RouteShell><NotFoundPage /></RouteShell>} />
    </Routes>
  );
}
