<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import type { StaticInvitePage } from '@/generated/checkin/types'

const route = useRoute()
const attendanceName = ref('')
const attendancePhone = ref('')
const attendanceFormError = ref('')
const attendanceSubmitted = ref(false)
const modules = import.meta.glob('../../generated/checkin/invite/**/*.invite.ts', { eager: true }) as Record<string, { default: StaticInvitePage }>
const invite = computed(() =>
  Object.values(modules)
    .map((module) => module.default)
    .find((item) => item?.slug === String(route.params.slug || '')) ?? null,
)
const formatTime = (value: string) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('zh-CN', {
    month: 'numeric', day: 'numeric', weekday: 'short', hour: '2-digit', minute: '2-digit',
  })
}
const timeRangeText = computed(() => {
  if (!invite.value) return ''
  const start = formatTime(invite.value.startAt)
  const end = formatTime(invite.value.endAt)
  return start && end ? start + ' - ' + end : start || end
})
const introParagraphs = computed(() =>
  (invite.value?.intro || '').split(/\n\s*\n/).map((item) => item.trim()).filter(Boolean),
)
const hasAgendaBlock = computed(() => invite.value?.blocks.some((item) => item.type === 'agenda_teaser') ?? false)
const formatAgendaTime = (value: string) => value.replace(/\b(\d{1,2}):(\d{2})\b/g, (_, hour: string, minute: string) => hour.padStart(2, '0') + ':' + minute)
const agendaEndTime = computed(() => {
  if (!invite.value?.endAt) return ''
  const date = new Date(invite.value.endAt)
  if (Number.isNaN(date.getTime())) return ''
  return String(date.getHours()).padStart(2, '0') + ':' + String(date.getMinutes()).padStart(2, '0')
})
const formatAgendaRange = (timeLabel: string, index: number) => {
  const nextStart = invite.value?.agenda[index + 1]?.timeLabel
  const end = nextStart || agendaEndTime.value
  return formatAgendaTime(end ? timeLabel + '-' + end : timeLabel)
}
const submitAttendance = () => {
  attendanceFormError.value = ''
  const name = attendanceName.value.trim()
  const phone = attendancePhone.value.trim().replace(/\s+/g, '')
  if (!name) {
    attendanceFormError.value = '请输入姓名'
    return
  }
  if (!/^1\d{10}$/.test(phone)) {
    attendanceFormError.value = '请输入正确的 11 位手机号'
    return
  }
  attendanceName.value = name
  attendancePhone.value = phone
  attendanceSubmitted.value = true
}
</script>

