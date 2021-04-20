import gql from "graphql-tag";

export default gql`
  fragment funnelGroupFields on FunnelGroup {
    id
    name
    description
    createdBy
    createdAt
    updatedAt
    index
  }
`;
