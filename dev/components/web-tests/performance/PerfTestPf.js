// Component Type: Programming, Functional
import PerfMixin from './perf-mixin'
export default {
  name: 'perf-test-pf',
  functional: true,
  mixins: [PerfMixin],

  render (h, ctx) {
    // console.log('q-perf-test-pf render')
    let props = ctx.props
    return h('span', '.' + props.displayString + props.computeStringOutput() + props.workFunction(props.renderWork) + ' ')
  }
}
