import gql from "graphql-tag";

import {
  evaluationTemplateFragments,
  evaluationTemplateSectionFragments,
  evaluationTemplateQuestionFragments,
} from "Apollo/Fragments";

export default gql`
  query evaluationTemplateGet($id: ID!) {
    evaluationTemplateGet(id: $id) {
      ...evaluationTemplateFields
      sections {
        ...evaluationTemplateSectionFields
        questions {
          ...evaluationTemplateQuestionFields
        }
      }
    }
  }
  ${evaluationTemplateFragments}
  ${evaluationTemplateSectionFragments}
  ${evaluationTemplateQuestionFragments}
`;
