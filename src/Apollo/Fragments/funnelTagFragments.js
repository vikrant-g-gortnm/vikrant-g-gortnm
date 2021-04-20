import gql from "graphql-tag";

export default gql`
  fragment funnelTagFields on FunnelTag {
    id
    funnelGroupId
    name
    description
    createdBy
    createdAt
    index
    group {
      id
      name
    }
  }
`;
