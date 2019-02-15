<template>
  <div>
    <background></background>
    <b-row align-h="center" id="index">
      <b-jumbotron border-variant="secondary">
        <template slot="header">
          <b>Chatto-Pad</b>
        </template>
        <template slot="lead">
          A simple ctf pad based on codimd and rocket.chat. To make communication easier!
        </template>
        <hr class="my-4">
        <b-btn v-if="isLogin" variant="outline-success float-right" size="lg" href="/#/home">Start</b-btn>
        <b-btn v-else variant="outline-primary float-right" size="lg" :href="loginUrl">Login</b-btn>
      </b-jumbotron>
    </b-row>
  </div>
</template>
<script>
import background from '@/components/StarsBackground'
export default {
  name: 'index',
  data: function () {
    return {
      isLogin: false,
      loginUrl: `${this.CONFIG.apiServer}user/oauth`
    }
  },
  created: function () {
    let token = localStorage.getItem('token')
    let user
    if (!token || token.indexOf('.') === -1 || token.indexOf('.') === token.lastIndexOf('.')) {
      localStorage.setItem('token', '')
      this.isLogin = false
    } else {
      user = JSON.parse(atob(token.substring(token.indexOf('.') + 1, token.lastIndexOf('.'))))
      if (user.exp < new Date().getTime() / 1000) {
        localStorage.setItem('token', '')
        this.isLogin = false
      } else {
        this.isLogin = true
      }
    }
  },
  components: {
    background
  }
}
</script>
<style>
#index {
  margin-top: 12%;
}
#index .jumbotron{
  background-color: #e9ecefe0;
  min-width: 800px;
}
#index .float-right{
  margin-right: 20px;
}
</style>
