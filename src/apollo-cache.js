export const apolloInMemoryCache = {
  typePolicies: {
    Query: {
      fields: {
        accountGet: {
          merge(existing, incoming) {
            return incoming;
          },
        },
        creativesGet: {
          merge(existing, incoming) {
            return incoming;
          },
        },
        connectionsGet: {
          merge(existing, incoming) {
            return incoming;
          },
        },
      },
    },
    Connection: {
      fields: {
        funnelTags: {
          merge(existing, incoming) {
            return incoming;
          },
        },
        subjectiveScores: {
          merge(existing, incoming) {
            return incoming;
          },
        },
        tags: {
          merge(existing, incoming) {
            return incoming;
          },
        },
      },
    },
    EvaluationTemplate: {
      fields: {
        sections: {
          merge(existing, incoming) {
            return incoming;
          },
        },
      },
    },
    TagGroup: {
      fields: {
        tags: {
          merge(existing, incoming) {
            return incoming;
          },
        },
      },
    },
    FunnelGroup: {
      fields: {
        funnelTags: {
          merge(existing, incoming) {
            return incoming;
          },
        },
      },
    },
    Account: {
      fields: {
        tagGroups: {
          merge(existing, incoming) {
            return incoming;
          },
        },
      },
    },
    Group: {
      fields: {
        startups: {
          merge(existing, incoming) {
            return incoming;
          },
        },
      },
    },
  },
};
