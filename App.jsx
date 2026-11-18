import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AnnouncementBar from './components/AnnouncementBar';
import CartDrawer from './components/CartDrawer';
import Header from './components/Header';
import RoutesApi from './components/Router/RoutesApi';
import StoryFooter from './components/StoryFooter';
import { useZustandApi } from './components/Zustand/ZustandApi';

export default function App() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const favoritesOnly = useZustandApi((state) => state.favoritesOnly);
  const cartOpen = useZustandApi((state) => state.cartOpen);
  const cartItems = useZustandApi((state) => state.cartItems);
  const lastReservation = useZustandApi((state) => state.lastReservation);
  const incrementCartItem = useZustandApi((state) => state.incrementCartItem);
  const decrementCartItem = useZustandApi((state) => state.decrementCartItem);
  const removeCartItem = useZustandApi((state) => state.removeCartItem);
  const clearCart = useZustandApi((state) => state.clearCart);
  const reserveCart = useZustandApi((state) => state.reserveCart);
  const openCart = useZustandApi((state) => state.openCart);
  const closeCart = useZustandApi((state) => state.closeCart);
  const toggleFavoritesOnly = useZustandApi((state) => state.toggleFavoritesOnly);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  function showFavorites() {
    toggleFavoritesOnly();
    navigate('/');
  }

  return (
    <>
      <AnnouncementBar />
      <Header
        count={cartCount}
        search={search}
        setSearch={setSearch}
        onCart={openCart}
        onFavorites={showFavorites}
      />
      <main>
        <RoutesApi search={search} favoritesOnly={favoritesOnly} />
      </main>
      <StoryFooter />
      {cartOpen && <CartDrawer
        items={cartItems}
        lastReservation={lastReservation}
        onClose={closeCart}
        increment={incrementCartItem}
        decrement={decrementCartItem}
        remove={removeCartItem}
        clearCart={clearCart}
        onReserve={reserveCart}
      />}
    </>
  );
}
