import gql from "graphql-tag";

export default gql`
  fragment connectionExtendedFields on Connection {
    id
    name
    description
    createdAt
    updatedAt
    createdBy
    starred
    createdByUser {
      email
      given_name
      family_name
    }
    accountId
    creativeId
    subjectiveScores {
      score
      createdAt
      createdBy
      createdByUser {
        email
        given_name
        family_name
      }
    }

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
        questionId
        sectionId
        questionName
        sectionName
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
            id
            inputType
            questionId
            sectionId
            questionName
            sectionName
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
      id
      name
      accountId
      description
      templateId
      createdAt
      sharedWithEmail
      sharedByEmail
      submit
      answers {
        id
        index
        inputType
        sectionId
        sectionName
        questionId
        questionName
        sid
        val
        pageMeta {
          title
          url
          image
          provider
        }
      }
    }

    tags {
      id
      tagGroupId
      name
      description
      createdBy
      createdAt
      index
    }

    funnelTags {
      id
      funnelGroupId
      name
      description
      createdBy
      createdAt
      index
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
        id
        inputType
        questionId
        sectionId
        questionName
        sectionName
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
          sectionId
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
`;
