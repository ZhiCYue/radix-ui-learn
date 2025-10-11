import React, { Suspense, lazy } from 'react';
import { HashRouter, Route, Redirect as Navigate} from "react-router-dom";

import ComponentLink from './ComponentLink';
import './App.css';

// 懒加载组件
const CreateContextCase = lazy(() => import("./examples/create-context"));
const SlotCase = lazy(() => import("./examples/slot"));
const UseControllableStateCase = lazy(() => import("./examples/use-controllable-state"));
const UseControllableStateReducerCase = lazy(() => import("./examples/use-controllable-state-reducer"));
const DialogCase = lazy(() => import("./examples/dialog"));
const DismissableLayerCase = lazy(() => import("./examples/dismissable-layer"));
const JsxTestCase = lazy(() => import("./examples/jsx-test/comparison"));
const ReactRemoveScrollCase = lazy(() => import("./examples/react-remove-scroll"));
const UseToastCase = lazy(() => import("./examples/use-toast"));
const GooberCase = lazy(() => import("./examples/goober"));

// 加载中组件
const LoadingSpinner: React.FC = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px',
    fontSize: '16px',
    color: '#666'
  }}>
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    }}>
      <div style={{
        width: '20px',
        height: '20px',
        border: '2px solid #f3f3f3',
        borderTop: '2px solid #007bff',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
      正在加载示例...
    </div>
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

const COMPONENT_EXAMPLES_MAP = {
  '/examples/createContextCase': CreateContextCase,
  '/examples/slotCase': SlotCase,
  '/examples/dialogCase': DialogCase,
  '/examples/dismissableLayerCase': DismissableLayerCase,
  '/examples/jsxTestCase': JsxTestCase,
  '/examples/useControllableStateCase': UseControllableStateCase,
  '/examples/useControllableStateReducerCase': UseControllableStateReducerCase,
  '/examples/reactRemoveScrollCase': ReactRemoveScrollCase,
  '/examples/useToastCase': UseToastCase,
  '/examples/gooberCase': GooberCase,
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
        <ComponentLink to="/examples/dismissableLayerCase">DismissableLayer</ComponentLink>
        <ComponentLink to="/examples/jsxTestCase">JSX 转换测试</ComponentLink>
        <ComponentLink to="/examples/useControllableStateCase">ControllableState</ComponentLink>
        <ComponentLink to="/examples/useControllableStateReducerCase">ControllableStateReducer</ComponentLink>
        <ComponentLink to="/examples/reactRemoveScrollCase">React Remove Scroll</ComponentLink>
        <ComponentLink to="/examples/useToastCase">Use Toast</ComponentLink>
        <ComponentLink to="/examples/gooberCase">goober</ComponentLink>
      </div>
      <div className={'component-examples'}>
        <Suspense fallback={<LoadingSpinner />}>
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
        </Suspense>
      </div>
    </HashRouter>
  </>;
};

export default App;
