import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';

const money = (value, currency = 'EGP') => new Intl.NumberFormat('en-EG', {
  style: 'currency',
  currency,
  maximumFractionDigits: currency === 'EGP' ? 0 : 2,
}).format(value);

function getTotals(items) {
  return items.reduce((result, { product, quantity }) => {
    const currency = product.currency || 'EGP';
    result[currency] = (result[currency] || 0) + product.price * quantity;
    return result;
  }, {});
}

export default function CartDrawer({ items, lastReservation, onClose, increment, decrement, remove, clearCart, onReserve }) {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totals = getTotals(items);
  const previousTotals = lastReservation ? getTotals(lastReservation.items) : {};

  return (
    <div className="cart-layer" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <aside className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title">
        <div className="cart-header">
          <div><span className="eyebrow">YOUR GOOD PICKS</span><h2 id="cart-title">Reservation bag <small>({itemCount})</small></h2></div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close reservation bag"><X size={21} /></button>
        </div>

        {items.length ? (
          <>
            <div className="cart-items">
              {items.map(({ product, quantity }) => {
                const currency = product.currency || 'EGP';
                return (
                  <div className="cart-item" key={product.id}>
                    <img src={product.image} alt={product.alt || product.name} />
                    <div className="cart-item-copy">
                      <small>{product.categoryLabel}</small>
                      <b>{product.name}</b>
                      <span className="cart-unit-price">Unit price: {money(product.price, currency)}</span>
                      <strong>Line total: {money(product.price * quantity, currency)}</strong>
                      <div className="quantity-control">
                        <button type="button" onClick={() => decrement(product.id)} aria-label={`Decrease ${product.name} quantity`}><Minus size={13} /></button>
                        <span>{quantity}</span>
                        <button type="button" onClick={() => increment(product.id)} aria-label={`Increase ${product.name} quantity`}><Plus size={13} /></button>
                      </div>
                    </div>
                    <button className="remove-item" type="button" onClick={() => remove(product.id)} aria-label={`Remove ${product.name}`}><Trash2 size={16} /></button>
                  </div>
                );
              })}
            </div>
            <div className="cart-summary">
              {Object.entries(totals).map(([currency, total]) => (
                <div className="cart-total-row" key={currency}><span>Reservation total ({currency})</span><b>{money(total, currency)}</b></div>
              ))}
              {Object.keys(totals).length > 1 && <small>Totals are separated by currency.</small>}
              <small>Prices and quantities update automatically as you edit the reservation bag.</small>
              <div className="cart-summary-actions">
                <button className="button button-dark checkout-button" type="button" onClick={onReserve}>Confirm reservation <span>←</span></button>
                <button className="button button-outline clear-cart-button" type="button" onClick={clearCart}>Clear bag</button>
              </div>
            </div>
          </>
        ) : lastReservation ? (
          <div className="empty-cart reservation-confirmation" role="status">
            <span className="empty-cart-icon"><ShoppingBag size={27} /></span>
            <h3>Reservation confirmed</h3>
            <p>Reservation #{lastReservation.id} is saved in this browser.</p>
            <div className="reservation-total-list">
              {Object.entries(previousTotals).map(([currency, total]) => <b key={currency}>{money(total, currency)}</b>)}
            </div>
            <button className="button button-dark" type="button" onClick={onClose}>Done</button>
          </div>
        ) : (
          <div className="empty-cart">
            <span className="empty-cart-icon"><ShoppingBag size={27} /></span>
            <h3>Your reservation bag is empty</h3>
            <p>Choose a product and reserve it here. You can review quantities and total before confirming.</p>
            <button className="button button-dark" type="button" onClick={onClose}>Explore products</button>
          </div>
        )}
      </aside>
    </div>
  );
}
