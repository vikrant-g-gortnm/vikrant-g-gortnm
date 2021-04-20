import gql from "graphql-tag";

export default gql`
  subscription {
    subscribeToAllTestMutations {
      id
      val
    }
  }
`;
