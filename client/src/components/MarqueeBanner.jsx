const TICKER_ITEMS = [
  'THE MARK OF ROYALTY',
  '✦',
  'PREMIUM QUALITY',
  '✦',
  'CASH ON DELIVERY',
  '✦',
  'NATIONWIDE SHIPPING',
  '✦',
  'ROYAL CHOICE EXCLUSIVE',
  '✦',
  'LUXURY ACCESSORIES',
  '✦',
];

const ITEMS_DOUBLED = [...TICKER_ITEMS, ...TICKER_ITEMS];

export default function MarqueeBanner({ dark = false }) {
  return (
    <div
      style={{
        background: dark ? '#030302' : '#f3f1ec',
        padding: '18px 0',
        overflow: 'hidden',
        borderTop: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'var(--color-border)'}`,
        borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'var(--color-border)'}`,
      }}
    >
      <div className="marquee-track">
        {ITEMS_DOUBLED.map((item, i) => (
          <span
            key={i}
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: '13px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: dark ? 'rgba(255,255,255,0.85)' : 'var(--color-fg)',
              paddingRight: '36px',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
