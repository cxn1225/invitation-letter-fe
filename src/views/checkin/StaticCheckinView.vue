<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const name = ref('')
const phone = ref('')
const error = ref('')
const submitted = ref(false)
const modules = import.meta.glob('../../generated/checkins/*.checkin.ts', { eager: true }) as Record<string, { default: { slug: string; title: string; venue: string; startAt: string; enabled: boolean } }>
const checkin = computed(() => Object.values(modules).map((module) => module.default).find((item) => item.slug === String(route.params.slug || '')) ?? null)
const submit = () => {
  const trimmedName = name.value.trim()
  const trimmedPhone = phone.value.trim().replace(/s+/g, '')
  error.value = !trimmedName ? '请输入姓名' : !/^1d{10}$/.test(trimmedPhone) ? '请输入正确的 11 位手机号' : ''
  if (error.value) return
  name.value = trimmedName
  phone.value = trimmedPhone
  submitted.value = true
}
</script>
<template>
  <main v-if="checkin" class="page"><div class="shell"><header><p>活动签到</p><h1>{{ checkin.title }}</h1><span v-if="checkin.venue">{{ checkin.venue }}</span></header><section v-if="!checkin.enabled" class="card"><h2>暂不可签到</h2><p>请按现场工作人员指引操作。</p></section><section v-else-if="submitted" class="card success"><h2>签到成功</h2><p>{{ name }} · {{ phone }}</p><p>请向工作人员出示本页确认入场。</p></section><form v-else class="card form" @submit.prevent="submit"><h2>确认签到</h2><label>姓名<input v-model="name" autocomplete="name" placeholder="请输入姓名" /></label><label>手机号<input v-model="phone" type="tel" inputmode="numeric" maxlength="11" autocomplete="tel" placeholder="请输入手机号" /></label><p v-if="error" class="error">{{ error }}</p><button>确认签到</button></form></div></main><main v-else class="empty">签到页不存在</main>
</template>
<style scoped>
.page{min-height:100vh;background:linear-gradient(180deg,#f8fafc,#ecfdf5);color:#0f172a}.shell{max-width:28rem;margin:0 auto;padding:1.5rem 1rem}.shell header{display:grid;gap:.35rem;margin-bottom:1.25rem}.shell header p{margin:0;color:#0f766e;font-size:.75rem;font-weight:700}.shell h1,.card h2{margin:0}.shell header span,.card p{color:#64748b}.card{display:grid;gap:1rem;margin-top:1rem;border:1px solid #dbe3ee;border-radius:1.25rem;background:#fff;padding:1.25rem}.form label{display:grid;gap:.4rem;font-size:.8125rem;font-weight:600}.form input{box-sizing:border-box;width:100%;border:1px solid #dbe3ee;border-radius:.75rem;padding:.8rem;font:inherit}.form button{border:0;border-radius:.75rem;background:#0f766e;padding:.85rem;color:#fff;font-weight:700}.error{margin:0;color:#dc2626}.success{background:#f0fdf4}.empty{padding:4rem;text-align:center}
</style>