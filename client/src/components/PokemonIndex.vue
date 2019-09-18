<template>
  <div>
    <!-- Result -->
    <div v-if="me && me.caught">
      <h2>My Pokemon</h2>
      <p v-if="!me.caught.length">You haven't caught any Pokemon yet!</p>
      <Pokemon v-for="pokemon in me.caught" v-bind:pokemon="pokemon" />
    </div>

    <h2>All Pokemon</h2>

    <!-- Result -->
    <div v-if="allPokemon && allPokemon.pokemon">
      <Pokemon v-for="pokemon in allPokemon.pokemon" v-bind:pokemon="pokemon" />

      <button v-if="showMoreEnabled" @click="showMore">Show more</button>
    </div>

    <!-- Loading -->
    <div v-if="!allPokemon || allPokemon.loading">Loading...</div>
  </div>
</template>

<script>
import gql from 'graphql-tag';
// import { GET_MY_POKEMON, GET_ALL_POKEMON, POKEMON_FRAGMENT } from '../queries';
import Pokemon from './Pokemon';

const pageSize = 20;

const POKEMON_FRAGMENT = gql`
  fragment pokemon on Pokemon {
    id
    name
    image
    types
    isCaught
  }
`;

const GET_ALL_POKEMON = gql`
  query allPokemon($offset: Int, $pageSize: Int) {
    allPokemon(offset: $offset, pageSize: $pageSize) {
      cursor
      hasMore
      pokemon {
        ...pokemon
      }
    }
  }
  ${POKEMON_FRAGMENT}
`;

const GET_MY_POKEMON = gql`
  query myPokemon {
    me {
      id
      email
      caught {
        ...pokemon
      }
    }
  }
  ${POKEMON_FRAGMENT}
`;

export default {
  fragments: {
    pokemon: POKEMON_FRAGMENT,
  },
  apollo: {
    allPokemon: {
      query: GET_ALL_POKEMON,
      variables: {
        offset: 0,
        pageSize,
      },
    },
    me: {
      query: GET_MY_POKEMON,
    }
  },

  components: {
    Pokemon,
  },

  data() {
    return {
      page: 0,
      showMoreEnabled: true,
    };
  },

  methods: {
    showMore() {
      this.page++;
      this.$apollo.queries.allPokemon.fetchMore({
        // New variables
        variables: {
          offset: this.page * pageSize,
          pageSize,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          const newPokemon = fetchMoreResult.allPokemon.pokemon;
          const hasMore = fetchMoreResult.allPokemon.hasMore;

          this.showMoreEnabled = hasMore;

          return {
            ...fetchMoreResult,
            allPokemon: {
              ...fetchMoreResult.allPokemon,
              pokemon: [
                ...prev.allPokemon.pokemon,
                ...fetchMoreResult.allPokemon.pokemon,
              ],
            },
          };
        },
      })
    }
  }
}
</script>