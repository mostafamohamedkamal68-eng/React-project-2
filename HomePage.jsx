import { useMemo, useState } from 'react';
import Benefits from '../components/Benefits';
import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';
import { products } from '../data/products';
import { useZustandApi } from '../components/Zustand/ZustandApi';

export default function HomePage({ search, favoritesOnly }) {
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('popular');
  const favoriteIds = useZustandApi((state) => state.favorites);
  const toggleFavorite = useZustandApi((state) => state.toggleFavorite);
  const addToCart = useZustandApi((state) => state.addToCart);
  const favorites = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('en');
    let result = products.filter((product) => {
      const matchesCategory = category === 'all' || product.category === category;
      const matchesSearch = !query || (product.name + ' ' + product.categoryLabel).toLocaleLowerCase('en').includes(query);
      const matchesFavorite = !favoritesOnly || favorites.has(product.id);
      return matchesCategory && matchesSearch && matchesFavorite;
    });
    if (sort === 'asc') result = [...result].sort((a, b) => a.price - b.price);
    if (sort === 'desc') result = [...result].sort((a, b) => b.price - a.price);
    return result;
  }, [category, favorites, favoritesOnly, search, sort]);

  return (
    <div className="page-shell">
      <Hero />
      <Benefits />
      <ProductGrid
        products={visibleProducts}
        category={category}
        setCategory={setCategory}
        favorites={favorites}
        onFavorite={toggleFavorite}
        onAdd={addToCart}
        sort={sort}
        setSort={setSort}
      />
    </div>
  );
}
