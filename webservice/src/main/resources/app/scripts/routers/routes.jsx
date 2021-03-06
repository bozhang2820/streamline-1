/**
  * Copyright 2017 Hortonworks.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *   http://www.apache.org/licenses/LICENSE-2.0
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
**/
import React from 'react';
import { Router, Route, hashHistory, browserHistory, IndexRoute } from 'react-router';

import ProjectListContainer from '../containers/Streams/ProjectListing/ProjectListingContainer';
import SharedProjectListContainer from '../containers/Streams/ProjectListing/SharedProjectListingContainer';

import TopologyListContainer from '../containers/Streams/TopologyListing/TopologyListingContainer';
import TopologyViewContainer from '../containers/Streams/TopologyEditor/TopologyViewContainer';
import TopologyEditorContainer from '../containers/Streams/TopologyEditor/TopologyEditorContainer';
// import CustomProcessorContainer from '../containers/Configuration/CustomProcessorContainer';
// import TagsContainer from '../containers/Configuration/TagsContainer';
// import FilesContainer from '../containers/Configuration/FilesContainer';
import state from '../app_state';
import ServicePoolContainer  from '../containers/Service/ServicePoolContainer';
import EnvironmentContainer from '../containers/Environment/EnvironmentContainer';
import ModelRegistryContainer from '../containers/ModelRegistry/ModelRegistryContainer';
import ComponentDefinition from '../containers/Configuration/ComponentDefinition';
import AppResourcesContainer from '../containers/Configuration/AppResourcesContainer';
import UserRolesContainer from '../containers/Configuration/UserRolesContainer';
import LogSearch from '../containers/LogSearch/LogSearch';
import {menuName} from '../utils/Constants';
import {hasModuleAccess} from '../utils/ACLUtils';
import SamplingsComponent from '../containers/Samplings/SamplingsComponent';
import AccessDeniedComponent  from '../components/AccessDeniedComponent';

const onEnter = (nextState, replace, callback) => {
  var sidebarRoute = nextState.routes[1];
  if (sidebarRoute) {
    if (sidebarRoute.name === 'Workflows' || sidebarRoute.name === 'My Projects' || sidebarRoute.name === 'My Workflows'
      || sidebarRoute.name === 'Log Search' || sidebarRoute.name === 'Samplings'){
      state.sidebar_activeKey = 1;
      state.sidebar_toggleFlag = false;
    } else if (sidebarRoute.name === 'Shared Projects') {
      state.sidebar_activeKey = 4;
      state.sidebar_toggleFlag = false;
    } else {
      state.sidebar_activeKey = 3;
      state.sidebar_toggleFlag = false;
    }
  }
  const route = nextState.routes[nextState.routes.length - 1];
  let hasAccess = false;
  if(_.has(route, 'accessMenuName')){
    hasAccess = hasModuleAccess(route.accessMenuName);
  }else{
    hasAccess = true;
  }
  if(!hasAccess){
    replace('/no-access');
  }
  callback();
};

export default (

  <Route path="/" component={null} name="Home" onEnter={onEnter}>
    <IndexRoute name="Workflows" component={TopologyListContainer} onEnter={onEnter} />
    <Route path="projects" accessMenuName={menuName.PROJECT} name="My Projects" onEnter={onEnter}>
      <IndexRoute name="My Projects" component={ProjectListContainer} onEnter={onEnter} />
      <Route path=":projectId/applications" name="My Workflows" onEnter={onEnter}>
        <IndexRoute name="My Workflows" component={TopologyListContainer} onEnter={onEnter} />
        <Route path=":id/view" name="Workflow Editor" accessMenuName={menuName.APPLICATION} accessAction="VIEW" component={TopologyViewContainer} onEnter={onEnter}/>
        <Route path=":id/edit" name="Workflow Editor" accessMenuName={menuName.APPLICATION} accessAction="EDIT" component={TopologyEditorContainer} onEnter={onEnter}/>
      </Route>
    </Route>
    <Route path="shared-projects" name="Shared Projects" onEnter={onEnter}>
      <IndexRoute name="Shared Projects" component={SharedProjectListContainer} onEnter={onEnter} />
      <Route path=":projectId/applications" name="My Workflows" onEnter={onEnter}>
        <IndexRoute name="My Workflows" component={TopologyListContainer} onEnter={onEnter} />
        <Route path=":id/view" name="Workflow Editor" accessMenuName={menuName.APPLICATION} accessAction="VIEW" component={TopologyViewContainer} onEnter={onEnter}/>
        <Route path=":id/edit" name="Workflow Editor" accessMenuName={menuName.APPLICATION} accessAction="EDIT" component={TopologyEditorContainer} onEnter={onEnter}/>
      </Route>
    </Route>
  {/* <Route path="custom-processor" name="Custom Processor" component={CustomProcessorContainer} onEnter={onEnter}/> */}
  {/* <Route path="tags" name="Tags" component={TagsContainer} onEnter={onEnter}/>
  <Route path="files" name="Files" component={FilesContainer} onEnter={onEnter}/> */}
    <Route path="service-pool" name="Service Pool" accessMenuName={menuName.SERVICE_POOL} component={ServicePoolContainer} onEnter={onEnter}/>
    <Route path="environments" name="Environments" accessMenuName={menuName.ENVIRONMENT} component={EnvironmentContainer} onEnter={onEnter}/>
    <Route path="model-registry" name="Model Registry" accessMenuName={menuName.MODEL_REGISTRY} component={ModelRegistryContainer} onEnter={onEnter}/>
    <Route path="component-definition" name="Component Definition" component={ComponentDefinition} onEnter={onEnter}/>
    <Route path="application-resources" name="Application Resources" component={AppResourcesContainer} onEnter={onEnter}/>
    <Route path="authorizer" name="Authorizer" accessMenuName={menuName.AUTHORIZER} component={UserRolesContainer} onEnter={onEnter}/>
    <Route path="logsearch/:id" name="Log Search" component={LogSearch} onEnter={onEnter}/>
    <Route path="sampling/:id" name="Samplings" component={SamplingsComponent} onEnter={onEnter}/>
    <Route path="no-access" name="Unauthorized Access" component={AccessDeniedComponent}/>
  </Route>

);
