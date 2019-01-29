<template>
  <b-row id="pad">
    <b-col cols="auto">
      <b-row class="text-center"><b-col><h2><b><router-link to="/" tag="div">Chatto-Pad</router-link></b></h2><hr class="my-1"/></b-col>
        <b-col class="p-0">
          <b-form-checkbox-group  v-model="selectedType" button-variant="outline-primary" buttons size="sm">
          <b-form-checkbox v-for="type in types" :value="type.toLowerCase()" :key="type" class="text-capitalize">{{type.substr(0,4)}}</b-form-checkbox>
        </b-form-checkbox-group><br />
        <b-form-checkbox-group v-model="selectedStatus" buttons>
          <b-form-checkbox button-variant="outline-success" :value="1" >SOLVED</b-form-checkbox>
          <b-form-checkbox button-variant="outline-warning" :value="0" >UNSOLVED</b-form-checkbox>
        </b-form-checkbox-group>
      </b-col></b-row>
      <b-row class="text-center m-0 pl-1">
        <b-col class="p-0">
        <b-form-radio-group id="switchPad" v-model="viewPad" buttons stacked button-variant="outline-primary" size="lg" class="w-100">
          <b-form-radio :value="0" button-variant="success">
              <div v-on:click="ShowPad(game)" class="text-left">
                {{game.name}}
                <b-badge pill :variant="game.rocket_chat && notify[game.rocket_chat].important?'danger':'dark'" class="float-right">{{game.rocket_chat && notify[game.rocket_chat].counts ? notify[game.rocket_chat].counts : 0}}</b-badge>
                <b-badge variant="light" v-b-modal.editChallenge class="float-right">Edit</b-badge>
              </div>
          </b-form-radio>
          <b-form-radio v-for="(challenge, index) in challenges" :key="challenge.id"
          :value="index + 1" v-show="selectedType.indexOf(challenge.type.toLowerCase()) > -1 && selectedStatus.indexOf(challenge.status) > -1">
              <div class="w-100 text-left" v-on:click="ShowPad(challenge)">
                <b-badge :variant="challenge.status?'success':'warning'" class="text-uppercase">{{challenge.type.substr(0,3)}}</b-badge>
                <b-badge variant="dark" v-if="challenge.source">{{challenge.source}}</b-badge>
                {{challenge.name}}
                  <b-badge v-if="!challenge.isShow" pill variant="secondary" class="float-right">?</b-badge>
                  <b-badge v-else pill
                    :variant="challenge.rocket_chat && notify[challenge.rocket_chat].important?'danger':'info'" class="float-right"
                    v-on:click.stop="ClosePad($event, challenge)"><span>{{notify[challenge.rocket_chat].counts}}</span></b-badge>
              </div>
          </b-form-radio>
        </b-form-radio-group>
        </b-col>
      </b-row>
    </b-col>
    <b-col class="pl-1">
      <b-tabs nav-class="d-none" v-model="viewPad" >
        <b-tab active>
          <pad :codimd="game.codimdUrl" :chat="game.chatUrl" name="0"></pad>
        </b-tab>
        <b-tab v-for="challenge in challenges" :key="challenge.id" >
          <pad v-if="challenge.isShow" :codimd="challenge.codimdUrl" :chat="challenge.chatUrl"></pad>
        </b-tab>
      </b-tabs>
    </b-col>
    <b-modal id="editChallenge" title="Edit Challenge" size="lg" @show="LoadEditData">
        <editpad :items="editChallenges" :types="types" :owner="owner"></editpad>
    </b-modal>
    <b-modal ref="lockModal" title="The pad does not exist or is locked." @ok="CodeInput" @cancel="CodeCancel">
      <b-row align-h="center">
        <b-col sm="2" align-self="end"><label>Code:</label></b-col>
        <b-col sm="8"><b-form-input v-model="join_code"
              type="text"
              placeholder="Enter your code"></b-form-input>
        </b-col>
      </b-row>
    </b-modal>

  </b-row>
</template>

<script>
import pad from '@/components/Pad'
import editpad from '@/components/EditPad'

