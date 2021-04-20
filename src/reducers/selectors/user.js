export const getUserIsLoggedIn = ({ user }) => user.loggedIn;
export const getAttributes = state => state.attributes;
export const getEmailIsVerified = state =>
  state.attributes.length === 0 ||
  state.attributes.some(
    attribute =>
      attribute.Name === "email_verified" && attribute.Value === "true"
  );
