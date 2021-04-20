import gql from "graphql-tag";

import {
  tagFragments,
  funnelTagFragments,
  creativeFragments,
  connectionFragments,
  evaluationFragments,
  evaluationTemplateFragments,
} from "Apollo/Fragments";

export default gql`
  query connectionGet($id: ID!) {
    connectionGet(id: $id) {
      ...connectionFields

      publicEvaluations {
        id
        name
        email
        family_name
        given_name
        description
        createdAt
        updatedAt
        templateId
        answers {
          id
          inputType
          sectionId
          sectionName
          questionId
          questionName
          sid
          val
        }
        summary {
          templateName
          sections {
            name
            score
            possibleScore
            scorePerAnswer {
              score
              possibleScore
              questionId
              questionName
              sectionId
              sectionName
            }
          }
          totalScore
          possibleScore
        }
      }

      sharedWithMe {
        sharedBy
        createdAt
        groupName
        groupId

        comments
        evaluations
        subjective_score
        tags

        connection {
          subjectiveScores {
            score
            createdByUser {
              email
              family_name
              given_name
            }
          }

          evaluations {
            id
            name
            description
            createdAt
            updatedAt
            createdBy
            templateId
            answers {
              inputType
              sectionId
              sectionName
              questionId
              questionName
              sid
              val
            }
            createdByUser {
              email
              given_name
              family_name
            }
            summary {
              templateName
              sections {
                name
                score
                possibleScore
                scorePerAnswer {
                  score
                  possibleScore
                  questionId
                  questionName
                  sectionId
                  sectionName
                }
              }
              totalScore
              possibleScore
            }
          }
        }
      }

      creative {
        ...creativeFields
      }

      tags {
        ...tagFields
      }

      funnelTags {
        ...funnelTagFields
      }

      evaluations {
        ...evaluationFields
        template {
          ...evaluationTemplateFields
        }
      }
    }
  }
  ${tagFragments}
  ${funnelTagFragments}
  ${creativeFragments}
  ${connectionFragments}
  ${evaluationFragments}
  ${evaluationTemplateFragments}
`;
