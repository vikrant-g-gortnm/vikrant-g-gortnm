import gql from "graphql-tag";

export default gql`
  fragment grouplogItemFragments on GroupLogItem {
    id
    groupId
    creativeId
    createdAt
    updatedAt
    logType
    dataPairs {
      key
      val
    }
    createdBy
    createdByUser {
      email
      given_name
      family_name
    }
  }
`;
