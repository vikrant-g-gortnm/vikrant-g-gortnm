import gql from "graphql-tag";

export default gql`
  query evaluationTemplateNamesGet {
    accountGet {
      evaluationTemplates {
        id
        name
        description
        sections {
          id
          name
        }
      }
    }
  }
`;
