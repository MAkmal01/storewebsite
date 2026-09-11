import HeroBanner from '../components/HeroBanner.jsx';
import CategoryGrid from '../components/CategoryGrid.jsx';
import FeaturedProducts from '../components/FeaturedProducts.jsx';
import ComboDeals from '../components/ComboDeals.jsx';
import MarqueeBanner from '../components/MarqueeBanner.jsx';
import TrustBadges from '../components/TrustBadges.jsx';
import Newsletter from '../components/Newsletter.jsx';

export default function HomePage({ onQuickView }) {
  return (
    <>
      <HeroBanner />
      <TrustBadges />
      <MarqueeBanner />
      <CategoryGrid />
      <FeaturedProducts onQuickView={onQuickView} />
      <ComboDeals onQuickView={onQuickView} />
      <MarqueeBanner dark />
      <Newsletter />
    </>
  );
}