export default {
  name: 'game',
  components: {
    pad,
    editpad
  },
  created: function () {
    let token = localStorage.getItem('token')
    let user = localStorage.getItem('user')
    if (user && JSON.parse(user).nickname) {
      this.username = JSON.parse(user).nickname
    } else {
      this.$axios.get(`${this.CONFIG.apiServer}user/`, {
      }).then((result) => {
        localStorage.setItem('user', JSON.stringify(result.data.user))
        this.username = result.data.user
      }).catch(() => {
        this.$router.push({ path: `/` })
      })
    }
    let self = this
    if (token) {
      this.$axios.get(`${this.CONFIG.apiServer}game/${this.$route.params.id}`, {
      }).then((result) => {
        let game = result.data.game
        let challenges = result.data.challenges
        game.chatUrl = `${self.CONFIG.chat}${game.rocket_chat}`
        self.$set(self.notify, game.rocket_chat, { important: false, counts: 0 })
        self.game = game
        challenges.map((p) => {
          p.chatUrl = 'about:blank'
          p.codimdUrl = 'about:blank'
          p.isShow = false
        })
        self.challenges = challenges
        self.owner = result.data.owner
        self.types = result.data.types
        self.selectedType = [...self.types]
        document.title = self.game.name
        this.WSinit()
      }).catch(() => {
        self.$refs.lockModal.show()
      })
    } else {
      localStorage.setItem('jumpto', this.$route.params.id)
      this.$router.push({ path: `/` })
    }
    Notification.requestPermission().then(function (permission) {
      if (permission === 'granted') {
        self.$notify({
          title: 'Get notification permission!',
          type: 'success',
          message: 'The message will be sent using system notifications.'
        })
      } else {
        self.$notify({
          title: 'System notification is disabled',
          type: 'warning',
          horizontalAlign: 'left',
          verticalAlign: 'bottom',
          message: 'The message will appear in here.'
        })
      }
    })
  },
  data: function () {
    return {
      viewPad: 0,
      selectedType: [ 'web', 'pwn', 'reverse', 'misc', 'crypto' ],
      selectedStatus: [ 0, 1 ],
      types: [ 'web', 'pwn', 'reverse', 'misc', 'crypto' ],
      game: { name: '', codimdUrl: 'about:blank', chatUrl: 'about:blank', rocket_chat: false },
      owner: false,
      join_code: '',
      notify: {},
      challenges: [],
      editChallenges: []
    }
  },
  methods: {
    CodeInput: function () {
      let self = this
      this.$axios.get(`${this.CONFIG.apiServer}game/${this.$route.params.id}`, {
        params: { code: self.join_code }
      }).then((result) => {
        let game = result.data.game
        let challenges = result.data.challenges
        game.chatUrl = `${self.CONFIG.chat}${game.rocket_chat}`
        self.$set(self.notify, game.rocket_chat, { important: false, counts: 0 })
        self.game = game
        challenges.map((p) => {
          p.chatUrl = 'about:blank'
          p.codimdUrl = 'about:blank'
          p.isShow = false
          self.$set(self.notify, p.rocket_chat, { important: false, counts: 0 })
        })
        self.challenges = challenges
        self.owner = result.data.owner
        self.types = result.data.types
        self.selectedType = [...self.types]
      }).catch(() => {
        self.$refs.lockModal.show()
      })
    },
    CodeCancel: function () {
      this.$router.push({ path: `/` })
    },
    ShowPad: function (challenge) {
      let self = this
      if (challenge.codimdUrl === 'about:blank' && challenge.chatUrl === 'about:blank') {
        this.$axios.get(`${this.CONFIG.apiServer}game/${this.$route.params.id}/${challenge.id}`).then((result) => {
          self.$set(self.notify, result.data.challenge.rocket_chat, { important: false, counts: 0 })
          challenge.codimdUrl = `${self.CONFIG.codimd}${result.data.challenge.codimd}`
          challenge.chatUrl = `${self.CONFIG.chat}${result.data.challenge.rocket_chat}`
          challenge.rocket_chat = result.data.challenge.rocket_chat
          self.$set(challenge, 'isShow', true)
        }).catch(() => {

        })
      } else {
        self.$set(challenge, 'isShow', true)
        let name = challenge.rocket_chat
        this.$set(this.notify[name], 'important', false)
        this.$set(this.notify[name], 'counts', 0)
      }
      this.NotificationTitle(false)
    },
    ClosePad: function (e, challenge) {
      this.$set(challenge, 'isShow', false)
      this.viewPad = 0
    },
    LoadEditData: function () {
      this.editChallenges = [{
        id: '',
        name: '',
        status: 0,
        type: '',
        source: 0
      }]
      for (let index in this.challenges) {
        let challenge = this.challenges[index]
        this.editChallenges.push({
          id: challenge.id,
          name: challenge.name,
          status: challenge.status,
          type: challenge.type.toLowerCase(),
          source: challenge.source
        })
      }
      // console.log(this.challenges)
    },
    WSinit () { // 初始化weosocket
      const WS = this.CONFIG.wsServer + `${this.$route.params.id}?token=` + localStorage.getItem('token')
      this.WS = new WebSocket(WS)
      this.WS.onopen = this.WSopen
      this.WS.onerror = this.WSerror
      this.WS.onmessage = this.WSmessage
      this.WS.onclose = this.WSclose
    },
    WSopen () {
      console.log('WS Connect Success')
    },
    WSerror (e) { // 错误
      console.log('WebSocket连接发生错误', e)
    },
    WSmessage (e) { // 数据接收
      const data = JSON.parse(e.data)
      switch (data.type) {
        case 'new-challenge':
          this.challenges.push(data.challenge)
          break
        case 'update-challenge':
          for (let i = 0; i < this.challenges.length; ++i) {
            if (this.challenges[i].id === data.challenge.id) {
              this.$set(this.challenges, i, data.challenge)
              break
            }
          }
          break
        case 'delete-challenge':
          for (let i = 0; i < this.challenges.length; ++i) {
            if (this.challenges[i].id === data.challenge.id) {
              this.challenges.splice(i, 1)
              break
            }
          }
          break
      }
    },
    WSsend (data) { // 数据发送
      this.WS.send(data)
    },
    WSclose (e) { // 关闭
      console.log('connection closed (' + e.code + ')')
      this.WSinit()
    },
    Notification (title, body, important) {
      let self = this
      Notification.requestPermission().then(function (permission) {
        if (permission === 'granted') {
          var options = {
            body: body
          }
          // eslint-disable-next-line
          new Notification(title, options)
        } else {
          self.$notify({
            title: title,
            type: important ? 'danger' : 'warning',
            horizontalAlign: 'left',
            verticalAlign: 'bottom',
            message: body
          })
        }
      })
    },
    NotificationTitle (on) {
      var remind = '❣️❗❗❗❣️ '
      if (on) {
        if (!this.interval) {
          this.interval = setInterval(function () {
            let title = document.title
            if (title.indexOf(remind) === 0) {
              title = title.substr(remind.length)
            } else {
              title = remind + title
            }
            document.title = title
          }, 1000)
        }
      } else {
        clearInterval(this.interval)
        let title = document.title
        if (title.indexOf(remind) === 0) {
          title = title.substr(remind.length)
          document.title = title
        }
        this.interval = false
      }
    }
  },
  mounted: function () {
    let self = this
    window.addEventListener('message', function (e) {
      let name, counts, sender
      switch (e.data.eventName) {
        case 'notification':
          name = e.data.data.notification.payload.name
          self.$set(self.notify[name], 'important', true)
          counts = self.notify[name].counts
          self.$set(self.notify[name], 'counts', ++counts)
          sender = e.data.data.notification.payload.sender.username
          if (sender !== self.username) {
            self.Notification('Someone Mentioned You', e.data.data.notification.text, true)
            self.NotificationTitle(true)
          }
          break
        case 'new-message':
          name = e.data.data.name
          counts = self.notify[name].counts
          self.$set(self.notify[name], 'counts', ++counts)
          sender = e.data.data.u.username
          if (sender !== self.username) {
            if (e.data.data.msg.indexOf(`@${self.username} `) === -1) {
              self.Notification('New Message', e.data.data.u.username + ': ' + e.data.data.msg, false)
              self.NotificationTitle(true)
            }
          }
          break
        case 'unread-changed-by-subscription':
          if (self.notify[e.data.data.name] === undefined) return false
          self.$set(self.notify[e.data.data.name], 'counts', e.data.data.unread)
          break
        default:
      }
    })
  }
}
</script>
<style>

#switchPad .btn-outline-primary{
  border-top-width :0;
}
#pad h2 {
  margin-top: 10px;
}
#pad>.col-auto>.row{
  padding-bottom: 10px;
}
#pad>.col-auto>.row .btn-group{
  padding-top: 5px;
}
#pad>.col-auto>.row .badge.float-right{
  margin-top: 6px;
  margin-right: -5px;
}
#pad>.col-auto>.row .badge.badge-primary{
  margin-left: -10px;
}
#pad>.col-auto>.row .badge-light.float-right{
  margin-right: 5px;
}
#pad .badge{
  font-family: Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;
  margin-left: 5px;
}
#pad>.col-auto{
  max-width: 300px;
}
#switchPad .btn-outline-primary .float-right:not(.badge-secondary):hover {
    background-color: #dc3545;
}
#switchPad .btn-outline-primary .float-right:not(.badge-secondary):hover>span {
    display: none;
}
#switchPad .btn-outline-primary .float-right:not(.badge-secondary):hover:after {
    content: 'X';
}
</style>
