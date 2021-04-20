import gql from "graphql-tag";

export default gql`
  query groupGet($id: ID!, $connectionId: ID) {
    groupGet(id: $id, connectionId: $connectionId) {
      id
      name
      createdAt
      updatedAt
      createdByUser {
        email
        given_name
        family_name
      }
      members {
        email
        role
        joinedDate
        latestActivity
      }
      settings {
        chat
        public
        showUsers
        showScores
        showSummaries
        addStartup
        addUser
      }

      evaluationTemplates {
        id
        name
        description
        sections {
          id
          name
        }
      }

      startups {
        connectionId
        creativeId
        sharedBy
        createdAt
        comments
        evaluations
        subjective_score
        tags
        seen
        connection {
          id
          accountId
          subjectiveScores {
            score
            createdAt
            createdByUser {
              email
              given_name
              family_name
            }
          }

          creative {
            id
            name
            templateId
            answers {
              id
              inputType
              questionId
              questionName
              sid
              val
            }
          }

          evaluations {
            id
            name
            createdAt
            updatedAt
            templateId
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
                  question
                }
              }
              totalScore
              possibleScore
            }
          }
        }
      }
    }
  }
`;
