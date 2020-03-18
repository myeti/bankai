<template>
  <div class="loading">

    <span class="loading_title">BANKAI</span>

    <div class="loading_spinner">
      <div class="loading_spinner">
        <div class="loading_spinner"></div>
      </div>
    </div>

    <div class="loading_version">v{{ version }}</div>

  </div>
</template>


<script>
import pkg from '../../package.json'

export default {
  data: () => ({
    version: pkg.version
  })  
}
</script>


<style lang="scss" scoped>
.loading {
  z-index: 999;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #232b38;

  &_title {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
    font-weight: bold;
    font-size: 22px;
    color: coral;
  }

  &_spinner {
    display: flex;
    justify-content: center;
    align-items: center;
    max-height: 250px;
    max-width: 250px;
    height: 90%;
    width: 90%;
    border-radius: 100%;
    border: 4px solid #eee;
    border-top-color: transparent;
    border-bottom-color: transparent;
    animation: spin 2s ease-in-out infinite;
  }
  &_spinner > &_spinner {
    border-width: 3px;
  }
  &_spinner > &_spinner > &_spinner {
    border-width: 2px;
  }

  &_version {
    position: absolute;
    bottom: 5px;
    left: 0;
    right: 0;
    font-size: 13px;
    text-align: center;
    opacity: .3;
  }
}

@keyframes spin {
  from { transform: rotate(0deg) }
  to { transform: rotate(180deg) }
}
</style>