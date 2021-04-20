import gql from "graphql-tag";

export default gql`
  fragment evaluationFields on Evaluation {
    id
    name
    description
    createdAt
    updatedAt
    createdBy
    templateId
    templateName

    answers {
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
`;
