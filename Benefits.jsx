import { BadgeCheck, Box, Headset, Truck, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useZustandApi } from './Zustand/ZustandApi';

const items = [
  {
    id: 'delivery',
    Icon: Truck,
    title: 'At your doorstep',
    note: 'Delivery across Egypt',
    details: 'Reserve the products you want, then review each item price and the reservation total in your bag before confirming.',
  },
  {
    id: 'quality',
    Icon: BadgeCheck,
    title: 'Made to be loved',
    note: 'Quality you can trust',
    details: 'Product cards include clear prices and customer ratings to help you choose the pieces that suit your home.',
  },
  {
    id: 'gifting',
    Icon: Box,
    title: 'Gift-ready packaging',
    note: 'A little joy, wrapped',
    details: 'Choose one or more products and keep them together in your reservation bag while you review quantities and totals.',
  },
  {
    id: 'support',
    Icon: Headset,
    title: 'Here when you need us',
    note: 'Real customer support',
    details: 'Need help with a reservation? Open the reservation bag to check the selected products, change quantities, or remove an item before confirming.',
  },
];

export default function Benefits() {
  const activeBenefitId = useZustandApi((state) => state.activeBenefit);
  const openBenefit = useZustandApi((state) => state.openBenefit);
  const closeBenefit = useZustandApi((state) => state.closeBenefit);
  const activeBenefit = items.find((item) => item.id === activeBenefitId);

  return (
    <>
      <section className="benefits" aria-label="Why shop Mustafa">
        {items.map(({ id, Icon, title, note }) => (
          <button className="benefit" key={id} type="button" onClick={() => openBenefit(id)} aria-haspopup="dialog">
            <span className="benefit-icon"><Icon size={20} /></span>
            <span className="benefit-copy"><b>{title}</b><small>{note}</small></span>
            <span className="benefit-open-hint" aria-hidden="true">+</span>
          </button>
        ))}
      </section>
      {activeBenefit && (
        <div className="benefit-dialog-backdrop" onMouseDown={(event) => event.target === event.currentTarget && closeBenefit()}>
          <section className="benefit-dialog" role="dialog" aria-modal="true" aria-labelledby="benefit-dialog-title">
            <button className="icon-button benefit-dialog-close" type="button" onClick={closeBenefit} aria-label="Close details"><X size={20} /></button>
            <span className="benefit-icon benefit-dialog-icon"><activeBenefit.Icon size={21} /></span>
            <span className="eyebrow">MUSTAFA STORE</span>
            <h2 id="benefit-dialog-title">{activeBenefit.title}</h2>
            <p>{activeBenefit.details}</p>
            <div className="benefit-dialog-actions">
              <Link className="button button-dark" to="/products" onClick={closeBenefit}>Browse products</Link>
              <button className="button button-outline" type="button" onClick={closeBenefit}>Close</button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
