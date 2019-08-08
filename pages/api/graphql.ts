import { ApolloServer, gql } from 'apollo-server-micro';

const rootSchema = gql`
  type Cat {
    species: String!
    fluffy: Boolean!
    nice: Boolean!
    age: Int!
  }

  type Query {
    cat: String
    cats: [Cat]!
  }

  schema {
    query: Query
  }
`;

const resolvers = {
  Query: {
    cat: () => {
      return 'Hi There';
    },
  },
};

const server = new ApolloServer({
  typeDefs: [rootSchema],
  resolvers,
  context({ req }) {
    // use the authenticate function from utils to auth req, its Async!
    return { user: null };
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default server.createHandler({ path: '/api/graphql' });
