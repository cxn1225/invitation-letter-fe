<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { StaticInvitePage } from '@/generated/invites/types'

const route = useRoute()
const modules = import.meta.glob('../../generated/invites/*.invite.ts', { eager: true }) as Record<string, { default: StaticInvitePage }>
const invite = computed(() => Object.values(modules).map((module) => module.default).find((item) => item?.slug === String(route.params.slug || '')) ?? null)
</script>

<template>
  <main v-if="invite" class="invite-page">
    <header class="hero" :style="invite.backgroundImageUrl ? { backgroundImage: 'url(' + invite.backgroundImageUrl + ')' } : undefined">
      <p>EVENT INVITATION</p><h1>{{ invite.title }}</h1><span v-if="invite.venue">{{ invite.venue }}</span>
    </header>
    <section class="card">{{ invite.intro }}</section>
    <section v-for="block in invite.blocks" :key="block.id" class="card"><h2>{{ block.title }}</h2><p>{{ block.body }}</p></section>
  </main>
  <main v-else class="empty">Invitation not found.</main>
</template>

<style scoped>
.invite-page{max-width:750px;min-height:100vh;margin:auto;padding:32px 24px;background:#f8fafc;color:#0f172a}.hero{min-height:280px;padding:32px;display:flex;flex-direction:column;justify-content:end;gap:12px;border-radius:28px;background:#fff center/cover}.hero h1{font-size:42px}.card{margin-top:20px;padding:28px;border-radius:24px;background:#fff;white-space:pre-wrap;line-height:1.8}.empty{padding:80px;text-align:center}@media(max-width:480px){.invite-page{padding:16px}.hero{min-height:220px;padding:24px}.hero h1{font-size:30px}.card{padding:20px}}
</style>
