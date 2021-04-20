import gql from "graphql-tag";

export default gql`
  fragment pageScraperFields on PageScraper {
    title
    desciption
    address
    urls_twitter
    urls_youtube
    urls_linkedin
    urls_facebook
    profiles {
      email
      firstName
      lastName
      role
      nameScore
      roleScore
    }
    checkedNoLinks
    processingTime
  }
`;
