const { gql } = require('apollo-server');

const typeDefs = gql`
type Query {
  allPokemon(
    """
    The number of results to show. Must be >= 1. Default = 20
    """
    pageSize: Int
    """
    If you add an offset here, it will only return results _after_ this offset.
    """
    offset: Int
  ): PokemonConnection!
  pokemon(id: ID!): Pokemon

  me: User
}
type Mutation {
  markCaught(pokemonId: ID!): CaughtStatusUpdateResponse!
  unmarkCaught(pokemonId: ID!): CaughtStatusUpdateResponse!

  login(email: String): String # login token
}

"""
Wrapper around the list of Pokemon that contains a cursor to the last item in the list.
Pass this cursor to the allPokemon query to fetch results after these.
"""
type PokemonConnection {
  cursor: Int!
  hasMore: Boolean!
  pokemon: [Pokemon]!
}

type CaughtStatusUpdateResponse {
  success: Boolean!
  message: String
  pokemon: Pokemon
}

type User {
  id: ID!
  email: String!
  caught: [Pokemon]!
}

type Pokemon {
  id: ID!
  name: String!
  image: String
  types: [PokemonType]!
  isCaught: Boolean!
}

enum PokemonType {
  NORMAL
  WATER
  ELECTRIC
  FIGHTING
  GROUND
  PSYCHIC
  ROCK
  DARK
  STEEL
  FIRE
  GRASS
  ICE
  POISON
  FLYING
  BUG
  GHOST
  DRAGON
  FAIRY
}
`;

module.exports = typeDefs;