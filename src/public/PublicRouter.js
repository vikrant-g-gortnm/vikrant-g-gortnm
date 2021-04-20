import React from "react";
import { Switch, withRouter } from "react-router-dom";
import { Route } from "react-router";

// ROUTES
import {
  public_creative,
  demo_page,
  public_pages,
  product_demo,
  public_presentation,
  public_evaluation,
  oia_demo_page,
} from "../definitions";

import { ProductDemo } from "./pages/DemoPages/ProductDemo/ProductDemo";
import { DemoPage } from "./pages/DemoPages/DemoPage/DemoPage";
import { OIADemoPage } from "./pages/DemoPages/OIA_DemoPage/OIA_DemoPage";

import { PublicCreative as ExternalForm } from "./pages/ExternalForm/PublicCreative/PublicCreative";
import { PublicPresentationPage } from "./pages/PublicPresentationPage/PublicPresentationPage";
import { PublicCompanyInfo } from "./pages/PublicPresentationPage/PublicCompanyInfo";
import { EvaluationPage } from "./pages/EvaluationPage/EvaluationPage";

export const RouterComponent = ({ history }) => {
  return (
    <Switch>
      <Route exact path={demo_page} component={DemoPage} />
      <Route exact path={oia_demo_page} component={OIADemoPage} />
      <Route exact path={product_demo} component={ProductDemo} />

      <Route
        exact
        path={`${public_presentation}/:id/:email`}
        component={PublicPresentationPage}
      />

      <Route
        exact
        path={`${public_presentation}/:id`}
        component={PublicCompanyInfo}
      />

      <Route
        exact
        path={`${public_evaluation}/:connectionId/:creativeId/:templateId`}
        component={EvaluationPage}
      />

      <Route
        exact
        path={[
          `${public_creative}/:accountId/:id`,
          `${public_pages}/:accountId/form.html`,
        ]}
        component={ExternalForm}
      />
      <Route render={() => <div>404</div>} />
    </Switch>
  );
};

const WrapperComponent = ({ ...props }) => {
  return (
    <div className="public_shared_page_content">
      <RouterComponent {...props} />
    </div>
  );
};

export const PublicRouter = withRouter(WrapperComponent);
