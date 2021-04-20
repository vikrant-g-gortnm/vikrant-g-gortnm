import gql from "graphql-tag";

export default gql`
  query connectionPagesGet {
    connectionPagesGet {
      pageNo
      LastEvaluatedId
    }
  }
`;
