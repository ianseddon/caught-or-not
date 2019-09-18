const { DataSource } = require('apollo-datasource');
const isEmail = require('isemail');

class UserAPI extends DataSource {
  constructor({ store }) {
    super();
    this.store = store;
  }

  /**
   * This is a function that gets called by ApolloServer when being setup.
   * This function gets called with the datasource config including things
   * like caches and context. We'll assign this.context to the request context
   * here, so we can know about the user making requests
   */
  initialize(config) {
    this.context = config.context;
  }

  /**
   * User can be called with an argument that includes email, but it doesn't
   * have to be. If the user is already on the context, it will use that user
   * instead
   */
  async findOrCreateUser({ email: emailArg } = {}) {
    const email =
      this.context && this.context.user ? this.context.user.email : emailArg;
    if (!email || !isEmail.validate(email)) return null;

    const users = await this.store.users.findOrCreate({ where: { email } });
    return users && users[0] ? users[0] : null;
  }

  async markAllCaught({ pokemonIds }) {
    const userId = this.context.user.id;
    if (!userId) return;

    let results = [];

    // for each pokemon id, try to mark as caught and add it to the results array
    // if successful
    for (const pokemonId of pokemonIds) {
      const res = await this.markCaught({ pokemonId });
      if (res) results.push(res);
    }

    return results;
  }

  async markCaught({ pokemonId }) {
    const userId = this.context.user.id;
    const res = await this.store.catches.findOrCreate({
      where: { userId, pokemonId },
    });
    return res && res.length ? res[0].get() : false;
  }

  async unmarkCaught({ pokemonId }) {
    const userId = this.context.user.id;
    return !!this.store.catches.destroy({ where: { userId, pokemonId } });
  }

  async getPokemonIdsByUser() {
    const userId = this.context.user.id;
    const found = await this.store.catches.findAll({
      where: { userId },
    });
    return found && found.length
      ? found.map(l => l.dataValues.pokemonId).filter(l => !!l)
      : [];
  }

  async hasCaught({ pokemonId }) {
    if (!this.context || !this.context.user) return false;
    const userId = this.context.user.id;
    const found = await this.store.catches.findAll({
      where: { userId, pokemonId },
    });
    return found && found.length > 0;
  }
}

module.exports = UserAPI;
