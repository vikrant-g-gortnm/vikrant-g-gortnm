import gql from "graphql-tag";

export default gql`
  fragment accountFields on Account {
    id
    name
    description
    createdBy
    createdAt
    updatedAt
  }
`;
