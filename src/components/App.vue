<template>
  <div >
    <div id="app" :class="{'layout-blur': isShowModal}" @click="closeDropdowns">
      <header-nav />
      <main class="layout-wrapper">
        <transition name="fade" mode="out-in">
          <router-view class="view"></router-view>
        </transition>
      </main>
      <footer class="layout-footer">
        Example created by <a target="_blank" href="https://github.com/noveogroup-amorgunov">Alexander&nbsp;Morgunov</a>, {{ year }}
      </footer>
    </div>
    <ModalManager />
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import HeaderNav from '@/components/Layout/HeaderNav.vue';
  import ModalManager from '@/components/ui/Modal/ModalManager.vue';

  export default {
    name: 'app',
    components: { HeaderNav, ModalManager },
    beforeCreate() {
      this.$store.dispatch('auth/getCurrentUser');
    },
    computed: {
      ...mapGetters('app', ['isShowModal']),
      year() {
        return (new Date()).getFullYear();
      },
    },
    methods: {
      ...mapActions('app', ['closeDropdowns'])
    }
  };
</script>

<style lang="scss">

#app {
  display: flex;
  min-height: 100vh;
  height: 100%;
  flex-direction: column;
}

.layout-wrapper {
  flex: 1;
}

.layout-wrapper {
  flex: 1 0 auto;
  // padding: var(--space) var(--space) 0;
  width: 100%;
}

.layout-wrapper::after {
  content: '\00a0'; /* &nbsp; */
  display: block;
  margin-top: var(--space);
  height: 0px;
  visibility: hidden;
}

.fade-enter-active, .fade-leave-active {
  transition: all .2s ease;
}
.fade-enter, .fade-leave-active {
  opacity: 0;
}
</style>
