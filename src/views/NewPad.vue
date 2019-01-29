<template>
  <b-container>
    <b-row>
      <b-col>
        <TopNav></TopNav>
      </b-col>
    </b-row>
    <b-row  class="mx-5 my-2">
      <b-col>
      <b-form @submit="onSubmit" @reset="onReset">
        <b-form-group
            label="Name:">
          <b-form-input v-model="form.name" type="text" required placeholder="Input Name">
          </b-form-input>
        </b-form-group>
        <b-form-group label="Start:" :description="TZ">
          <b-form-input v-model="form.start.date" type="date" class="w-50 d-inline">
          </b-form-input>
          <b-form-input v-model="form.start.time" type="time" class="w-50 d-inline">
          </b-form-input>
        </b-form-group>
        <b-form-group label="End:" :description="TZ">
          <b-form-input v-model="form.end.date" type="date" class="w-50 d-inline">
          </b-form-input>
          <b-form-input v-model="form.end.time" type="time" class="w-50 d-inline">
          </b-form-input>
        </b-form-group>
        <b-form-group label="Join Code:"
            description="Blank to not verify.">
          <b-form-input v-model="form.join_code" type="text" placeholder="Input Join Code">
          </b-form-input>
        </b-form-group>
        <b-form-group label="Other Message:"
            description="Support Markdown syntax.">
          <b-form-textarea v-model="form.message" placeholder="Enter something..." :rows="3" :max-rows="10">
          </b-form-textarea>
        </b-form-group>
        <b-button type="submit" variant="primary">Submit</b-button>
        <b-button type="reset" variant="danger">Reset</b-button>
      </b-form>
</b-col>

    </b-row>
  </b-container>
</template>
<script>
import TopNav from '@/components/TopNav'

export default {
  name: 'addpad',
  components: {
    TopNav
  },
  data: function () {
    var date, today, tomorrow, UTC_0
    date = new Date()
    today = date.toLocaleDateString().replace(/\//g, '-')
    tomorrow = new Date(date.valueOf() + 24 * 60 * 60 * 1000).toLocaleDateString().replace(/\//g, '-')
    UTC_0 = (Math.abs(date.getTimezoneOffset() / 60) < 10 ? '0' : '') + (date.getTimezoneOffset() / -60) % 24 + ':00'
    return {
      TZ: 'GMT' + (date.getTimezoneOffset() < 0 ? '+' : '-') + UTC_0,
      form: {
        name: '',
        start: { date: today, time: UTC_0 },
        end: { date: tomorrow, time: UTC_0 },
        join_code: '',
        message: ''
      }
    }
  },
  methods: {
    onSubmit (evt) {
      evt.preventDefault()
      let data = JSON.parse(JSON.stringify(this.form))
      if (this.form.start.date && this.form.start.time) {
        data.start = new Date(this.form.start.date + ' ' + this.form.start.time).toISOString()
      } else {
        data.start = ''
      }
      if (this.form.end.date && this.form.end.time) {
        data.end = new Date(this.form.end.date + ' ' + this.form.end.time).toISOString()
      } else {
        data.end = ''
      }
      this.$axios.post(`${this.CONFIG.apiServer}game/`, data).then((result) => {
        this.$router.push({ path: `/game/${result.data.game}` })
      }).catch((result) => {
        // this.progressing = false
      })
    },
    onReset (evt) {
      evt.preventDefault()
      var date, today, tomorrow, UTC_0
      date = new Date()
      today = date.toLocaleDateString().replace(/\//g, '-')
      tomorrow = new Date(date.valueOf() + 24 * 60 * 60 * 1000).toLocaleDateString().replace(/\//g, '-')
      UTC_0 = (Math.abs(date.getTimezoneOffset() / 60) < 10 ? '0' : '') + (date.getTimezoneOffset() / -60) % 24 + ':00'
      return {
        TZ: 'GMT' + (date.getTimezoneOffset() < 0 ? '+' : '-') + UTC_0,
        form: {
          name: '',
          start: { date: today, time: UTC_0 },
          end: { date: tomorrow, time: UTC_0 },
          join_code: '',
          message: ''
        }
      }
    }
  }
}

</script>
<style>
</style>
