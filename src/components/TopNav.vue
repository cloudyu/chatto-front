
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
            <img :src="user.avatar" class="d-inline-block mx-1" width="30" /><em>{{user.username}}</em>
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
      user: { avatar: '', nickname: '' }
    }
  },
  created: function () {
    let token = localStorage.getItem('token')
    let user
    if (!token || token.indexOf('.') === -1 || token.indexOf('.') === token.lastIndexOf('.')) {
      localStorage.setItem('token', '')
      this.$router.push({ path: `/` })
    } else {
      user = JSON.parse(atob(token.substring(token.indexOf('.') + 1, token.lastIndexOf('.'))))
      if (user.exp < new Date().getTime() / 1000) {
        this.$notify({
          title: 'User',
          type: 'warning',
          message: 'Token has expired.'
        })
        localStorage.setItem('token', '')
        this.$router.push({ path: `/` })
      }
    }
    this.user = user
  },
  methods: {
    signout: function () {
      localStorage.setItem('token', '')
      this.$router.push({ path: `/` })
    }
  }
}
</script>
<style>
</style>
