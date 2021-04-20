// Changed By : Siva
// Date : 2/04/2021

import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";

export const ScrollToTop = props => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [props.location]);

  return props.children;
};

export default withRouter(ScrollToTop);
