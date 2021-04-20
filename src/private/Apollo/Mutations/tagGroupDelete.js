import gql from "graphql-tag";

export default gql`
  mutation tagGroupDelete($id: ID!) {
    tagGroupDelete(id: $id) {
      message
    }
  }
`;
