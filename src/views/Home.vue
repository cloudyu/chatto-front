<template>
  <b-container>
    <b-row>
      <b-col>
        <TopNav></TopNav>
      </b-col>
    </b-row>
    <b-row  class="mx-5 my-2">
        <b-col md="6" lg="4" cols="12" v-for="game in games" :key="game.id">
          <b-card class="my-3"
            header-bg-variant="transparent">
            <h6 slot="header" class="mb-0">
              <b-badge v-if="game.end && (new Date(game.end) < new Date())" href="#" variant="dark">Over</b-badge>
              <b-badge v-else-if="game.start && (new Date(game.start) > new Date())" href="#" variant="warning">Not yet</b-badge>
              <b-badge v-else href="#" variant="success">Online</b-badge>
            </h6>
            <router-link :to="'/game/'+game.id">
              <div class="card-text text-center">
                  <h4>{{game.name}}</h4>
                  {{new Date(game.start).toLocaleDateString()}} - {{new Date(game.end).toLocaleDateString()}}
              </div>
            </router-link>
            <div slot="footer" class="text-center">
              <small class="text-muted">{{new Date(game.create_time).toLocaleDateString()}}</small>
            </div>
          </b-card>
        </b-col>
    </b-row>
  </b-container>
</template>
<script>
import TopNav from '@/components/TopNav'

export default {
  name: 'home',
  components: {
    TopNav
  },
  created: function () {
    let self = this
    this.$axios.get(`${this.CONFIG.apiServer}game/`).then((result) => {
      self.games = result.data.games
    }).catch(() => {
      this.$router.push({ path: `/` })
    })
  },
  data: function () {
    return {
      games: []
    }
  }
}

</script>
