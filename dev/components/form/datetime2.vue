<template>
  <div>
    <div class="layout-padding">
      <p class="caption">Dynamic QDatetime Component Tests</p>
      <template v-for="disableMode in disableModes">
        <template v-for="displayMode in displayModes">
          <template v-for="type in types">
            <template v-for="clearable in clearables">
              <q-datetime 
                :key="`-${disableMode}-${displayMode}-${type}-${clearable}`"
                v-model="model"
                v-bind="options(disableMode, displayMode, type, clearable)"  
                :float-label="JSON.stringify(options(disableMode, displayMode, type, clearable))" /> 
            </template>
          </template>
        </template>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      model: undefined,
      disableModes: ['', 'disable', 'readonly'],
      displayModes: ['', 'popover', 'modal'],
      types: ['date', 'time', 'datetime'],
      clearables: [false, true]
    }
  },
  methods: {
    options (disableMode, displayMode, type, clearable) {
      let opt = []
      if (disableMode) opt.push({[disableMode]: true})
      if (displayMode) opt.push({[displayMode]: true})
      opt.push({'type': type})
      if (clearable) opt.push({'clearable': true})
      return opt
    }
  }
}
</script>