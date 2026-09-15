import { ImageResponse } from 'next/og';

export const alt = 'FORMA — концепт интерьерной студии и CRM ПОТОК';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#090a08',
          color: '#f4efe6',
          padding: '64px 72px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              fontSize: 22,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#e4c28a',
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                border: '1.5px solid #e4c28a',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
              }}
            >
              F
            </div>
            Концепт 2027
          </div>
          <div style={{ fontSize: 20, color: '#8c877c', letterSpacing: '0.16em' }}>ПОТОК</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ fontSize: 92, lineHeight: 0.9, letterSpacing: '-0.04em', fontWeight: 500 }}>FORMA</div>
          <div style={{ fontSize: 32, color: '#b8b3a8', maxWidth: 820, lineHeight: 1.35 }}>
            Демо интерьерной студии: расчёт проекта и заявки в CRM — один контур.
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#8c877c', fontSize: 20 }}>
          <span>Не оферта · учебный бренд</span>
          <span>от первого эскиза до сделки</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
