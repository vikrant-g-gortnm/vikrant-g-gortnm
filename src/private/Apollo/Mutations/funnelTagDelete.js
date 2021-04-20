import gql from "graphql-tag";

export default gql`
  mutation funnelTagDelete($id: ID!) {
    funnelTagDelete(id: $id) {
      message
    }
  }
`;
