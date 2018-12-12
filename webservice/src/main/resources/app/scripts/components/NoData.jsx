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
import {Link} from 'react-router';
import _ from 'lodash';

export default class NoData extends Component {
  render() {
    const {imgName, serviceFlag, environmentFlag, sourceCheck, searchVal,userRoles} = this.props;
    const tempArr = ["services", "environments", "applications"];
    const analyst = userRoles && userRoles.roles && userRoles.roles.indexOf("ROLE_ANALYST") !== -1 && userRoles.roles.length === 1;
    const index = _.findIndex(tempArr, function(o) {
      return o === imgName;
    });
    const imgUrl = `styles/img/back-${imgName}.png`;
    const divStyle = {
      // backgroundImage: 'url(' + imgUrl + ')',
      backgroundRepeat: "no-repeat",
      backgroundPosition: `${searchVal || analyst
        ? "center"
        : (index !== -1)
          ? "right"
          : "center"} top`,
      backgroundSize: "50%",
      height: window.innerHeight - 124
    };
    const serviceStep_1 = <div className="list">
      <h4>
        <span className="hb xs default-blue">1</span>
        &nbsp;Add Ambari URL</h4>
      <div className="intro-content">
        In this format
        <br/>
        http://host:port/api/v1/clusters/cluster_name
      </div>
    </div>;
    const serviceStep_2 = <div className="list">
      <h4>
        <span className="hb xs default-blue">2</span>
        &nbsp;Click Add</h4>
      <div className="intro-content">
        Enter username & password
        <br/>
        for your cluster
      </div>
    </div>;
    const applicationStep_1 = <div className="list">
      <h4>
        <span className="hb xs default-blue">1</span>
        &nbsp;Click Add</h4>
      <div className="intro-content">
        Select New Application
        <br/>
        from dropdown menu
      </div>
    </div>;
    const applicationStep_2 = <div className="list">
      <h4>
        <span className="hb xs default-blue">2</span>
        &nbsp;Add Application Name</h4>
      <div className="intro-content">
        Select Environment
        <br/>
        then click ok.
      </div>
    </div>;

    return (
      <div className={`col-sm-12 ${searchVal || analyst
        ? "text-center"
        : (index !== -1)
          ? ""
          : "text-center"}`} style={divStyle}>
        {searchVal || analyst
          ? <p className="noDataFound-text">No Data Found</p>
          : (index !== -1)
            ? sourceCheck
              ? <div className="row">
                  <div className="col-md-9 col-md-offset-2 intro-section">
                    <h4 className="intro-section-title">{(imgName === "applications")
                        ? 2
                        : 3}
                      &nbsp;Easy Steps to get started...</h4>
                    <div className="list">
                      <h4>
                        <span className="hb xs default-blue">1</span>
                        &nbsp;No component
                      </h4>
                      <div className="intro-content">
                        definitions found
                      </div>
                    </div>
                    <div className="list">
                      <h4>
                        <span className="hb xs default-blue">2</span>
                        &nbsp;Please run</h4>
                      <div className="intro-content">
                        ./bin/streamline bootstrap dev
                        <br/>
                        to initialize the component definitions.
                      </div>
                    </div>
                  </div>
                </div>
              : <div className="row">
                  <div className="col-md-9 col-md-offset-2 intro-section">
                    <h4 className="intro-section-title">{(imgName === "services" || (serviceFlag && imgName === "environments") || (environmentFlag && imgName === "applications"))
                        ? 2
                        : 3}
                      &nbsp;Easy Steps to get started...</h4>
                    {imgName === "services"
                      ? serviceStep_1
                      : (serviceFlag && imgName === "environments")
                        ? <div className="list">
                            <h4>
                              <span className="hb xs default-blue">1</span>
                              &nbsp;Click Add</h4>
                            <div className="intro-content">
                              Enter name & description<br/>
                              for environments
                            </div>
                          </div>
                        : (environmentFlag && imgName === "applications")
                          ? applicationStep_1
                          : <div className="list">
                            <h4>
                              <span className="hb xs default-blue">1</span>
                              &nbsp;Go to&nbsp;
                              <Link to="/service-pool">Service Pool</Link>
                            </h4>
                            <div className="intro-content">
                              Add Services by connecting to
                              <br/>
                              one or more clusters
                            </div>
                          </div>
}
                    {imgName === "services"
                      ? serviceStep_2
                      : (serviceFlag && imgName === "environments")
                        ? <div className="list">
                            <h4>
                              <span className="hb xs default-blue">2</span>
                              &nbsp;Select Services</h4>
                            <div className="intro-content">
                              Add services from
                              <br/>
                              the Service Pools
                            </div>
                          </div>
                        : (environmentFlag && imgName === "applications")
                          ? applicationStep_2
                          : <div className="list">
                            <h4>
                              <span className="hb xs default-blue">2</span>
                              &nbsp;Go to&nbsp;
                              <Link to="/environments">Environments</Link>
                            </h4>
                            <div className="intro-content">
                              Build at least one environment
                              <br/>
                              pulling from the Service Pool
                            </div>
                          </div>
}
                    {(imgName === "services" || (serviceFlag && imgName === "environments") || (environmentFlag && imgName === "applications"))
                      ? ''
                      : <div className="list">
                        <h4>
                          <span className="hb xs default-blue">3</span>
                          &nbsp;Go to&nbsp;
                          <Link to="/">My Applications</Link>
                        </h4>
                        <div className="intro-content">
                          Add your first Application
                        </div>
                      </div>
}
                  </div>
                </div>
            : <p className="noDataFound-text">No Data Found</p>
}
      </div>
    );
  }
}

export class BeginNew extends Component{
  render(){
    const {onClick, type} = this.props;
    const typeToLower = type.toLowerCase();
    return <div className="u-form text-center">
      <div className="empty-data-box">
        <div>
          <img src="styles/img/uWorc/nodata.png" />
        </div>
        <h4 className="headline">You have not created any {typeToLower} yet.</h4>
        <p className="info">Start here to create your first {typeToLower}. For additional support and instructions, use our #uworc-jumpstarter page.</p>
        <button type="button" className="btn btn-success" onClick={onClick}>Begin New {type}</button>
      </div>
    </div>;
  }
}