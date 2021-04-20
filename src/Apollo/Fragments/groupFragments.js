import gql from "graphql-tag";

export default gql`
  fragment groupFields on Group {
    id
    name
    description
    createdAt
    updatedAt
    createdBy
    createdByUser {
      email
      given_name
      family_name
    }
    members {
      email
      role
      joinedDate
      latestActivity
    }
    settings {
      chat
      public
      showUsers
      showScores
      showSummaries
      addStartup
      addUser
    }
  }
`;
