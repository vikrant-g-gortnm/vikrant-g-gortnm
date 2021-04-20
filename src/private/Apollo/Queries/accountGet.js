import gql from "graphql-tag";

import {
  accountFragments,
  accountMemberFragments,
  evaluationTemplateFragments,
  evaluationTemplateSectionFragments,
  evaluationTemplateQuestionFragments,
  tagGroupFragments,
  tagFragments,
  funnelGroupFragments,
  funnelTagFragments,
} from "Apollo/Fragments";

export default gql`
  query accountGet {
    accountGet {
      ...accountFields

      members {
        ...accountMemberFields
      }

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

      tagGroupsGet {
        ...tagGroupFields
        tags {
          ...tagFields
        }
      }

      funnelGroups {
        ...funnelGroupFields
        funnelTags {
          ...funnelTagFields
        }
      }
    }
  }
  ${accountFragments}
  ${accountMemberFragments}
  ${evaluationTemplateFragments}
  ${evaluationTemplateSectionFragments}
  ${evaluationTemplateQuestionFragments}
  ${tagGroupFragments}
  ${tagFragments}
  ${funnelGroupFragments}
  ${funnelTagFragments}
`;
