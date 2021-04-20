import gql from "graphql-tag";

export default gql`
  mutation accountInvite($email: String) {
    accountInvite(email: $email) {
      email
      accountId
      createdAt
      createdBy
    }
  }
`;
