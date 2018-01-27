<template>
  <div class="column">
    <q-card class="self-center" style="max-width:625px">
      <q-toolbar>
        <q-toolbar-title>
          Component Performance Tests
        </q-toolbar-title>
      </q-toolbar>
      <q-card-main>
        <small>
          <p>For the synthetic tests, the update buttons change reactive variables: External is here: {{ triggerExternal }}, Render updates a displayed prop (rR:{{ displayString }}) forcing a re-render, Compute updates a prop (cC:{{ computeString }}) within a computed property forcing a re-compute.  For actual component tests, the render prop is adjusted for each component and there is no compute prop</p> 
          <p>Open the console to see the log of performance times</p>
        </small>
        <q-field :label-width="3" icon="extension" label="Component">
          <q-select v-model="componentName" :disable="created" float-label="Choose the Component" :options="componentNameOptions"/>
        </q-field>
        <q-field :label-width="3" icon="content_copy" label="Copies">
          <q-input v-model="repeatCount" :disable="created" type="number" float-label="Number of components to create" />
        </q-field>
        <template v-if="displayExtra">
          <q-field :label-width="3" icon="build" label="Component Type">
            <q-select v-model="componentType" :disable="created" float-label="Choose the Component Type" :options="componentTypeOptions"/>
          </q-field>
          <q-field :label-width="3" icon="settings_applications" label="Component Work">
            <div class="row no-wrap justify-between">
              <q-input v-model="renderWork" :disable="created" type="number" float-label="Function work" />
              <q-input v-model="computeWork" :disable="created" type="number" float-label="Compute work" />
            </div>
          </q-field>
        </template>
        <q-field :label-width="3" icon="settings_applications" label="Parent Component" class="q-field-floating">
          <q-btn-toggle 
            :disable="created" 
            toggle-color="primary"
            v-model="parentComponent"
            :options="[
              {label: 'Regular', value: 'generator-pr'},
              {label: 'Functional', value: 'generator-pf'}
            ]"
          />
        </q-field>
        <q-field :label-width="3" icon="timer" label="Processing Time">
          <q-input v-model="elapsedDisplay" float-label="Processing time of the last action" readonly />
        </q-field>
      </q-card-main>
      <q-card-actions align="around">
        <div class="column justify-center">
          <div class="row justify-center">
            <b>Generate</b>
          </div>
          <div class="row justify-center">
            <q-btn @click="deleteClick" :disable="!created" icon="delete_forever" label="Delete" color="red"/>
            <q-btn @click="createClick" :disable="created" icon="play_arrow" label="Create" color="primary"/>
          </div>
        </div>
        <div class="column justify-center">
          <div class="row justify-center">
            <b>Update</b>
          </div>
          <div class="row justify-center">
            <q-btn @click="updateExternalClick" :disable="!created" icon="sync" label="External" color="secondary"/>
            <q-btn @click="updateRenderClick" :disable="!created" icon="sync" label="Render" color="secondary"/>
            <q-btn v-if="displayExtra" @click="updateComputeClick" :disable="!created" icon="sync" label="Compute" color="secondary"/>
          </div>
        </div>
      </q-card-actions>
    </q-card>
    <q-list>
      <component :is="parentComponentApplied"
        :name="testComponent" 
        :props="componentProps()" 
        :repeat="repeatCountApplied"
      />
      <!-- <slot name='testComponents'></slot> -->
    </q-list>
  </div>
</template>

<script>
import GeneratorMixin from './performance/generator-mixin'
import GeneratorPf from './performance/GeneratorPf'
import GeneratorPr from './performance/GeneratorPr'

