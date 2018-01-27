// Dynamic Component Generator
// In separate functional component because I did not find a way to inject vnodes directly.
// import GeneratorMixin from './generator-mixin'
export default {
  name: 'generator-pf',
  // mixins: [GeneratorMixin],
  functional: true,

  render (h, ctx) {
    // ctx.props
    let props = ctx.props.props
    let vnodes = []
    for (let i = 0; i < ctx.props.repeat; i++) {
      props.key = i
      vnodes.push(
        h(ctx.props.name, {
          props: props
        })
      )
    }
    vnodes = h('div', {}, vnodes)
    return vnodes
  }
}
