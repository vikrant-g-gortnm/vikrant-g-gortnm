import gql from "graphql-tag";

export default gql`
  query externalResourcesGet($connectionId: ID) {
    externalResourcesGet(connectionId: $connectionId) {
      id
      connectionId
      createdAt
      createdBy
      url
      label
      iconClass
    }
  }
`;
