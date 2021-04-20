import gql from "graphql-tag";

export default gql`
  fragment pageMetaFields on PageMeta {
    title
    image
    provider
    url
  }
`;
