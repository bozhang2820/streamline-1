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

import {
  observable
} from 'mobx';
import {unknownAccessCode} from './utils/Constants';

class app_state {
  @observable sidebar_isCollapsed = true
  @observable sidebar_activeKey = ''
  @observable sidebar_toggleFlag = false
  @observable streamline_config = {
    registry: {},
    dashboard: {},
    secureMode: false,
    version: ''
  }
  @observable showComponentNodeContainer = true
  @observable showSpotlightSearch = false
  @observable user_profile = {}
  @observable roleInfo = []
  @observable unKnownUser = unknownAccessCode.loggedIn
  @observable versionPanelCollapsed = true
  @observable zoomScale = 0.8
  engines = []
  enginesMetricsTemplates = []
}

export default new app_state();
