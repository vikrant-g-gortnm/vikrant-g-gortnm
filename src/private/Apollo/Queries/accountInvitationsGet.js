import gql from "graphql-tag";

export default gql`
  query accountInvitationsGet {
    accountInvitationsGet {
      email
      accountId
      createdAt
      createdBy
    }
  }
`;
