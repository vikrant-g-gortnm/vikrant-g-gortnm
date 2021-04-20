import gql from "graphql-tag";

export default gql`
  fragment presentationFields on Presentation {
    id
    creativeId
    email
    sharedBy
    createdAt
    opened
    seen
    message
    tags
    creativeDetails {
      name
      description
      location
      contactPerson
      externalLinks {
        key
        val
      }
      seeking {
        key
        val
      }
      valuation {
        key
        val
      }
      sections {
        name
        index
        answers {
          id
          index
          inputType
          questionId
          questionName
          sectionId
          sectionName
          sid
          val
          pageMeta {
            title
            image
            provider
            url
          }
        }
      }
    }
  }
`;
