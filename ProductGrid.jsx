import { Link } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import { categories } from '../data/products';
import ProductCard from './ProductCard';
export default function ProductGrid({ products, category, setCategory, favorites, onFavorite, onAdd, sort, setSort }) {
  return (
    <section className="products-section" id="products">
      <div className="section-heading"><div><span className="eyebrow">A LITTLE SOMETHING FOR EVERY DAY</span><h2>The Mustafa <em>edit</em></h2></div><p>Thoughtfully chosen pieces to make everyday feel a little better.</p></div>
      <div className="product-toolbar">
        <div className="category-list" role="tablist" aria-label="Product categories">{categories.map((item) => <button key={item.id} type="button" role="tab" aria-selected={category === item.id} className={'category-chip' + (category === item.id ? ' active' : '')} onClick={() => setCategory(item.id)}>{item.label}</button>)}</div>
        <label className="sort-control"><SlidersHorizontal size={15} /><span>Sort by</span><select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort products"><option value="popular">Most popular</option><option value="asc">Price: low to high</option><option value="desc">Price: high to low</option></select></label>
      </div>
      {products.length ? <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} favorite={favorites.has(product.id)} onFavorite={onFavorite} onAdd={onAdd} />)}</div> : <div className="empty-products"><b>No products found</b><p>Try another search or choose a different category.</p></div>}
      <Link className="button button-outline view-all" to="/products">Explore API products <span>←</span></Link>
    </section>
  );
}
