import gql from "graphql-tag";

export default gql`
  fragment logItemFields on LogItem {
    id
    createdBy
    accountId
    connectionId
    createdAt
    updatedAt
    logType
    reference {
      key
      val
    }
    dataPairs {
      key
      val
    }
    notifyUsers
    seenBy
    createdByUser {
      email
      given_name
      family_name
    }
  }
`;
