const { RESTDataSource } = require('apollo-datasource-rest');

class PokemonAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://pokeapi.co/api/v2/';
  }

  async getAllPokemon({ offset = 0, limit = 20 }) {
    const listingResponse = await this.get('pokemon', { offset, limit });
    if (!listingResponse || !listingResponse.results || !listingResponse.results.length) {
      return [];
    }
    const pokemonIds = listingResponse.results.map((p) => p.name);
    const pokemon = await Promise.all(
      pokemonIds.map(pokemonId => this.getPokemonById({ pokemonId }))
    );

    return {
      hasMore: !!listingResponse.next,
      cursor: offset + limit,
      pokemon,
    }
  }

  async getPokemonById({ pokemonId }) {
    const response = await this.get(`pokemon/${pokemonId}`);
    return this.pokemonReducer(response);
  }

  getPokemonByIds({ pokemonIds }) {
    return Promise.all(
      pokemonIds.map((pokemonId) => this.getPokemonById({ pokemonId }))
    );
  }

  pokemonReducer(pokemon) {
    return {
      id: pokemon.id,
      name: pokemon.name,
      image: pokemon.sprites.front_default,
      types: pokemon.types.map(type => type.type && type.type.name.toUpperCase())
    };
  }
}

module.exports = PokemonAPI;