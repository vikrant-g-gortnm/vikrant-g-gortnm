import gql from "graphql-tag";

import {
  evaluationTemplateFragments,
  evaluationTemplateSectionFragments,
  evaluationTemplateQuestionFragments,
} from "Apollo/Fragments";

export default gql`
  query evaluationTemplatesGet {
    accountGet {
      evaluationTemplates {
        ...evaluationTemplateFields

        sections {
          ...evaluationTemplateSectionFields

          questions {
            ...evaluationTemplateQuestionFields
          }
        }
      }

      evaluationTemplateQuestions {
        ...evaluationTemplateQuestionFields
      }
    }
  }
  ${evaluationTemplateFragments}
  ${evaluationTemplateSectionFragments}
  ${evaluationTemplateQuestionFragments}
`;
