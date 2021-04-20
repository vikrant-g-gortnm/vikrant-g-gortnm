import gql from "graphql-tag";

export default gql`
  query userInvitationsGet {
    userInvitationsGet {
      email
      accountId
      createdAt
      createdBy
      createdByUser {
        email
        family_name
        given_name
        company
      }
    }
  }
`;
