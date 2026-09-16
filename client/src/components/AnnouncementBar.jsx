import { useState, useEffect } from 'react';

const messages = [
  '🚚 FREE DELIVERY on orders above Rs. 10,000',
  '💳 CASH ON DELIVERY available Nationwide',
  '🔄 7-Day Easy Exchange Policy',
  '📞 Customer Support: 24/7',
  '🚚 300 DC Advance For Order Confirmation',
];

export default function AnnouncementBar() {
  const duplicated = [...messages, ...messages];

  return (
    <div
      style={{
        background: 'var(--color-announcement)',
        color: '#fff',
        height: '38px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div style={{ overflow: 'hidden', width: '100%' }}>
        <div className="announcement-ticker">
          {duplicated.map((msg, i) => (
            <span
              key={i}
              style={{
                fontSize: '12px',
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                letterSpacing: '0.04em',
                marginRight: '0',
              }}
            >
              {msg}
              <span style={{ display: 'inline-block', width: '64px' }} />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
