<template>
  <div>
    <header>
      <span class="title">Caught or Not</span>
      <Logout v-if="isLoggedIn" />
      <Login v-if="!isLoggedIn" />
    </header>
    <div id="app">
      <div class="container">
        <PokemonIndex />
      </div>
    </div>
  </div>
</template>

<script>
import Login from './components/Login';
import Logout from './components/Logout';
import PokemonIndex from './components/PokemonIndex';

export default {
  name: 'app',
  components: {
    Login,
    Logout,
    PokemonIndex,
  },
  computed: {
    isLoggedIn() {
      return !!localStorage.getItem('apollo-token');
    }
  },
}
</script>

<style>
#app {
  text-align: center;
  margin: 20px 100px;
}

header {
  color: #fff;
  background: #2c3e50;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
}
header .title {
  font-size: 16px;
  font-weight: bold;
}

body {
  margin: 0;
  color: #2c3e50;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
