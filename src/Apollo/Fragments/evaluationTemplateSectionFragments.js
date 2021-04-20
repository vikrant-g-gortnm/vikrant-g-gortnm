import gql from "graphql-tag";

export default gql`
  fragment evaluationTemplateSectionFields on EvaluationTemplateSection {
    id
    createdAt
    updatedAt
    createdBy
    name
    description
  }
`;
