import gql from "graphql-tag";

export default gql`
  query connectionsGet($filters: ConnectionFilters, $LastEvaluatedId: String) {
    connectionsGet(filters: $filters, LastEvaluatedId: $LastEvaluatedId) {
      id
      name
      createdAt
      updatedAt
      starred
      creativeId

      subjectiveScores {
        createdBy
        createdAt
        score
      }

      creative {
        id
        name
      }

      tags {
        tagGroupId
        id
        name
        group {
          id
          name
        }
      }

      funnelTags {
        id
        funnelGroupId
        name
        index
      }
    }
  }
`;
