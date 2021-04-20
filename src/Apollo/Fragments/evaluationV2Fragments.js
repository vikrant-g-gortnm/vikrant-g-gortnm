import gql from "graphql-tag";

export default gql`
  fragment evaluationV2Fields on Evaluation {
    id
    name
    description
    createdAt
    updatedAt
    createdBy
    templateId
    answers {
      inputType
      questionId
      sectionId
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
        }
      }
      totalScore
      possibleScore
    }
  }
`;
