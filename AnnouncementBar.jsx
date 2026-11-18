import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
export default function AnnouncementBar() {
  return <div className="announcement"><span>Free delivery on orders over EGP 2,000</span><Link to="/products">Explore the collection <ArrowLeft size={14} /></Link></div>;
}