<template>
  <main v-if="invite" class="invite-page">
    <div class="invite-shell">
      <header
        class="invite-header"
        :class="{ 'invite-header--with-image': invite.backgroundImageUrl }"
        :style="invite.backgroundImageUrl ? { backgroundImage: 'linear-gradient(180deg, rgba(15,23,42,.08), rgba(15,23,42,.76)), url(' + invite.backgroundImageUrl + ')' } : undefined"
      >
        <p class="invite-eyebrow">&#27963;&#21160;&#36992;&#35831;&#20989;</p>
        <h1 class="invite-title">{{ invite.title }}</h1>
        <p v-if="invite.venue" class="invite-meta">{{ invite.venue }}</p>
        <p v-if="timeRangeText" class="invite-meta">{{ timeRangeText }}</p>
      </header>

      <section class="invite-card invite-intro">
        <p v-for="(paragraph, index) in introParagraphs" :key="paragraph" :class="{ 'intro-first': index === 0 }">
          {{ paragraph }}
        </p>
      </section>

      <section v-for="block in invite.blocks" :key="block.id" class="invite-card">
        <h2 v-if="block.title" class="invite-section-title">{{ block.title }}</h2>
        <p v-if="block.body" class="invite-body">{{ block.body }}</p>
        <ul v-if="block.items?.length" class="invite-item-list">
          <li v-for="(item, index) in block.items" :key="block.id + '-' + index" class="invite-item">
            <p class="invite-item-name">{{ item.name }}</p>
            <p v-if="item.role" class="invite-item-role">{{ item.role }}</p>
            <p v-if="item.desc" class="invite-item-desc">{{ item.desc }}</p>
          </li>
        </ul>
        <ol v-if="block.type === 'agenda_teaser' && invite.agenda.length" class="agenda-timeline">
          <li v-for="(item, index) in invite.agenda" :key="item.id" class="agenda-timeline__item">
            <time class="agenda-timeline__time">{{ formatAgendaRange(item.timeLabel, index) }}</time>
            <div class="agenda-timeline__axis"><span class="agenda-timeline__dot" /></div>
            <div class="agenda-timeline__content"><p>{{ item.title }}</p><span v-if="item.detail || item.location">{{ item.detail || item.location }}</span></div>
          </li>
        </ol>
      </section>

      <section v-if="!hasAgendaBlock && invite.agenda.length" class="invite-card">
        <h2 class="invite-section-title">&#27963;&#21160;&#35758;&#31243;</h2>
        <ol class="agenda-timeline">
          <li v-for="(item, index) in invite.agenda" :key="item.id" class="agenda-timeline__item">
            <time class="agenda-timeline__time">{{ formatAgendaRange(item.timeLabel, index) }}</time>
            <div class="agenda-timeline__axis"><span class="agenda-timeline__dot" /></div>
            <div class="agenda-timeline__content"><p>{{ item.title }}</p><span v-if="item.detail || item.location">{{ item.detail || item.location }}</span></div>
          </li>
        </ol>
      </section>

      <section class="invite-card attendance-card">
        <h2 class="invite-section-title">&#30830;&#35748;&#20986;&#24109;</h2>
        <form v-if="!attendanceSubmitted" class="attendance-form" @submit.prevent="submitAttendance">
          <label class="attendance-label">
            <span>&#22995;&#21517;</span>
            <input v-model="attendanceName" type="text" autocomplete="name" placeholder="&#35831;&#36755;&#20837;&#22995;&#21517;" class="attendance-input" />
          </label>
          <label class="attendance-label">
            <span>&#25163;&#26426;&#21495;</span>
            <input v-model="attendancePhone" type="tel" inputmode="numeric" maxlength="11" autocomplete="tel" placeholder="&#35831;&#36755;&#20837;&#25163;&#26426;&#21495;" class="attendance-input" />
          </label>
          <p v-if="attendanceFormError" class="attendance-error">{{ attendanceFormError }}</p>
          <button type="submit" class="attendance-button">&#30830;&#35748;&#21442;&#21152;</button>
        </form>
        <div v-else class="attendance-notice">
          <strong>已收到您的出席意向</strong>
          <span>{{ attendanceName }} · {{ attendancePhone }}</span>
        </div>
      </section>

      <a v-if="invite.venueLead" :href="invite.venueLead.ctaUrl" target="_blank" rel="noopener noreferrer" class="venue-lead">
        <div><p>{{ invite.venueLead.title }}</p><span>{{ invite.venueLead.description }}</span></div>
        <b>{{ invite.venueLead.ctaLabel }} &rarr;</b>
      </a>
    </div>
  </main>
  <main v-else class="empty">Invitation not found.</main>
</template>

