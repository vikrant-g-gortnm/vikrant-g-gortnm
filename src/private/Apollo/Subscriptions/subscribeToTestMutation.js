import gql from "graphql-tag";

export default gql`
  subscription {
    subscribeToTestMutation {
      id
      val
    }
  }
`;
