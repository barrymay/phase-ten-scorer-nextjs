const { ApolloServer, gql } = require('apollo-server-micro');

const typeDefs = gql`
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: (root, args, context) => {
      return 'Hello world!';
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
});

module.exports = server.createHandler({ path: '/api' });
