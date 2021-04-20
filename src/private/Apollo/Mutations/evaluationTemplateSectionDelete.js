import gql from "graphql-tag";

export default gql`
  mutation evaluationTemplateSectionDelete($id: ID!) {
    evaluationTemplateSectionDelete(id: $id) {
      message
    }
  }
`;
