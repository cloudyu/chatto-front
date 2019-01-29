
<template>
  <b-navbar toggleable="md" type="dark" variant="dark">
    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
    <b-navbar-brand href="#">Chatto-Pad</b-navbar-brand>
    <b-collapse is-nav id="nav_collapse">
      <b-navbar-nav>
        <b-nav-item href="/">Index</b-nav-item>
        <b-nav-item href="/#/home" :active="$route.name=='home'">Home</b-nav-item>
        <b-nav-item href="/#/new" :active="$route.name=='new'">New Pad</b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown right>
          <template slot="button-content">
            <img :src="user.avatar" class="d-inline-block mx-1" width="30" /><em>{{user.nickname}}</em>
          </template>
          <b-dropdown-item href="#" @click="signout">Signout</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>
<script>
export default {
  name: 'topnav',
  data: function () {
    return {
      user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : { avatar: '', nickname: '' }
    }
  },
  created: function () {
    let token = localStorage.getItem('token')
    let user = localStorage.getItem('user')
    let self = this
    console.log(self)
    if (token && !user) {
      this.$axios.get(`${this.CONFIG.apiServer}user/`, {
      }).then((result) => {
        localStorage.setItem('user', JSON.stringify(result.data.user))
        self.user = result.data.user
      }).catch(() => {
        this.$router.push({ path: `/` })
      })
    } else {
      this.isLogin = false
    }
  },
  methods: {
    signout: function () {
      localStorage.setItem('token', '')
      localStorage.setItem('user', '')
      this.$router.push({ path: `/` })
    }
  }
}
</script>
<style>
</style>
