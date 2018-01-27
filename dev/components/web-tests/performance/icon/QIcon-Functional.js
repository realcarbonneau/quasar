export default {
  name: 'q-icon',
  functional: true,
  props: {
    name: String,
    mat: String,
    ios: String,
    color: String,
    size: String
  },
  render (h, ctx) {
    let icon = ctx.props.mat && __THEME__ === 'mat'
      ? ctx.props.mat
      : (ctx.props.ios && __THEME__ === 'ios' ? ctx.props.ios : ctx.props.name)

    let cls = ''
    // const icon = this.icon

    if (!icon) {
      cls = ''
    }
    else if (icon.startsWith('fa-')) {
      // Fontawesome 4
      cls = `fa ${icon}`
    }
    else if (/^fa[s|r|l|b]{0,1} /.test(icon)) {
      // Fontawesome 5
      cls = icon
    }
    else if (icon.startsWith('bt-')) {
      cls = `bt ${icon}`
    }
    else if (icon.startsWith('ion-') || icon.startsWith('icon-')) {
      cls = `${icon}`
    }
    else if (icon.startsWith('mdi-')) {
      cls = `mdi ${icon}`
    }
    else {
      cls = 'material-icons'
    }

    let classes = ctx.props.color
      ? `${cls} text-${ctx.props.color}`
      : cls

    let content = classes.startsWith('material-icons')
      ? icon.replace(/ /g, '_')
      : ' '

    let style = ctx.props.size ? { fontSize: ctx.props.size } : undefined

    return h('i', {
      staticClass: `q-icon ${ctx.data.staticClass}`,
      'class': classes,
      staticStyle: ctx.data.staticStyle,
      style: style,
      attrs: { 'aria-hidden': true }
    }, [
      content,
      ctx.slots.default
    ])
  }
}
