<template>
  <div>
    <background></background>
    <b-row align-h="center" id="index">
      <b-jumbotron>
        <template slot="header">
          <b>{{title}}</b>
        </template>
        <template slot="lead">
          {{msg}}
        </template>
      </b-jumbotron>
    </b-row>
  </div>
</template>
<script>
import background from '@/components/StarsBackground'
export default {
  name: 'callback',
  data: function () {
    return {
      title: 'Loading',
      msg: 'You can log in now. Please be patient!'
    }
  },
  created: function () {
    if (this.$route.query.code) {
      this.$axios.get(`${this.CONFIG.apiServer}user/callback`, {
        params: {
          code: this.$route.query.code
        }
      }).then((result) => {
        if (result.data.token) localStorage.setItem('token', result.data.token)
        if (localStorage.getItem('jumpto')) {
          this.$router.replace({ path: '/game/' + localStorage.getItem('jumpto') })
          localStorage.setItem('jumpto', '')
        } else {
          this.$router.replace({ path: '/home' })
        }
      }).catch(() => {
        this.$router.replace({ path: '/' })
      })
    }
  },
  components: {
    background
  }
}
</script>
