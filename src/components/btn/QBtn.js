import BtnMixin from './btn-mixin'
import { QSpinner } from '../spinner'
import { between } from '../../utils/format'

export default {
  name: 'q-btn',
  mixins: [BtnMixin],
  props: {
    value: Boolean,
    loader: Boolean,
    percentage: Number,
    darkPercentage: Boolean,
    waitForRipple: Boolean,
    repeatTimeout: [Number, Function]
  },
  data () {
    return {
      loading: this.value || false,
      repeated: 0
    }
  },
  watch: {
    value (val) {
      if (this.loading !== val) {
        this.loading = val
      }
    }
  },
  computed: {
    hasPercentage () {
      return this.percentage !== void 0
    },
    width () {
      return `${between(this.percentage, 0, 100)}%`
    },
    hasNoRepeat () {
      return this.isDisabled || !this.repeatTimeout || this.loader !== false
    },
    on () {
      const on = this.hasNoRepeat || this.$slots.loading
        ? {}
        : {
          mousedown: this.startRepeat,
          touchstart: this.startRepeat,
          mouseup: this.endRepeat,
          mouseleave: this.endRepeat,
          touchend: this.endRepeat
        }
      on.click = this.click
      return on
    },
    buttonProperties () {
      // console.log('buttonProperties')
      return {
        staticClass: 'q-btn row inline flex-center relative-position',
        'class': this.classes,
        style: this.style,
        on: this.on,
        directives: this.hasRipple
          ? [{
            name: 'ripple',
            value: true
          }]
          : null
      }
    },
    divPerctProperties () {
      // console.log('divPerctProperties')
      return {
        staticClass: 'q-btn-progress absolute-full',
        'class': { 'q-btn-dark-progress': this.darkPercentage },
        style: { width: this.width }
      }
    },
    leftIconProperties () {
      // console.log('leftIconProperties')
      return {
        'class': { 'on-left': this.label && this.isRectangle },
        props: { name: this.icon }
      }
    },
    rightIconProperties () {
      // console.log('rightIconProperties')
      return {
        staticClass: 'on-right',
        props: { name: this.iconRight }
      }
    },
    divInnerProperties () {
      // console.log('divInnerProperties')
      return {
        staticClass: 'q-btn-inner row col items-center',
        'class': this.innerClasses
      }
    }
  },
  methods: {
    click (e) {
      clearTimeout(this.timer)

      if (this.isDisabled || this.repeated) {
        this.repeated = 0
        return
      }

      const trigger = () => {
        this.removeFocus(e)
        if (this.loader !== false || this.$slots.loading) {
          this.loading = true
          this.$emit('input', true)
        }
        this.$emit('click', e, () => {
          this.loading = false
          this.$emit('input', false)
        })
      }

      if (this.waitForRipple && this.hasRipple) {
        this.timer = setTimeout(trigger, 350)
      }
      else {
        trigger()
      }
    },
    startRepeat (e) {
      this.repeated = 0

      const setTimer = () => {
        this.timer = setTimeout(
          trigger,
          typeof this.repeatTimeout === 'function'
            ? this.repeatTimeout(this.repeated)
            : this.repeatTimeout
        )
      }
      const trigger = () => {
        if (this.hasNoRepeat || this.$slots.loading) {
          return
        }
        this.repeated += 1
        this.$emit('click', e)
        setTimer()
      }

      setTimer()
    },
    endRepeat () {
      clearTimeout(this.timer)
    }
  },
  beforeDestroy () {
    clearTimeout(this.timer)
  },
  render (h) {
    // console.log('render')
    return h('button', this.buttonProperties, [
      h('div', { staticClass: 'q-focus-helper' }),
      this.loading && this.hasPercentage
        ? h('div', this.divPerctProperties)
        : null,

      h('div', this.divInnerProperties, this.loading
        ? [ this.$slots.loading || h(QSpinner) ]
        : [
          this.icon
            ? h('q-icon', this.leftIconProperties)
            : null,

          this.label && this.isRectangle ? h('div', [ this.label ]) : null,

          this.$slots.default,

          this.iconRight && this.isRectangle
            ? h('q-icon', this.rightIconProperties)
            : null
        ]
      )
    ])
  }
}
