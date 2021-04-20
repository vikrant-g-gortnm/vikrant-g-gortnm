import gql from "graphql-tag";

export default gql`
  fragment tagFields on Tag {
    id
    tagGroupId
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
