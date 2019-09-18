<template>
  <div class="pokemon">
    <div class="pokemon--id">{{ pokemon.id }}</div>
    <div class="pokemon--image">
      <img class="pokemon--image" v-bind:src="pokemon.image" />
    </div>
    <span class="pokemon--name">{{ pokemon.name }}</span>
    <div class="pokemon--spacer"></div>
    <div class="pokemon--types">
      <PokemonType v-for="pokemonType in pokemon.types" v-bind:type="pokemonType" />
    </div>
    <img class="pokemon--action markCaught"
      src="https://img.icons8.com/color/48/000000/pokeball-2.png"
      v-if="!pokemon.isCaught"
      @click="markCaught()">
    <img class="pokemon--action unmarkCaught"
      src="https://img.icons8.com/color/48/000000/pokeball-2.png"
      v-if="pokemon.isCaught"
      @click="unmarkCaught()">
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag';
import PokemonType from './PokemonType';

const POKEMON_FRAGMENT = gql`
  fragment pokemon on Pokemon {
    id
    name
    image
    types
    isCaught
  }
`;

const GET_MY_POKEMON = gql`
  query GetMyPokemon {
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

const MARK_CAUGHT = gql`
  mutation MarkCaught($pokemonId: ID!) {
    markCaught(pokemonId: $pokemonId) {
      success
      message
      pokemon {
        ...pokemon
      }
    }
  }
  ${POKEMON_FRAGMENT}
`;

const UNMARK_CAUGHT = gql`
  mutation UnmarkCaught($pokemonId: ID!) {
    unmarkCaught(pokemonId: $pokemonId) {
      success
      message
      pokemon {
        ...pokemon
      }
    }
  }
  ${POKEMON_FRAGMENT}
`;

export default {
  components: {
    PokemonType,
  },

  props: {
    pokemon: Object,
  },

  methods: {
    markCaught() {
      this.$apollo.mutate({
        mutation: MARK_CAUGHT,
        variables: {
          pokemonId: this.pokemon.id,
        },
        update: (store, { data: { markCaught } }) => {
          const data = store.readQuery({ query: GET_MY_POKEMON });
          data.me.caught.push(markCaught.pokemon);
          store.writeQuery({ query: GET_MY_POKEMON, data });
        },
      });
    },
    unmarkCaught() {
      this.$apollo.mutate({
        mutation: UNMARK_CAUGHT,
        variables: {
          pokemonId: this.pokemon.id,
        },
        update: (store, { data: { unmarkCaught }}) => {
          const data = store.readQuery({ query: GET_MY_POKEMON });
          data.me.caught = data.me.caught.filter(i => i.id !== unmarkCaught.pokemon.id);
          store.writeQuery({ query: GET_MY_POKEMON, data });
        }
      });
    },
  }
}
</script>

<style>
.pokemon {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.pokemon--image {
  width: 128px;
}
.pokemon--image img {
  height: 64px;
  width: auto;
}
.pokemon--name {
  text-align: left;
  text-transform: capitalize;
}
.pokemon--types {
  display: flex;
  flex-direction: row;
}
.pokemon--spacer {
  flex: auto;
}
.pokemon--action {
  width: 36px;
  height: 36px;
  cursor: pointer;
}
.pokemon--action.markCaught {
  opacity: 0.5;
}
.pokemon--action.markCaught:hover {
  opacity: 0.75;
}
.pokemon--actions.unmarkCaught {
  opacity: 1;
}
.pokemon--action.unmarkCaught:hover {
  opacity: 0.75;
}
</style>