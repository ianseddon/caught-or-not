<template>
  <div class="login">
    <input type="text" placeholder="Email" v-model="email" />
    <ApolloMutation
      :mutation="gql => gql`
        mutation login($email: String!) {
          login(email: $email)
        }
      `"
      :variables="{ email }"
      @done="onDone">
      <template v-slot="{ mutate, loading, error }">
        <button :disabled="loading" @click="mutate()">Login</button>
        <p v-if="error">An error occurred: {{ error }}</p>
      </template>
    </ApolloMutation>
  </div>
</template>

<script>
import gql from 'graphql-tag';
import { onLogin } from '../vue-apollo';

export default {
  data() {
    return {
      email: '',
    }
  },

  methods: {
    onDone({ data }) {
      localStorage.setItem('apollo-token', data.login);
      this.$apollo.provider.defaultClient.writeData({ data: { isLoggedIn: true }});
      window.location.reload();
    }
  }
}
</script>

<style>
.login {
  display: flex;
  flex-direction: row;
}
.login input, .login button {
  margin: 0 5px;
}
</style>
