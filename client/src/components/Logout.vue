<template>
  <div>
    <button @click="logOut()">Logout</button>
  </div>
</template>

<script>
import gql from 'graphql-tag';

export default {
  methods: {
    logOut() {
      localStorage.removeItem('apollo-token');
      window.location.reload();
    }
  }
}
</script>