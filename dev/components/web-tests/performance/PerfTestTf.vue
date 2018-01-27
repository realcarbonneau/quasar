// Component Type: Template, Functional
<template functional>
  <span>.{{ props.displayString }}{{ props.computeStringOutput() }}{{ props.workFunction(props.renderWork) }} </span>
</template>

<script>
import PerfMixin from './perf-mixin'
export default {
  name: 'perf-test-tf',
  mixins: [PerfMixin]
}
</script>
