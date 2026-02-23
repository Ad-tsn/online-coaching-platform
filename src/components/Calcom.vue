<template>
  <section class="rounded-xl border overflow-hidden">
    <div :id="containerId" class="w-full h-full"></div>
  </section>
</template>

<script setup>
import { onMounted, onBeforeUnmount, computed } from 'vue'

const props = defineProps({

  calLink: { type: String, required: true },

  namespace: { type: String, required: true },

  metadata: { type: Object, default: () => ({}) },
  theme: { type: String, default: 'light' },
  brandColor: { type: String, default: '#23c0f6' },
  layout: { type: String, default: 'week_view' },
})

const containerId = computed(() => `cal-inline-${props.namespace}`)

onMounted(() => {

  window.Cal('init', props.namespace, { origin: 'https://app.cal.com' })


  window.Cal.ns[props.namespace]('ui', {
    theme: props.theme,
    layout: props.layout,
    styles: { branding: { brandColor: props.brandColor } },
    hideEventTypeDetails: false,
  })

  window.Cal.ns[props.namespace]('inline', {
    elementOrSelector: `#${containerId.value}`,
    calLink: props.calLink,
    config: {
      metadata: props.metadata || {},
    },
  })
})

onBeforeUnmount(() => {

  const e = document.getElementById(containerId.value)
  if (e) e.innerHTML = ''
})
</script>
