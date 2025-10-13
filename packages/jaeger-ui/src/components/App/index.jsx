// Copyright (c) 2017 Uber Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Route, Redirect, Switch, BrowserRouter } from 'react-router-dom';

import { ConfigProvider } from 'antd';
import { defaultTheme } from '@ant-design/compatible';
import NotFound from './NotFound';
import Page from './Page';
import DependencyGraph from '../DependencyGraph';
import { ROUTE_PATH as dependenciesPath } from '../DependencyGraph/url';
import DeepDependencies from '../DeepDependencies';
import { ROUTE_PATH as deepDependenciesPath } from '../DeepDependencies/url';
import QualityMetrics from '../QualityMetrics';
import { ROUTE_PATH as qualityMetricsPath } from '../QualityMetrics/url';
import SearchTracePage from '../SearchTracePage';
import { ROUTE_PATH as searchPath } from '../SearchTracePage/url';
import TraceDiff from '../TraceDiff';
import { ROUTE_PATH as traceDiffPath } from '../TraceDiff/url';
import TracePage from '../TracePage';
import { ROUTE_PATH as tracePath } from '../TracePage/url';
import MonitorATMPage from '../Monitor';
import { ROUTE_PATH as monitorATMPath } from '../Monitor/url';
import JaegerAPI, { DEFAULT_API_ROOT } from '../../api/jaeger';
import processScripts from '../../utils/config/process-scripts';
import prefixUrl from '../../utils/prefix-url';

import '../common/vars.css';
import '../common/utils.css';
import 'antd/dist/reset.css';
import './index.css';
import { store } from '../../utils/configure-store';

const jaegerTheme = {
  token: {
    ...defaultTheme.token,
    colorPrimary: '#FE161E',
    colorBgBase: '#000000',
    colorTextBase: '#ffffff',
    colorBorder: '#4F4D4E',
    colorBgContainer: '#000000',
    colorBgElevated: '#4F4D4E',
    colorBgLayout: '#000000',
    colorLink: '#FE161E',
    colorLinkHover: '#ff4449',
    colorLinkActive: '#d11218',
  },
  components: {
    ...defaultTheme.components,
    Layout: {
      ...defaultTheme.components.Layout,
      bodyBg: '#000000',
      headerBg: '#000000',
      footerBg: '#000000',
      headerHeight: 48,
      headerPadding: '0 50',
      footerPadding: '24 50',
      siderBg: '#000000',
      triggerHeight: 48,
      triggerBg: '#4F4D4E',
      zeroTriggerWidth: 36,
      zeroTriggerHeight: 42,
    },
    Menu: {
      ...defaultTheme.components.Menu,
      darkItemBg: '#000000',
      darkItemSelectedBg: '#FE161E',
      darkItemHoverBg: '#4F4D4E',
      itemBg: '#000000',
      itemSelectedBg: '#FE161E',
      itemHoverBg: '#4F4D4E',
      itemActiveBg: '#FE161E',
    },
    Table: {
      ...defaultTheme.components.Table,
      headerBg: '#4F4D4E',
      rowHoverBg: '#4F4D4E',
      bodySortBg: '#000000',
      headerSortActiveBg: '#4F4D4E',
    },
    Button: {
      ...defaultTheme.components.Button,
      defaultBg: '#4F4D4E',
      defaultBorderColor: '#9B999A',
      defaultColor: '#ffffff',
      defaultHoverBg: '#9B999A',
      defaultHoverBorderColor: '#9B999A',
      defaultHoverColor: '#ffffff',
    },
    Input: {
      ...defaultTheme.components.Input,
      colorBgContainer: '#313131',
      colorBorder: '#9B999A',
      colorText: '#ffffff',
      colorTextPlaceholder: '#9B999A',
      hoverBorderColor: '#FE161E',
      activeBorderColor: '#FE161E',
    },
    Select: {
      ...defaultTheme.components.Select,
      optionActiveBg: '#4F4D4E',
      optionSelectedBg: '#FE161E',
      selectorBg: '#313131',
    },
    Card: {
      ...defaultTheme.components.Card,
      colorBgContainer: '#000000',
      colorBorderSecondary: '#4F4D4E',
    },
    Alert: {
      ...defaultTheme.components.Alert,
      colorWarning: '#B8860B',
      colorWarningBg: 'rgba(184, 134, 11, 0.1)',
      colorWarningBorder: '#B8860B',
    },
  },
};

export default class JaegerUIApp extends Component {
  constructor(props) {
    super(props);
    JaegerAPI.apiRoot = DEFAULT_API_ROOT;
    processScripts();
  }

  render() {
    const RouterComponent = this.props.Router || BrowserRouter;
    return (
      <ConfigProvider theme={jaegerTheme}>
        <Provider store={store}>
          <RouterComponent {...(this.props.routerProps || {})}>
            <Page>
              <Switch>
                <Route path={searchPath}>
                  <SearchTracePage />
                </Route>
                <Route path={traceDiffPath}>
                  <TraceDiff />
                </Route>
                <Route path={tracePath}>
                  <TracePage />
                </Route>
                <Route path={dependenciesPath}>
                  <DependencyGraph />
                </Route>
                <Route path={deepDependenciesPath}>
                  <DeepDependencies />
                </Route>
                <Route path={qualityMetricsPath}>
                  <QualityMetrics />
                </Route>
                <Route path={monitorATMPath}>
                  <MonitorATMPage />
                </Route>

                <Route exact path="/">
                  <Redirect to={searchPath} />
                </Route>
                <Route exact path={prefixUrl()}>
                  <Redirect to={searchPath} />
                </Route>
                <Route exact path={prefixUrl('/')}>
                  <Redirect to={searchPath} />
                </Route>

                <Route>
                  <NotFound />
                </Route>
              </Switch>
            </Page>
          </RouterComponent>
        </Provider>
      </ConfigProvider>
    );
  }
}
