import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { RotateCw } from 'lucide-react';
import ProductCard from './ProductCard';
import { useZustandApi } from './Zustand/ZustandApi';

export default function ProductsApi({ search = '', favoritesOnly = false }) {
  const [apiProducts, setApiProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const favorites = useZustandApi((state) => state.favorites);
  const toggleFavorite = useZustandApi((state) => state.toggleFavorite);
  const addToCart = useZustandApi((state) => state.addToCart);

  useEffect(() => {
    const controller = new AbortController();
    async function getProducts() {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get('https://dummyjson.com/products?limit=24', {
          signal: controller.signal,
        });
        setApiProducts(Array.isArray(response.data?.products) ? response.data.products : []);
      } catch {
        if (!controller.signal.aborted) setError('We could not load the products. Please try again.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    getProducts();
    return () => controller.abort();
  }, [retry]);

  const products = useMemo(() => apiProducts.map((item) => ({
    id: 'api-' + item.id,
    name: item.title,
    category: item.category,
    categoryLabel: item.category.replaceAll('-', ' '),
    price: item.price,
    currency: 'USD',
    rating: Number(item.rating || 0).toFixed(1),
    reviews: Array.isArray(item.reviews) ? item.reviews.length : 0,
    badge: item.availabilityStatus === 'Low Stock' ? 'Low stock' : undefined,
    image: item.thumbnail || item.images?.[0] || '',
    alt: item.title,
  })), [apiProducts]);

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('en');
    return products.filter((product) => {
      const matchesSearch = !query || (product.name + ' ' + product.categoryLabel).toLocaleLowerCase('en').includes(query);
      const matchesFavorite = !favoritesOnly || favorites.includes(product.id);
      return matchesSearch && matchesFavorite;
    });
  }, [favorites, favoritesOnly, products, search]);

  return (
    <section className="products-section api-products-section" id="products">
      <div className="section-heading">
        <div><span className="eyebrow">LIVE PRODUCT API</span><h2>Products</h2></div>
        <p>{loading ? 'Loading products...' : visibleProducts.length + ' products loaded from the API'}</p>
      </div>
      {loading ? (
        <div className="users-message" role="status">Loading products...</div>
      ) : error ? (
        <div className="users-message users-error" role="alert">
          <span>{error}</span>
          <button className="button button-outline" type="button" onClick={() => setRetry((value) => value + 1)}><RotateCw size={15} /> Try again</button>
        </div>
      ) : visibleProducts.length ? (
        <div className="product-grid">
          {visibleProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              favorite={favorites.includes(product.id)}
              onFavorite={toggleFavorite}
              onAdd={addToCart}
            />
          ))}
        </div>
      ) : (
        <div className="empty-products"><b>No products found</b><p>Try another search or choose a different favorite filter.</p></div>
      )}
    </section>
  );
}
