export interface StaticInvitePage {
  id: string
  slug: string
  title: string
  venue: string
  startAt: string
  endAt: string
  intro: string
  blocks: Array<{ id: string; type: string; title: string; body: string; items?: Array<{ name: string; role?: string; desc?: string }> }>
  agenda: Array<{ id: string; timeLabel: string; title: string; detail?: string; location?: string }>
  backgroundImageUrl: string | null
  confirmApi: { url: string; timeoutMs: number }
  venueLead: { title: string; description: string; ctaLabel: string; ctaUrl: string } | null
}
