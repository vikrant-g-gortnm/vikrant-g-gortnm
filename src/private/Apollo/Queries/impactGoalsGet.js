import gql from "graphql-tag";

export default gql`
  query impactGoalsGet($id: ID!) {
    impactGoalsGet(id: $id) {
      id
      goals {
        key
        val
      }
    }
  }
`;
