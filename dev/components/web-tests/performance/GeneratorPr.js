// Dynamic Component Generator
// In separate functional component because I did not find a way to inject vnodes directly.
import GeneratorMixin from './generator-mixin'
export default {
  name: 'generator-pr',
  mixins: [GeneratorMixin],
  props: {
    name: String,
    repeat: Number,
    props: Object
  },

  render (h) {
    let props = this.props
    let vnodes = []
    for (let i = 0; i < this.repeat; i++) {
      props.key = i
      vnodes.push(
        h(this.name, {
          props: this.props
        })
      )
    }
    vnodes = h('div', {}, vnodes)
    return vnodes
  }
}
