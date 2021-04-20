import gql from "graphql-tag";

export default gql`
  mutation funnelGroupDelete($id: ID!) {
    funnelGroupDelete(id: $id) {
      message
    }
  }
`;
