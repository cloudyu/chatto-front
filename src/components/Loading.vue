<template>
  <div class="cssload-loader">
    <div class="cssload-top">
      <div class="cssload-square">
        <div class="cssload-square">
        <div class="cssload-square">
          <div class="cssload-square">
          <div class="cssload-square"><div class="cssload-square">

          </div></div>
          </div>
        </div>
        </div>
      </div>
    </div>
    <div class="cssload-bottom">
      <div class="cssload-square">
        <div class="cssload-square">
        <div class="cssload-square">
          <div class="cssload-square">
          <div class="cssload-square"><div class="cssload-square">
          </div></div>
          </div>
        </div>
        </div>
      </div>
    </div>
    <div class="cssload-left">
      <div class="cssload-square">
        <div class="cssload-square">
          <div class="cssload-square">
            <div class="cssload-square">
            <div class="cssload-square"><div class="cssload-square">
            </div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="cssload-right">
      <div class="cssload-square">
        <div class="cssload-square">
        <div class="cssload-square">
          <div class="cssload-square">
          <div class="cssload-square"><div class="cssload-square">
          </div></div>
          </div>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Loading'
}
</script>

<style>
.cssload-loader{
  position: relative;
  width: 0;
  height: 400px;
  margin: auto;
}
.cssload-square {
  width: 10px;
  height: 38px;
  background: rgb(0,0,0);
  border-radius: 13px;
  display: block;
  animation: cssload-turn 2.88s ease infinite;
    -o-animation: cssload-turn 2.88s ease infinite;
    -ms-animation: cssload-turn 2.88s ease infinite;
    -webkit-animation: cssload-turn 2.88s ease infinite;
    -moz-animation: cssload-turn 2.88s ease infinite;
}
.cssload-top {
  position: absolute;
  left: 40%;
  top: 50%;
  transform: rotate(90deg);
    -o-transform: rotate(90deg);
    -ms-transform: rotate(90deg);
    -webkit-transform: rotate(90deg);
    -moz-transform: rotate(90deg);
}
.cssload-bottom {
  position: absolute;
  left: 40%;
  top: 50%;
  transform: rotate(-90deg);
    -o-transform: rotate(-90deg);
    -ms-transform: rotate(-90deg);
    -webkit-transform: rotate(-90deg);
    -moz-transform: rotate(-90deg);
}
.cssload-left {
  position: absolute;
  left: 40%;
  top: 50%;
}
.cssload-right {
  position: absolute;
  left: 40%;
  top: 50%;
  transform: rotate(-180deg);
    -o-transform: rotate(-180deg);
    -ms-transform: rotate(-180deg);
    -webkit-transform: rotate(-180deg);
    -moz-transform: rotate(-180deg);
}
@keyframes cssload-turn {
  0% {
    transform: translateX(0) translateY(0) rotate(0);
  }
  50% {
    transform: translateX(400%) translateY(100%) rotate(90deg);
  }
  100% {
    transform: translateX(0) translateY(0) rotate(0);
  }
}
@-o-keyframes cssload-turn {
  0% {
    -o-transform: translateX(0) translateY(0) rotate(0);
  }
  50% {
    -o-transform: translateX(400%) translateY(100%) rotate(90deg);
  }
  100% {
    -o-transform: translateX(0) translateY(0) rotate(0);
  }
}
@-ms-keyframes cssload-turn {
  0% {
    -ms-transform: translateX(0) translateY(0) rotate(0);
  }
  50% {
    -ms-transform: translateX(400%) translateY(100%) rotate(90deg);
  }
  100% {
    -ms-transform: translateX(0) translateY(0) rotate(0);
  }
}
@-webkit-keyframes cssload-turn {
  0% {
    -webkit-transform: translateX(0) translateY(0) rotate(0);
  }
  50% {
    -webkit-transform: translateX(400%) translateY(100%) rotate(90deg);
  }
  100% {
    -webkit-transform: translateX(0) translateY(0) rotate(0);
  }
}
@-moz-keyframes cssload-turn {
  0% {
    -moz-transform: translateX(0) translateY(0) rotate(0);
  }
  50% {
    -moz-transform: translateX(400%) translateY(100%) rotate(90deg);
  }
  100% {
    -moz-transform: translateX(0) translateY(0) rotate(0);
  }
}
</style>
