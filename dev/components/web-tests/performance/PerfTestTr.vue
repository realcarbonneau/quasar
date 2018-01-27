// Component Type: Programming, Regular
<template>
  <span>.{{ displayString }}{{ computeStringOutputComputed }}{{ workFunction(renderWork) }} </span>
</template>

<script>
import PerfMixin from './perf-mixin'
export default {
  name: 'perf-test-tr',
  mixins: [PerfMixin]
}
</script>
