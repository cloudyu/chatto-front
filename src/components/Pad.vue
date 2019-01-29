<template>
  <div @mousemove="resize" @mouseup="resizeEnd" class="game-pad">
    <div style="height:100%;">
      <transition name="fade">
        <loading v-show="this.iframeCount > 0" />
      </transition>
    </div>
    <transition name="fade">
      <iframe v-show="this.iframeCount <= 0" :src="this.codimd" :width="this.iframeWidth + '%'" :height="this.iframeHeight" frameborder="no"
           v-on:load="iframeLoad" :style="{'pointer-events': (resizeOn ? 'none' :'')}"></iframe>
    </transition>
    <div v-show="this.iframeCount <= 0" class="resize" :style="{'height': this.iframeHeight +'px'}" @mouseup="resizeEnd">
      <div @mousedown="resizeStart"></div>
    </div>
    <transition name="fade">
      <iframe v-show="this.iframeCount <= 0" :src="this.chat + '?layout='" :width="(100-this.iframeWidth) + '%'" :height="this.iframeHeight" frameborder="no"
           v-on:load="iframeLoad" :style="{'pointer-events': (resizeOn ? 'none' :'')}"></iframe>
    </transition>
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
      iframeWidth: 65,
      iframeCount: 2,
      resizeOn: false
    }
  },
  mounted: function () {
    let self = this
    window.onresize = function () {
      self.iframeHeight = document.documentElement.clientHeight
    }
    window.onresize()
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
        this.iframeWidth = e.layerX / e.target.clientWidth * 100
        this.iframeWidth = this.iframeWidth > 100 ? 100 : this.iframeWidth
      }
    }
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
  z-index: 9999;
}
.game-pad .resize div:hover {
  background-color: #aaa;
}
</style>
