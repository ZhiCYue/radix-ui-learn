import React from 'react';
import { HashRouter, Route, Redirect as Navigate} from "react-router-dom";

import ComponentLink from './ComponentLink';
import createContextCase from "./examples/create-context";
import slotCase from "./examples/slot";
import directionCase from "./examples/direction";
import dialogCase from "./examples/dialog";

import './App.css';

const COMPONENT_EXAMPLES_MAP = {
  '/examples/createContextCase': createContextCase,
  '/examples/slotCase': slotCase,
  '/examples/dialogCase': dialogCase,
};

const App = () => {

  return <>
    <HashRouter>
      <div className={'component-list'}>
        <ComponentLink to="/examples/createContextCase">
          create-context
        </ComponentLink>
        <ComponentLink to="/examples/slotCase">Slot</ComponentLink>
        <ComponentLink to="/examples/dialogCase">Dialog</ComponentLink>
      </div>
      <div className={'component-examples'}>
        {Object.keys(COMPONENT_EXAMPLES_MAP).map(route => (
          <Route
            key={route}
            path={route}
            // @ts-expect-error: Indexing with string is safe here because route comes from Object.keys(COMPONENT_EXAMPLES_MAP)
            component={COMPONENT_EXAMPLES_MAP[route]}
          />
        ))}
        <Route
          exact
          path="/"
          render={() => <Navigate to="/examples/createContextCase" />}
        />
      </div>
    </HashRouter>
  </>;
};

export default App;
