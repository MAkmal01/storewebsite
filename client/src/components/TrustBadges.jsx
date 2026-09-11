import { Truck, RotateCcw, Headphones, ShieldCheck, Clock } from 'lucide-react';

const BADGES = [
  {
    icon: <Truck size={24} />,
    title: 'Nationwide COD',
    desc: 'Cash on Delivery available all over Pakistan',
  },
  {
    icon: <RotateCcw size={24} />,
    title: '7-Day Exchange',
    desc: 'Easy hassle-free exchange within 7 days of delivery',
  },
  {
    icon: <ShieldCheck size={24} />,
    title: '100% Authentic',
    desc: 'All products are genuine and quality-assured',
  },
  {
    icon: <Headphones size={24} />,
    title: 'Customer Support',
    desc: 'Available Mon–Sat, 10am to 7pm',
  },
  {
    icon: <Clock size={24} />,
    title: '2–5 Day Delivery',
    desc: 'Fast delivery across all major cities of Pakistan',
  },
];

export default function TrustBadges() {
  return (
    <section className="section-sm" id="trust-badges" style={{ background: '#fff' }}>
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '8px',
          }}
        >
          {BADGES.map((b) => (
            <div key={b.title} className="trust-badge">
              <div
                className="trust-badge-icon"
                style={{ background: 'rgba(3,3,2,0.05)' }}
              >
                {b.icon}
              </div>
              <div>
                <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '13px', marginBottom: '4px' }}>
                  {b.title}
                </p>
                <p style={{ fontSize: '12px', color: 'var(--color-fg-muted)', lineHeight: 1.5 }}>
                  {b.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #trust-badges > div > div {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 540px) {
          #trust-badges > div > div {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}
