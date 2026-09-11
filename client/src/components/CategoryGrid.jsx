import { useNavigate } from 'react-router-dom';

const CATEGORIES = [
  { name: 'Watches', slug: 'watches', image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=600&auto=format&fit=crop', count: 12 },
  { name: 'Wallets', slug: 'wallets', image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=600&auto=format&fit=crop', count: 8 },
  { name: 'Perfumes', slug: 'perfumes', image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600&auto=format&fit=crop', count: 6 },
  { name: 'Jewellery', slug: 'jewellery', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop', count: 10 },
  { name: 'Gift Items', slug: 'gifts', image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=600&auto=format&fit=crop', count: 5 },
  { name: 'Mobile Acc.', slug: 'mobile-accessories', image: 'https://images.unsplash.com/photo-1603313011101-320f26a4f6f6?q=80&w=600&auto=format&fit=crop', count: 15 },
];

export default function CategoryGrid() {
  const navigate = useNavigate();

  return (
    <section className="section" id="categories">
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--color-fg-subtle)', marginBottom: '10px', fontWeight: 600 }}>
            Browse by Category
          </p>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 700 }}>
            Shop the Collection
          </h2>
        </div>

        {/* Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '12px',
          }}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              id={`cat-${cat.slug}`}
              onClick={() => navigate(`/collections/${cat.slug}`)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                background: 'none',
                border: 'none',
                padding: '0',
              }}
            >
              <div
                style={{
                  width: '100%',
                  aspectRatio: '1',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '2px solid var(--color-border)',
                  transition: 'border-color var(--transition), transform var(--transition)',
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-fg)';
                  e.currentTarget.style.transform = 'scale(1.04)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                  loading="lazy"
                />
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '12px', lineHeight: 1.2 }}>
                  {cat.name}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #categories > div > div:last-child {
            grid-template-columns: repeat(4, 1fr) !important;
          }
        }
        @media (max-width: 480px) {
          #categories > div > div:last-child {
            grid-template-columns: repeat(4, 1fr) !important;
            gap: 8px !important;
          }
        }
      `}</style>
    </section>
  );
}
