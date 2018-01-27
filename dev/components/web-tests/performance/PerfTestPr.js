// Component Type: Programming, Regular
import PerfMixin from './perf-mixin'
export default {
  name: 'perf-test-pr',
  mixins: [PerfMixin],

  render (h) {
    // console.log('q-perf-test-pr render')
    return h('span', '.' + this.displayString + this.computeStringOutput() + this.workFunction(this.renderWork) + ' ')
  }
}
