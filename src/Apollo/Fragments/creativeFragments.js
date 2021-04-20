import gql from "graphql-tag";

export default gql`
  fragment creativeFields on Creative {
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
      #      id
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
`;
