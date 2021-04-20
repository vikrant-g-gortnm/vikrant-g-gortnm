import gql from "graphql-tag";

export default gql`
  mutation userInvitationResponse($accountId: ID!, $response: AcceptReject!) {
    userInvitationResponse(accountId: $accountId, response: $response) {
      message
    }
  }
`;
