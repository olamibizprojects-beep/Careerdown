'use client'

interface AdSlotProps {
  slot: 'in-feed' | 'sidebar' | 'below-article'
  className?: string
}

const PUBLISHER_ID = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID

export function AdSlot({ slot, className = '' }: AdSlotProps) {
  if (!PUBLISHER_ID) return null

  const slotIds: Record<AdSlotProps['slot'], string> = {
    'in-feed': 'XXXXXXXX',
    'sidebar': 'YYYYYYYY',
    'below-article': 'ZZZZZZZZ',
  }

  return (
    <div className={`ad-slot ad-slot--${slot} ${className}`} aria-label="Advertisement">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={`ca-pub-${PUBLISHER_ID}`}
        data-ad-slot={slotIds[slot]}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
