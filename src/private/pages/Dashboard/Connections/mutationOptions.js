const addTag = (tag, connection) => ({
  variables: {
    connectionId: connection.id,
    tagId: tag.id,
  },

  optimisticResponse: {
    __typename: "Mutation",
    connectionTagAdd: {
      ...connection,
      tags: [
        ...connection.tags,
        {
          createdAt: new Date().getTime(),
          index: connection.tags.length,
          createdBy: "tmp",
          id: "tmp-id",
          description: null,
          name: tag.name,
          tagGroupId: tag.tagGroupId,
          __typename: "Tag",
        },
      ],
      __typename: "Connection",
    },
  },
});

const deleteTag = (tag, connection) => ({
  variables: {
    connectionId: connection.id,
    tagId: tag.id,
  },

  optimisticResponse: {
    __typename: "Mutation",
    connectionTagRemove: {
      ...connection,
      tags: [
        ...connection.tags
          .filter(({ id }) => id !== tag.id)
          .map(t => ({
            ...t,
            index: null,
            description: null,
            createdBy: "tmp",
            createdAt: 0,
          })),
      ],
      __typename: "Connection",
    },
  },
});

export default {
  addTag,
  deleteTag,
};
