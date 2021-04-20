import gql from "graphql-tag";

export default gql`
  fragment tagGroupFields on TagGroup {
    id
    name
    description
    createdBy
    createdAt
    updatedAt
    index
  }
`;
