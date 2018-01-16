<template>
  <q-search v-model="terms" placeholder="Start typing a country name">
    <q-autocomplete @search="search" />
  </q-search>       
</template>

<script type="text/javascript">
  import { filter } from 'quasar'

  const countries = ['Afghanistan', 'Brazil', 'Zimbabwe']

  function parseCountries () {
    console.log(countries)
    return countries.map(country => {
      return {
        label: country,
        value: country
      }
    })
  }

  export default {
    data () {
      return {
        terms: '',
        countries: parseCountries()
      }
    },

    methods: {
      search (terms, done) {
        debugger
        console.log(parseCountries())
        console.log(terms)
        let results = filter(terms, {field: 'value', list: parseCountries()})
        console.log(results)
        done(results)
        /*
        setTimeout(() => {
          done(filter(terms, {field: 'value', list: parseCountries()}))
        }, 1000)
        */
      }
    }
  }
</script>