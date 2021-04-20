import gql from "graphql-tag";

export default gql`
  mutation logDelete($id: ID!) {
    logDelete(id: $id) {
      message
    }
  }
`;