<style scoped>
.invite-page{min-height:100vh;background:radial-gradient(800px 400px at 90% -10%,rgba(251,146,60,.14),transparent 55%),linear-gradient(180deg,#fffbeb 0%,#f8fafc 48%,#f0fdfa 100%);color:#0f172a}.invite-shell{width:100%;max-width:28rem;margin:0 auto;padding:1.5rem 1rem 2.5rem;box-sizing:border-box}.invite-header{margin-bottom:1.25rem}.invite-header--with-image{min-height:15rem;display:flex;flex-direction:column;justify-content:flex-end;padding:1.25rem;border-radius:1.25rem;background-position:center;background-size:cover;box-sizing:border-box;box-shadow:0 12px 30px rgba(15,23,42,.18)}.invite-header--with-image .invite-eyebrow,.invite-header--with-image .invite-meta{color:rgba(255,255,255,.88)}.invite-header--with-image .invite-title{color:#fff}.invite-eyebrow{margin:0;font-size:.75rem;font-weight:600;letter-spacing:.06em;color:#c2410c}.invite-title{margin:.4rem 0 0;font-size:1.5rem;font-weight:900;letter-spacing:-.02em;line-height:1.3}.invite-meta{margin:.35rem 0 0;font-size:.875rem;color:#64748b}.invite-card{margin-top:1rem;border:1px solid rgba(148,163,184,.35);border-radius:1.25rem;background:rgba(255,255,255,.94);padding:1.25rem;box-sizing:border-box;box-shadow:0 10px 30px rgba(15,23,42,.04)}.invite-intro{font-size:.875rem;line-height:1.8;color:#475569}.invite-intro p{margin:1.25rem 0 0;white-space:pre-wrap}.invite-intro .intro-first{margin-top:0;font-weight:600;color:#0f172a}.invite-section-title{margin:0;font-size:.9375rem;font-weight:700;color:#0f172a}.invite-body{margin:.5rem 0 0;font-size:.875rem;line-height:1.75;color:#475569;white-space:pre-wrap}.invite-item-list{display:grid;gap:.5rem;margin:.75rem 0 0;padding:0;list-style:none}.invite-item{border:1px solid #e2e8f0;border-radius:.9rem;background:#f8fafc;padding:.65rem .75rem}.invite-item-name{margin:0;font-size:.875rem;font-weight:600;color:#0f172a}.invite-item-role{margin:.18rem 0 0;font-size:.75rem;color:#0f766e}.invite-item-desc{margin:.18rem 0 0;font-size:.75rem;color:#64748b}.agenda-timeline{margin:.75rem 0 0;padding:0;list-style:none}.agenda-timeline__item{display:grid;grid-template-columns:4.75rem 1.5rem minmax(0,1fr)}.agenda-timeline__time{padding-top:.08rem;color:#0f172a;font-size:.875rem;line-height:1.5;white-space:nowrap}.agenda-timeline__axis{position:relative;display:flex;justify-content:center}.agenda-timeline__axis::after{position:absolute;top:.85rem;bottom:0;border-left:1px dotted #94a3b8;content:""}.agenda-timeline__item:last-child .agenda-timeline__axis::after{display:none}.agenda-timeline__dot{position:relative;z-index:1;display:block;box-sizing:border-box;width:.65rem;height:.65rem;flex:0 0 .65rem;margin-top:.16rem;border:0!important;border-radius:50%;background:#0f6cbd!important}.agenda-timeline__dot::after{position:absolute!important;top:50%;left:50%;width:.28rem!important;height:.28rem!important;box-sizing:border-box!important;border:0!important;border-radius:50%!important;background:#fff!important;transform:translate(-50%,-50%);content:""}.agenda-timeline__content{padding:0 0 1.2rem .35rem}.agenda-timeline__item:last-child .agenda-timeline__content{padding-bottom:0}.agenda-timeline__content p{margin:0;color:#075eac;font-size:.9rem;font-weight:700;line-height:1.5}.agenda-timeline__content span{display:block;margin-top:.3rem;color:#0f172a;font-size:.75rem;line-height:1.55;white-space:pre-wrap}.attendance-card{display:grid;gap:1rem}.attendance-form{display:grid;gap:1rem}.attendance-label{display:grid;gap:.45rem;font-size:.8125rem;font-weight:600;color:#334155}.attendance-input{width:100%;box-sizing:border-box;border:1px solid #dbe3ee;border-radius:.9rem;background:#fff;padding:.8rem .9rem;color:#0f172a;font:inherit;outline:none}.attendance-input:focus{border-color:#c2410c;box-shadow:0 0 0 3px rgba(194,65,12,.1)}.attendance-error{margin:0;color:#dc2626;font-size:.75rem}.attendance-copy{margin:0;font-size:.8125rem;line-height:1.6;color:#64748b}.attendance-button{width:100%;border:0;border-radius:.75rem;background:#c2410c;padding:.8rem 1rem;color:#fff;font-size:.9rem;font-weight:700;cursor:pointer}.attendance-button:hover{background:#9a3412}.attendance-notice{display:grid;gap:.3rem;margin:0;border-radius:.75rem;background:#fff7ed;padding:.85rem .9rem;font-size:.8125rem;line-height:1.6;color:#9a3412}.venue-lead{display:flex;align-items:flex-start;justify-content:space-between;gap:.75rem;margin-top:1rem;border:1px dashed rgba(13,148,136,.35);border-radius:1.25rem;background:rgba(240,253,250,.85);padding:1rem 1.15rem;color:inherit;text-decoration:none}.venue-lead p{margin:0;font-size:.875rem;font-weight:700}.venue-lead span{display:block;margin-top:.25rem;font-size:.75rem;line-height:1.6;color:#64748b}.venue-lead b{flex:0 0 auto;font-size:.875rem;color:#0f766e}.empty{min-height:100vh;padding:5rem 2rem;text-align:center;color:#64748b}@media(max-width:480px){.invite-shell{padding:1.25rem .75rem 2rem}.invite-header--with-image{min-height:13rem;padding:1rem}.invite-card{padding:1rem}}
</style>
