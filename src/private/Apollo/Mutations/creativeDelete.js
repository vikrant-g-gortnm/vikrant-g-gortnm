import gql from "graphql-tag";

export default gql`
  mutation creativeDelete($id: ID!) {
    creativeDelete(id: $id) {
      message
    }
  }
`;
