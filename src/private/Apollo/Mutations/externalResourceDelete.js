import gql from "graphql-tag";

export default gql`
  mutation externalResourceDelete($id: ID!) {
    externalResourceDelete(id: $id) {
      message
    }
  }
`;
