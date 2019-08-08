import { ApolloServer, gql } from 'apollo-server-micro';

const rootSchema = gql`
  type User {
    id: String!
    name: String!
    email: String!
  }

  type Query {
    user: User
    getUser(userId: String): String
  }

  schema {
    query: Query
  }
`;

const resolvers = {
  Query: {
    user: () => {
      return {
        id: 'FooBar',
        name: 'Foo',
        email: 'Foo@Bar.com',
      };
    },
    getUser: (userId: string) => {
      return 'Hi There: ' + userId;
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
