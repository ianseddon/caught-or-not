module.exports = {
  // fieldName: (parent, args, context, info) => data,

  Query: {
    allPokemon: (_, { offset, limit }, { dataSources }) =>
      dataSources.pokemonAPI.getAllPokemon({ offset, limit }),
    pokemon: (_, { id }, { dataSources }) =>
      dataSources.pokemonAPI.getPokemonById({ pokemonId: id }),

    me: async (_, __, { dataSources }) =>
      dataSources.userAPI.findOrCreateUser(),
  },

  Mutation: {
    markCaught: async (_, { pokemonId }, { dataSources }) => {
      const result = await dataSources.userAPI.markCaught({ pokemonId });
      if (!result) {
        return {
          success: false,
          message: 'Oh no!',
        };
      }

      const pokemon = await dataSources.pokemonAPI.getPokemonById({ pokemonId });
      return {
        success: true,
        message: 'Anotha one.',
        pokemon,
      };
    },
    unmarkCaught: async (_, { pokemonId }, { dataSources }) => {
      const result = await dataSources.userAPI.unmarkCaught({ pokemonId });
      if (!result) {
        return {
          success: false,
          message: 'I guess they\'re sticking around',
        };
      }

      const pokemon = await dataSources.pokemonAPI.getPokemonById({ pokemonId });
      return {
        success: true,
        message: 'Cya!',
        pokemon,
      };
    },
    login: async (_, { email }, { dataSources }) => {
      const user = await dataSources.userAPI.findOrCreateUser({ email });
      if (user) return Buffer.from(email).toString('base64');
    },
  },

  Pokemon: {
    isCaught: (pokemon, _, { dataSources }) =>
      dataSources.userAPI.hasCaught({ pokemonId: pokemon.id }),
  },

  User: {
    caught: async (_, __, { dataSources }) => {
      const pokemonIds = await dataSources.userAPI.getPokemonIdsByUser();
      if (!pokemonIds.length) {
        return [];
      }

      return (
        dataSources.pokemonAPI.getPokemonByIds({
          pokemonIds,
        }) || []
      )
    }
  }
};