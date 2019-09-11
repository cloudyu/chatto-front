<template>
<div class="game-pad">
  <div @mousemove="resize" @mouseup="resizeEnd" class="resize-mark">
    <div class="loading" :height="this.iframeHeight + 'px'">
      <transition name="fade">
        <loading v-show="this.iframeCount > 0" />
      </transition>
    </div>
    <transition name="fade" >
      <iframe class="" v-show="this.iframeCount <= 0 && this.codimdShow" :src="this.codimd" :width="this.leftWidth + '%'" :height="this.iframeHeight" frameborder="no"
           v-on:load="iframeLoad" :style="{'pointer-events': (resizeOn ? 'none' :'')}"></iframe>
    </transition>
    <div v-show="this.iframeCount <= 0 && (rocketShow && codimdShow)" class="resize" :style="{'height': leftWidth +'px'}" @mouseup="resizeEnd">
      <div @mousedown="resizeStart"></div>
    </div>
    <transition name="fade">
      <iframe class="rocket-chat" v-show="this.iframeCount <= 0 && this.rocketShow" :src="this.chat" :width="this.rightWidth + '%'" :height="this.iframeHeight" frameborder="no"
           v-on:load="iframeLoad" :style="{'pointer-events': (resizeOn ? 'none' :'')}"></iframe><!--?layout=embedded-->
    </transition>
  </div>
  <b-row class="toggle-pad">
    <b-button variant="warning" pill v-on:click="rocketShow=!rocketShow;codimdShow=!codimdShow">
      <font-awesome-icon v-show="!codimdShow" icon="comment-dots"></font-awesome-icon>
      <font-awesome-icon v-show="!rocketShow" icon="clipboard-list" ></font-awesome-icon>
    </b-button>
  </b-row>

</div>
</template>

<script>
import loading from '@/components/Loading'
export default {
  name: 'pad',
  props: {
    codimd: {
      type: String,
      default: ''
    },
    chat: {
      type: String,
      default: ''
    }
  },
  components: {
    loading
  },
  data: function () {
    return {
      iframeHeight: document.documentElement.clientHeight,
      leftWidth: 65,
      rightWidth: 35,
      iframeCount: 2,
      resizeOn: false,
      rocketShow: true,
      codimdShow: true,
      resizeFunc: function () {}
    }
  },
  mounted: function () {
    let self = this
    self.resizeFunc = function (e) {
      self.iframeHeight = document.documentElement.clientHeight
      if (document.documentElement.clientWidth < 779) {
        self.leftWidth = 100
        self.rightWidth = 100
        self.rocketShow = self.codimdShow && self.rocketShow ? false : self.rocketShow
      } else {
        self.leftWidth = 65
        self.rightWidth = 35
        self.rocketShow = self.codimdShow = true
      }
    }
    self.resizeFunc()
    window.addEventListener('resize', self.resizeFunc)
  },
  destroyed: function () {
    window.removeEventListener('resize', self.resizeFunc)
  },
  methods: {
    iframeLoad: function (e) {
      this.iframeCount--
    },
    resizeStart: function (e) {
      this.resizeOn = true
      e.preventDefault()
    },
    resizeEnd: function (e) {
      this.resizeOn = false
      e.preventDefault()
    },
    resize: function (e) {
      if (this.resizeOn) {
        if (e.buttons === 0) {
          this.resizeOn = false
        }
        if (e.srcElement.className === 'resize-mark') {
          let iframeWidth = e.layerX / e.target.clientWidth * 100
          let minWidth = 100 - (779 / e.target.clientWidth * 100)
          iframeWidth = iframeWidth > 100 ? 100 : iframeWidth
          iframeWidth = iframeWidth < minWidth ? minWidth : iframeWidth
          this.leftWidth = iframeWidth
          this.rightWidth = 100 - iframeWidth
        }
        e.preventDefault()
      }
    }
  },
  computed: {
  }
}
</script>
<style>
.game-pad .resize {
  width: 8px;
  margin: 0px -4px;
  display: inline-block;
}
.game-pad .resize div {
  width: 8px;
  height: 120px;
  top: 50%;
  margin-top: -60px;
  background-color: #f3f3f3;
  cursor: w-resize;
  position: absolute;
  border-radius: 5px;
  z-index: 99;
}
.game-pad .resize div:hover {
  background-color: #aaa;
}
.game-pad .rocket-chat {
  max-width: 779px;
}
.game-pad iframe {
  margin-bottom: -6px;
}
.toggle-pad {
  position: fixed;
  bottom: 80px;
  right: 50px;
  z-index: 100;
  display: none;
}
@media screen and (max-width: 780px) {
  .toggle-pad {
    display: block;
  }
}

@media screen and (max-width: 500px) {
  .game-pad .loading {
    width: 50%;
    position: absolute;
    left: 120px;
  }
}
</style>
