import { Heart, Plus, Star } from 'lucide-react';
const money = (value, currency = 'EGP') => new Intl.NumberFormat('en-EG', { style: 'currency', currency, maximumFractionDigits: currency === 'EGP' ? 0 : 2 }).format(value);
export default function ProductCard({ product, favorite, onFavorite, onAdd }) {
  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <img className="product-image" src={product.image} alt={product.alt || product.name} loading="lazy" />
        {product.badge && <span className="product-badge">{product.badge}</span>}
        <button className={'favorite-button' + (favorite ? ' is-favorite' : '')} type="button" onClick={() => onFavorite(product.id)} aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'} aria-pressed={favorite}><Heart size={18} fill={favorite ? 'currentColor' : 'none'} /></button>
        <button className="quick-add" type="button" onClick={() => onAdd(product)} aria-label={'Reserve ' + product.name}><Plus size={16} /><span>Reserve</span></button>
      </div>
      <div className="product-info">
        <div className="product-meta"><span>{product.categoryLabel}</span><span className="rating"><Star size={12} fill="currentColor" /> {product.rating} <small>({product.reviews || 0})</small></span></div>
        <h3>{product.name}</h3>
        <div className="product-price"><b>{money(product.price, product.currency || 'EGP')}</b>{product.oldPrice && <del>{money(product.oldPrice, product.currency || 'EGP')}</del>}</div>
      </div>
    </article>
  );
}
