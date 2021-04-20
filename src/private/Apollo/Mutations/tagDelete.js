import gql from "graphql-tag";

export default gql`
  mutation tagDelete($id: ID!) {
    tagDelete(id: $id) {
      message
    }
  }
`;
