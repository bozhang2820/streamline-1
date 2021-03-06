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

import fetch from 'isomorphic-fetch';

import {
  CustomFetch
} from '../utils/Overrides';

const baseUrl = "/api/v1/catalog/";
const engineBaseURL = "system/engines";

const EngineREST = {
  getAllEngines(options) {
    options = options || {};
    options.method = options.method || 'GET';
    options.credentials = 'same-origin';
    return fetch(baseUrl + engineBaseURL, options)
      .then((response) => {
        return response.json();
      });
  },
  getTemplatesByEngineId(engineId, options) {
    options = options || {};
    options.method = options.method || 'GET';
    options.credentials = 'same-origin';
    return fetch(baseUrl + engineBaseURL+"/"+engineId+"/templates", options)
      .then((response) => {
        return response.json();
      });
  },
  getAllEngineTemplateMetricsBundles(options) {
    options = options || {};
    options.method = options.method || 'GET';
    options.credentials = 'same-origin';
    return fetch(baseUrl + engineBaseURL+"/metrics", options)
      .then((response) => {
        return response.json();
      });
  },
  getAllTemplates(options) {
    options = options || {};
    options.method = options.method || 'GET';
    options.credentials = 'same-origin';
    return fetch(baseUrl + engineBaseURL + "/templates")
      .then((response) => {
        return response.json();
      });
  },
  getEngineTemplateMetricsBundle(engineId, options) {
    options = options || {};
    options.method = options.method || 'GET';
    options.credentials = 'same-origin';
    return fetch(baseUrl + engineBaseURL+"/"+engineId+"/metrics", options)
      .then((response) => {
        return response.json();
      });
  }
};

export default EngineREST;
