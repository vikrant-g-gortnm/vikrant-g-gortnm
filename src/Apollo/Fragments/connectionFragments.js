import gql from "graphql-tag";

export default gql`
  fragment connectionFields on Connection {
    id
    name
    description
    createdAt
    updatedAt
    createdBy
    starred
    createdByUser {
      email
      given_name
      family_name
    }
    accountId
    creativeId
    subjectiveScores {
      score
      createdAt
      createdBy
      createdByUser {
        email
        given_name
        family_name
      }
    }
  }
`;
