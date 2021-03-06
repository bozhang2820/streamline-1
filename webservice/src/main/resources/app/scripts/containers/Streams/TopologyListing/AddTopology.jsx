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

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import {Select2 as Select} from '../../../utils/SelectUtils';

/* import common utils*/
import TopologyREST from '../../../rest/TopologyREST';
import EnvironmentREST from '../../../rest/EnvironmentREST';
import EngineREST from '../../../rest/EngineREST';
import Utils from '../../../utils/Utils';
import TopologyUtils from '../../../utils/TopologyUtils';
import FSReactToastr from '../../../components/FSReactToastr';
import {toastOpt} from '../../../utils/Constants';
import Form from '../../../libs/form';
import app_state from '../../../app_state';
import {FormGroup, InputGroup, FormControl} from 'react-bootstrap';

/* component import */
import BaseContainer from '../../BaseContainer';
import NoData from '../../../components/NoData';
import CommonNotification from '../../../utils/CommonNotification';

class AddTopology extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topologyName: props.topologyData ? props.topologyData.topology.name : '',
      namespaceId: props.topologyData ? props.topologyData.topology.namespaceId : '',
      namespaceOptions: [],
      engineId: props.topologyData ? props.topologyData.topology.engineId : '',
      templateId: props.topologyData ? props.topologyData.topology.templateId : '',
      validInput: true,
      validSelect: true,
      validEngine: true,
      validTemplate: true,
      formField: {},
      showRequired: true,
      batchOptions: [],
      streamOptions: [],
      templateOptions: [],
      filterStr:'',
      namespacesArr: props.namespacesArr,
      validInputGroup: true
    };
    this.fetchData();
  }

  fetchData = () => {
    let promiseArr = [TopologyREST.getTopologyConfig()];
    if(this.props.topologyData){
      promiseArr.push(EngineREST.getTemplatesByEngineId(this.props.topologyData.topology.engineId));
    }
    Promise.all(promiseArr).then(result => {
      this.allEngineSettings = result[0];
      let stateObj = {};
      //setting all the engines from app_state
      stateObj.batchOptions = app_state.engines.filter((f)=>{return f.type == 'batch';});
      stateObj.streamOptions = app_state.engines.filter((f)=>{return f.type == 'stream';});

      if (this.allEngineSettings.responseMessage !== undefined) {
        FSReactToastr.error(
          <CommonNotification flag="error" content={this.allEngineSettings.responseMessage}/>, '', toastOpt);
      } else {
        if(this.props.topologyData){
          const engineData = this.getEngineDataById(this.props.topologyData.topology.engineId);
          const settings = this.findSettingsByEngineName(engineData.name);
          stateObj.formField = settings.topologyComponentUISpecification;
        }
        stateObj.formField = null;
      }

      if(result[1]){
        if(result[1].responseMessage !== undefined) {
          FSReactToastr.error(
            <CommonNotification flag="error" content={result[1].responseMessage}/>, '', toastOpt);
        } else {
          stateObj.templateOptions = result[1].entities;
        }
      }
      this.setState(stateObj);
    }).catch(err => {
      FSReactToastr.error(
        <CommonNotification flag="error" content={err.message}/>, '', toastOpt);
    });
  }

  validateName() {
    const {topologyName} = this.state;
    let validDataFlag = true;
    if (topologyName.trim().length < 1) {
      validDataFlag = false;
      this.setState({validInput: false});
    } else if (/[^A-Za-z0-9_\-\s]/g.test(topologyName)) {
      validDataFlag = false;
      this.setState({validInput: false});
    } else if (!/[A-Za-z0-9]/g.test(topologyName)) {
      validDataFlag = false;
      this.setState({validInput: false});
    } else {
      validDataFlag = true;
      this.setState({validInput: true});
    }
    return validDataFlag;
  }
  validate() {
    const {topologyName, namespaceId, engineId, templateId} = this.state;
    let validDataFlag = true;
    if (!this.validateName()) {
      validDataFlag = false;
      this.setState({validInput: false});
    } else if(namespaceId === ''){
      validDataFlag = false;
      this.setState({validSelect: false});
    } else if(engineId === ''){
      validDataFlag = false;
      this.setState({validEngine: false});
    } else if(templateId === ''){
      validDataFlag = false;
      this.setState({validTemplate: false});
    } else {
      validDataFlag = true;
      this.setState({validInput: true, validSelect: true, validEngine: true, validTemplate: true, validInputGroup: true});
    }
    return validDataFlag;
  }

  handleSave = (projectId) => {
    if (!this.validate()) {
      return;
    }
    const {topologyName, namespaceId, engineId, templateId} = this.state;
    const {topologyData} = this.props;
    let configData = this.refs.Form.state.FormData;
    configData['topology.namespaceIds'] = JSON.stringify([namespaceId]);
    configData['topology.deploymentMode'] = "CHOSEN_REGION";
    let data = {
      name: topologyName,
      namespaceId: namespaceId,
      engineId: engineId,
      templateId: templateId,
      config: {
        properties: configData
      }
    };
    if(topologyData) {
      data.projectId = projectId;
      return TopologyREST.putTopology(topologyData.topology.id, topologyData.topology.versionId, {body: JSON.stringify(data)});
    } else {
      return TopologyREST.postTopology(projectId, {body: JSON.stringify(data)});
    }
  }
  saveMetadata = (id) => {
    let metaData = {
      topologyId: id,
      data: JSON.stringify({sources: [], processors: [], sinks: []})
    };
    return TopologyREST.postMetaInfo({body: JSON.stringify(metaData)});
  }
  handleOnChange = (e) => {
    this.setState({topologyName: e.target.value.trim()});
    this.validateName();
  }
  handleOnChangeEnvironment = (obj) => {
    if (obj) {
      this.setState({namespaceId: obj.id, validSelect: true});
    } else {
      this.setState({namespaceId: '', validSelect: false});
    }
  }
  syncNamespaces(serviceName){
    let namespaceOptions = [];
    this.props.namespacesArr.map((obj)=>{
      let namespaceObj = obj.mappings.find((o)=>{
        return o.serviceName.toLowerCase() === serviceName.toLowerCase();
      });
      if(namespaceObj){
        namespaceOptions.push(obj.namespace);
      }
    });
    return namespaceOptions;
  }
  handleOnChangeEngine = (obj) => {
    if (obj) {
      EngineREST.getTemplatesByEngineId(obj.id).then(templates=>{
        const engineData = this.getEngineDataById(obj.id);
        const settings = this.findSettingsByEngineName(engineData.name);
        const namespaceOptions = this.syncNamespaces(engineData.name);
        this.setState({
          engineId: obj.id,
          validEngine: true,
          templateOptions: templates.entities,
          templateId: templates.entities[0].id,
          validTemplate: true,
          formField: settings.topologyComponentUISpecification,
          namespaceOptions: namespaceOptions,
          namespaceId: ''
        });
      });
    } else {
      this.setState({
        engineId: '',
        validEngine: false,
        templateOptions: [],
        templateId: '',
        validTemplate: false,
        formField: null,
        namespaceOptions: [],
        namespaceId: '',
        validSelect: false
      });
    }
  }
  getEngineDataById(id){
    return app_state.engines.find((e)=>{
      return e.id === id;
    });
  }
  findSettingsByEngineName(name){
    return this.allEngineSettings.entities.find((e)=>{
      return e.engine === name;
    });
  }
  handleOnChangeTemplate = (obj) => {
    if (obj) {
      this.setState({templateId: obj.id, validTemplate: true});
    } else {
      this.setState({templateId: '', validTemplate: false});
    }
  }
  handleDescriptionChange = (event) => {
    this.setState({description: event.target.value});
  }
  onFilterChange = (e) => {
    const val = e.target.value;
    this.setState({filterStr: val});
  }

  render() {
    const {
      formField,
      validInput,
      showRequired,
      topologyName,
      namespaceId,
      namespaceOptions,
      validSelect,
      engineId,
      batchOptions,
      streamOptions,
      validEngine,
      templateId,
      templateOptions,
      validTemplate,
      description,
      filterStr,
      validInputGroup
    } = this.state;
    const formData = {};
    let fields = formField ? Utils.genFields(formField.fields || [], [], formData) : null;

    const filteredTemplates = _.filter(templateOptions, (t) => {
      return Utils.matchStr(t.name, filterStr) || Utils.matchStr(t.description, filterStr);
    });

    return (
      <div className="modal-form">
        <div className="form-group">
          <label data-stest="nameLabel">Name
            <span className="text-danger">*</span>
          </label>
          <div>
            <input type="text" ref={(ref) => this.nameRef = ref} name="topologyName" defaultValue={topologyName} placeholder="Workflow name" required="true" className={validInput
              ? "form-control"
              : "form-control invalidInput"} onKeyUp={this.handleOnChange} autoFocus="true" disabled={!!this.props.topologyData} />
          </div>
        </div>
        <div className="form-group">
          <label data-stest="projectDescriptionLabel">Description<span className="optional">(optional)</span>
          </label>
          <div>
            <textarea data-stest="description" type="text" value={description}
              className={"form-control"} onChange={this.handleDescriptionChange}
              placeholder="Description" maxLength="1000"
            />
          </div>
        </div>
        <hr />
        <div className="form-group m-b-xs">
          <label data-stest="selectEnvLabel">Choose the Engine to run on
            <span className="text-danger">*</span>
          </label>
        </div>
        <div className="row m-b-xs">
          <label className="col-sm-2 engine-type">Batch:</label>
          <div className="col-sm-6">
            {_.map(batchOptions, (e) => {
              if(e.enabled){
                return <span className="radio-container" onClick={() => this.handleOnChangeEngine(e)} key={e.id}>
                  <input type="radio" name="engine" checked={engineId == e.id}/>
                  <label>{e.displayName}</label>
                </span>;
              } else {
                return null;
              }
            })}
          </div>
        </div>
        <div className="row m-b-lg">
          <label className="col-sm-2 engine-type">Streaming:</label>
          <div className="col-sm-6">
            {_.map(streamOptions, (e) => {
              if(e.enabled){
                return <span className="radio-container" onClick={() => this.handleOnChangeEngine(e)} key={e.id}>
                  <input type="radio" name="engine" checked={engineId == e.id}/>
                  <label>{e.displayName}</label>
                </span>;
              } else {
                return null;
              }
            })}
          </div>
        </div>
        {engineId ?
          <div>
            <div className="form-group">
              <label data-stest="selectEnvLabel">Workflow Templates
                <span className="text-danger">*</span>
              </label>
              <FormGroup className="search-box">
                <InputGroup>
                  <InputGroup.Addon>
                    <i className="fa fa-search"></i>
                  </InputGroup.Addon>
                  <FormControl data-stest="searchBox" type="text" placeholder="Search..." onKeyUp={this.onFilterChange} className="" />
                </InputGroup>
              </FormGroup>
              <div className="row templates-container">{filteredTemplates.length ?
                _.map(filteredTemplates, (t) => {
                  return <div className={`col-md-6`} onClick={() => this.handleOnChangeTemplate(t)} key={t.name}>
                    <div className={`template-box ${templateId == t.id ? 'selected-template' : ''}`}>
                      <h4 className="name">{t.name}</h4>
                      <p className="description">{t.description}</p>
                    </div>
                  </div>;
                })
                :
                <div className="text-center">No Template Found!</div>
              }
              </div>
            </div>
            <hr />
            <div className="form-group">
              <label data-stest="selectEnvLabel">Choose the Regions
                <span className="text-danger">*</span>
              </label>
              <div className="m-t-xs">{namespaceOptions.length ?
                _.map(namespaceOptions, (n) => {
                  return <span className="radio-container" onClick={() => this.handleOnChangeEnvironment(n)} key={n.name}>
                    <input type="radio" name="environment" checked={namespaceId == n.id}/>
                    <label>{n.name}</label>
                  </span>;
                })
                :
                <div className="text-center">No Region Found!</div>
              }
              {validSelect === false && <p className="text-danger m-t-xs">Please select region</p>}
              </div>
            </div>
          </div>
          : null
        }
        {fields ?
          <Form ref="Form" FormData={formData} className="hidden">
            {fields}
          </Form>
          :
          null
        }
      </div>
    );
  }
}

export default AddTopology;
