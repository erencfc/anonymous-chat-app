const { createServer, createPubSub } = require("graphql-yoga");

require("./db")();

const Message = require("./models/Message");

const typeDefs = `
    type Message {
        id: ID!
        user: String!
        text: String!
    }

    type Query {
        messages: [Message!]
    }

    type Mutation {
        newMessage(user: String!, text: String!): Message!
    }

    type Subscription {
        messageAdded: Message!
    }
`;

const pubsub = createPubSub();

const resolvers = {
    Message: {
        id: (parent) => parent._id,
        user: (parent) => parent.user,
        text: (parent) => parent.text,
    },
    Query: {
        messages: async () => await Message.find({}),
    },
    Mutation: {
        newMessage: async (_, { user, text }) => {
            const message = new Message({
                user,
                text,
            });
            await message.save();
            pubsub.publish("newMessage", message);
            return message;
        },
    },
    Subscription: {
        messageAdded: {
            subscribe: () => {
                return pubsub.subscribe("newMessage");
            },
            resolve: (payload) => payload,
        },
    },
};

const server = createServer({
    schema: {
        typeDefs,
        resolvers,
    },
});

server.start();
