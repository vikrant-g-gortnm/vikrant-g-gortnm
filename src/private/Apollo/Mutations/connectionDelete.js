import gql from "graphql-tag";

export default gql`
  mutation connectionDelete($id: ID) {
    connectionDelete(id: $id) {
      message
    }
  }
`;
