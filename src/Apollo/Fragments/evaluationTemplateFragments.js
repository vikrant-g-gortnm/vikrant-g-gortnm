import gql from "graphql-tag";

export default gql`
  fragment evaluationTemplateFields on EvaluationTemplate {
    id
    name
    description
    createdBy
    createdAt
    updatedAt
    sections {
      id
      createdAt
      updatedAt
      createdBy
      name
      description
    }
  }
`;
