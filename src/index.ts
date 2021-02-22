import * as express from "express";
import * as ApolloGraphQL from "apollo-server-express";
import Stream from "./stream/stream";

// Construct a schema, using GraphQL schema language
const typeDefs = ApolloGraphQL.gql`
  type Query {
    stream: String
    media(mediaId:String!):String
  }
`;
// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    stream: async (_sources, _args, { dataSources }) => {
      return dataSources.streamAPI.getStreams();
    },
    media: async (_sources, _args, { dataSources }) => {
      return dataSources.streamAPI.getMedia(_args.mediaId);
    },
  },
};

const server = new ApolloGraphQL.ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => {
    return {
      streamAPI: new Stream(),
    };
  },
});

const app = express();
server.applyMiddleware({ app });

app.listen({ port: 4245 }, () => {
  console.log(`🚀 Server ready at http://localhost:4245${server.graphqlPath}`);
});