export default {
  mixins: [GeneratorMixin],
  components: {
    GeneratorPf,
    GeneratorPr
  },
  data () {
    return {
      toggle: true,
      componentName: 'perf-test',
      componentNameApplied: '',
      componentNameOptions: [
        {
          label: 'Button',
          value: 'q-btn'
        },
        {
          label: 'Datetime',
          value: 'q-datetime'
        },
        {
          label: 'Icon',
          value: 'q-icon'
        },
        {
          label: 'Select',
          value: 'q-select'
        },
        {
          label: 'Spinner',
          value: 'q-spinner'
        },
        {
          label: 'Synthetic Test',
          value: 'perf-test'
        }
      ],
      componentType: 'pf',
      componentTypeApplied: '',
      componentTypeOptions: [
        {
          label: 'Programming - Functional',
          value: 'pf'
        },
        {
          label: 'Programming - Regular',
          value: 'pr'
        },
        {
          label: 'Template - Functional',
          value: 'tf'
        },
        {
          label: 'Template - Regular',
          value: 'tr'
        }
      ],
      repeatCount: 1000,
      repeatCountApplied: 0,
      innerWorkDisable: false,
      renderWork: 0,
      renderWorkApplied: 0,
      computeWork: 1000,
      computeWorkApplied: 0,
      workFunctionApplied: '',
      testComponent: '',
      lastAction: '',
      startTime: Date(),
      endTime: Date(),
      elapsedDisplay: '',
      triggerExternal: 0,
      created: false,
      displayString: String,
      computeString: String,
      parentComponent: 'generator-pr',
      parentComponentApplied: '',
      iconName: 'face'
    }
  },
  computed: {
    displayExtra: function () {
      if (this.componentName === 'perf-test') return true
    }
  },
  methods: {
    deleteClick () {
      this.lastAction = 'Delete'
      this.startTime = new Date()
      this.repeatCountApplied = 0
      this.created = false
    },
    createClick () {
      this.lastAction = 'Create'
      this.startTime = new Date()
      this.componentApplied = this.componentName
      this.componentTypeApplied = this.componentType
      this.repeatCountApplied = this.repeatCount
      this.renderWorkApplied = this.renderWork
      this.computeWorkApplied = this.computeWork
      this.componentNameApplied = this.componentName
      if (this.componentName === 'perf-test') {
        this.testComponent = this.componentApplied + '-' + this.componentTypeApplied
      }
      else {
        this.testComponent = this.componentApplied
      }
      this.displayString = 'r'
      this.computeString = 'c'
      this.parentComponentApplied = this.parentComponent
      // this.$slots['testComponents'] = this.generateTestComponents()
      this.created = true
    },
    updateExternalClick (e, done) {
      this.toggle = !this.toggle
      this.lastAction = 'Update External'
      this.triggerExternal += 1
      this.startTime = new Date()
    },
    updateRenderClick (e, done) {
      this.toggle = !this.toggle
      this.lastAction = 'Update Render'
      this.displayString = (this.displayString === 'r') ? 'R' : 'r'
      this.iconName = (this.iconName === 'face') ? 'done' : 'face'
      this.startTime = new Date()
    },
    updateComputeClick (e, done) {
      this.toggle = !this.toggle
      this.lastAction = 'Update Compute'
      this.computeString = (this.computeString === 'c') ? 'C' : 'c'
      this.startTime = new Date()
    },
    workFunction (work) {
      // Pass work function as a prop since functional components do not have methods
      for (let n = 0; n < work; n++) {
        if (n === Math.random() - 10) {
          // Never
          break
        }
      }
      return ''
    },
    computeStringOutput: function () {
      // Pass work function as a prop since functional components do not have methods
      this.workFunction(this.computeWork)
      return this.computeString
    },
    componentProps: function () {
      let props = {}
      switch (this.componentNameApplied) {
        case 'perf-test':
          props = { renderWork: this.renderWorkApplied,
            displayString: this.displayString,
            computeWork: this.computeWorkApplied,
            computeString: this.computeString,
            workFunction: this.workFunction,
            computeStringOutput: this.computeStringOutput
          }
          break
        case 'q-btn':
          props = { label: this.displayString, noCaps: true }
          break
        case 'q-datetime':
          props = { value: '', floatLabel: this.displayString }
          break
        case 'q-icon':
          props = { name: this.iconName }
          break
        case 'q-select':
          props = {
            value: this.displayString,
            options: [
              {
                label: 'Render',
                value: 'R'
              },
              {
                label: 'render',
                value: 'r'
              }
            ]
          }
          break
        case 'q-spinner':
          break
      }
      return props
    }
    /* This works also and insert into slot, but does not get recomputed at re-render
    generateTestComponents: function () {
      let props = this.componentProps()
      let vnodes = []
      for (let i = 0; i < this.repeatCountApplied; i++) {
        props.key = i
        vnodes.push(
          this.$createElement(this.testComponent, {
            props: props
          })
        )
      }
      return vnodes
    }
    */
  },
  updated () {
    if (this.lastAction) {
      // Texts references to match
      const type = {
        'pf': 'Prgr/Fnct',
        'pr': 'Prgr/Rglr',
        'tf': 'Tmpl/Fnct',
        'tr': 'Tmpl/Rglr'
      }
      const parentType = {
        'generator-pf': 'Fnct',
        'generator-pr': 'Rglr'
      }

      // Time recording
      this.endTime = new Date()
      this.elapsedDisplay = (this.endTime - this.startTime) + ' ms'

      // Text for log
      let name = this.componentNameOptions.find(options => options.value === this.componentNameApplied)
      let text = ''
      if (this.parentComponentApplied) text = parentType[this.parentComponentApplied] + '('
      if (this.displayExtra) {
        text += 'Synthetic, ' + type[this.componentTypeApplied] + ', ' + this.repeatCount + ', ' + this.renderWorkApplied + ', ' + this.computeWorkApplied
      }
      else {
        text += name.label + ', ' + this.repeatCount
      }
      if (this.parentComponentApplied) text += ')'
      text += ', ' + this.lastAction + ', ' + this.elapsedDisplay
      console.log(text)

      this.lastAction = ''
    }
  }
}
</script>
