// Changed By : Siva
// Date : 2/04/2021

import React, { useEffect, useState } from "react";
import qp from "utils/queryParams";

export const LinkBridge = props => {
  const [link, setLink] = useState(null);

  useEffect(() => {
    if (props.location.search) {
      let { linkValue } = qp(props.location.search);
      setLink(linkValue ? linkValue[0] : null);
      window.location.href = linkValue ? linkValue[0] : link;
    } else {
      console.log("error");
    }
  }, []);

  return !link ? <div>nothing to do, duh...</div> : "";
};
