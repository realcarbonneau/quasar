<template>
  <transition>
    <div :class='modalClasses' @click='backdropDismiss'>
      <div :class='modalContentClasses' :style='this.modalCss' @click='stopPropagation' @touchstart='stopPropagation'>
        <div v-if="hasHeader" :class="computeHeaderClass" :style="headerStyle">
          <slot name='header'></slot>
          <slot v-if='hasHeaderNavigation' name='navigation'></slot>
        </div>
        <div :class="computeContentClass" :style="contentStyle">
          <slot></slot>
        </div>
        <div v-if="hasFooter" :class="computeFooterClass" :style="footerStyle">
          <slot name='footer'></slot>
          <slot v-if='!hasHeaderNavigation' name='navigation'></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
// New version of QModal
// General Design Principles
//   Header, Footer and Navigation are available using slots
//   Communication with parent is done using v-model is suggested
//   Razvan: Keep all events, keep route-dismiss with no-route-dismiss option
// TODO: Promises in model-toggle
//       Events
//       Transitions
//       QModalLayout designed to also be used alone? if not, add dependency check

import EscapeKey from '../../utils/escape-key'
import extend from '../../utils/extend'
import ModelToggleMixin from '../../mixins/model-toggle'

// TODO: This function needs to be in utils or somewhere else common
function parseClassProp(propClass) {
  // Convert string, Array or Object into common array syntax
  switch (propClass) {
    case 'String'
      return propClass.split(',')
    case 'Array'
      return propClass
    case 'Object'
      // Convert Object into an array of properties
      const arr = []
      for (key in propClass) {
        arr.push({key, propClass(key))
      }
      return arr
  }
}

// TODO
const positions = {
  top: 'items-start justify-center with-backdrop',
  bottom: 'items-end justify-center with-backdrop',
  right: 'items-center justify-end with-backdrop',
  left: 'items-center justify-start with-backdrop'
}
// TODO
const positionCSS = __THEME__ === 'mat'
  ? {
    maxHeight: '80vh',
    height: 'auto'
  }
  : {
    maxHeight: '80vh',
    height: 'auto',
    boxShadow: 'none'
  }
// TODO
function additionalCSS (position) {
  let css = {}

  if (['left', 'right'].includes(position)) {
    css.maxWidth = '90vw'
  }
  if (__THEME__ === 'ios') {
    if (['left', 'top'].includes(position)) {
      css.borderTopLeftRadius = 0
    }
    if (['right', 'top'].includes(position)) {
      css.borderTopRightRadius = 0
    }
    if (['left', 'bottom'].includes(position)) {
      css.borderBottomLeftRadius = 0
    }
    if (['right', 'bottom'].includes(position)) {
      css.borderBottomRightRadius = 0
    }
  }

  return css
}
// TODO
let openedModalNumber = 0

export default {
  name: 'q-modal2',
  props: {
    value: {
      type: Boolean,
      default: undefined // Required because or else vuejs will impose false when undefined
    }
    startOpen: Boolean
    position: {
      type: String,
      default: '',
      validator (val) {
        return val === '' || ['top', 'bottom', 'left', 'right'].includes(val)
      }
    },
    transition: String,
    enterClass: String,
    leaveClass: String,
    positionClasses: {
      type: String,
      default: 'flex-center'
    },
    // windowClass
    // contentClasses: [Object, Array, String],
    // contentCss: [Object, Array, String],
    headerStyle: [String, Object, Array],
    headerClass: [String, Object, Array],
    contentStyle: [String, Object, Array],
    contentClass: [String, Object, Array],
    footerStyle: [String, Object, Array],
    footerClass: [String, Object, Array]
    noBackdropDismiss: {
      type: Boolean,
      default: false
    },
    noEscDismiss: {
      type: Boolean,
      default: false
    },
    minimized: Boolean,
    maximized: Boolean
  },
  data () {
    return {
      internalValue: Boolean
    }
  }
  watch: {
    value
    $route () {
      debugger
      if (this.value === void 0) {
        this.hide()
      }
    }
  },
  computed: {
    isShow () {
      this.isInternal ? return internalValue : return value
    },
    isInternal () {
      return typeof this.value === 'undefined'
    },
    isIos () {
      // TODO: This computed property needs to be in a common mixin
      return __THEME__ === 'ios'
    }
    hasHeaderNavigation () {
      // TODO: This computed property needs to be in a common mixin
      this.isIos ? return false : return true
    }
    hasHeader () {
      return this.$slots.header || (__THEME__ !== 'ios' && this.$slots.navigation)
    }
    hasFooter () {
      return this.$slots.footer || (__THEME__ === 'ios' && this.$slots.navigation)
    }
// TODO: From QModalLayout, parent div to integrate/consolidate
'q-modal-layout column col-grow no-wrap'
    modalClasses () {
      // Static
      const cls = ['modal', 'fullscreen',  'row']

      // Position
      cls.push = this.position
        ? positions[this.position]
        : this.positionClasses
        
      // Size
      if (this.maximized) cls.push('maximized')
      else if (this.minimized) cls.push('minimized')

      return cls
    },
    computedHeaderClasses () {
      const cls = ['q-layout-header']
      cls.concatenate(parseClassProp(this.headerClass))
      return cls
    }
    computedContentClasses () {
      const cls = ['q-modal-layout-content col-grow scroll']
      cls.concatenate(parseClassProp(this.contentClass))
      return cls
    }
    computedFooterClasses () {
      const cls = ['q-layout-footer']
      cls.concatenate(parseClassProp(this.footerClass))
      return cls
    }
    transitionProps () {
      if (this.position) {
        return { name: `q-modal-${this.position}` }
      }
      if (this.enterClass === void 0 && this.leaveClass === void 0) {
        return { name: this.transition || 'q-modal' }
      }
      return {
        enterActiveClass: this.enterClass,
        leaveActiveClass: this.leaveClass
      }
    },
    modalCss () {
      if (this.position) {
        const css = Array.isArray(this.contentCss)
          ? this.contentCss
          : [this.contentCss]

        css.unshift(extend(
          {},
          positionCSS,
          additionalCSS(this.position)
        ))

        return css
      }

      return this.contentCss
    }
  },
  methods: {
    set (val) {
      isInternal ? this.internalValue = val : this.value = val
    }
    show () {
      set(true)
    }
    hide() {
      set(false)
    }
    backdropDismiss () {
      if (!noBackdropDismiss) this.show() 
    }
    escDismiss () {
      if (!noEscDismiss) this.hide() 
    }
  }
}
    
    
// TODO: Not converted yet from QModal
    __dismiss () {
      if (this.noBackdropDismiss) {
        return
      }
      this.hide().then(() => {
        this.$emit('dismiss')
      })
    },
    __show () {
      const body = document.body

      body.appendChild(this.$el)
      body.classList.add('with-modal')

      EscapeKey.register(() => {
        if (!this.noEscDismiss) {
          this.hide().then(() => {
            this.$emit('escape-key')
          })
        }
      })

      openedModalNumber++

      let content = this.$refs.content
      content.scrollTop = 0
      ;['modal-scroll', 'layout-view'].forEach(c => {
        [].slice.call(content.getElementsByClassName(c)).forEach(el => {
          el.scrollTop = 0
        })
      })
    },
    __hide () {
      EscapeKey.pop()
      openedModalNumber--

      if (openedModalNumber === 0) {
        const body = document.body

        body.classList.remove('with-modal')
      }
    }
  },
  mounted () {
    if (this.startOpen) {
      this.value = true
    }
  },
  beforeDestroy () {
    if (this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el)
    }
  },
  render (h) {
    return h('transition', {
      props: this.transitionProps,
      on: {
        afterEnter: () => {
          this.showPromise && this.showPromiseResolve()
        },
        enterCancelled: () => {
          this.showPromise && this.showPromiseReject()
        },
        afterLeave: () => {
          this.hidePromise && this.hidePromiseResolve()
        },
        leaveCancelled: () => {
          this.hidePromise && this.hidePromiseReject()
        }
      }
    },
  }
// QModalLayout is already integrated
</script>