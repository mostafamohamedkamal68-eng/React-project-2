import { Heart, Search, ShoppingBag, UserRound } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';

export default function Header({ count, search, setSearch, onCart, onFavorites }) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" to="/" aria-label="Mustafa home"><span className="brand-mark">M</span><span className="brand-name">MUSTAFA<small>Everyday, thoughtfully picked</small></span></Link>
        <nav className="main-nav" aria-label="Main navigation">
          <NavLink to="/products">Products</NavLink>
          <NavLink to="/users">Users</NavLink>
          <NavLink to="/posts/update">Posts</NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>
        <label className="search-box"><Search size={17} /><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="What are you looking for?" aria-label="Search products" /></label>
        <div className="header-actions">
          <Link className="icon-button account" to="/users" aria-label="Users"><UserRound size={20} /></Link>
          <button className="icon-button fav-head" type="button" onClick={onFavorites} aria-label="Favorites"><Heart size={20} /></button>
          <button className="icon-button cart-trigger" type="button" onClick={onCart} aria-label={'Reservation bag, ' + count + ' items'}><ShoppingBag size={20} /><span className="cart-count">{count}</span></button>
        </div>
      </div>
    </header>
  );
}
