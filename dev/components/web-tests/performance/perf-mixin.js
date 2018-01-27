export default {
  props: {
    renderWork: Number,
    displayString: String,
    computeWork: Number,
    computeString: String,
    workFunction: Function,
    computeStringOutput: Function
  },
  computed: {
    computeStringOutputComputed: function () {
      this.workFunction(this.computeWork)
      return this.computeString
    }
  }
}
