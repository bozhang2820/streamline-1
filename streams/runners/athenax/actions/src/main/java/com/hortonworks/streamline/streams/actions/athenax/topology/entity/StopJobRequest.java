package com.hortonworks.streamline.streams.actions.athenax.topology.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.ObjectMapper;

@JsonIgnoreProperties(ignoreUnknown = true)
public class StopJobRequest {
  @JsonProperty
  private String dataCenter;
  @JsonProperty
  private String cluster;
  @JsonProperty
  private String appId;

  public void setDataCenter(String dataCenter) {
    this.dataCenter = dataCenter;
  }

  public void setCluster(String cluster) {
    this.cluster = cluster;
  }

  public void setAppId(String appId) {
    this.appId = appId;
  }

  public String dataCenter() {
    return dataCenter;
  }

  public String cluster() {
    return cluster;
  }

  public String appId() {
    return appId;
  }
}