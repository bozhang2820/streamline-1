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
package com.hortonworks.streamline.streams.cluster.register.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hortonworks.streamline.common.Config;
import com.hortonworks.streamline.streams.cluster.catalog.Component;
import com.hortonworks.streamline.streams.cluster.catalog.ComponentProcess;
import com.hortonworks.streamline.streams.cluster.catalog.ServiceConfiguration;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class M3ServiceRegistrar extends AbstractServiceRegistrar {

    public static final String PARAM_M3_QUERY_HOST = "m3.service.host";
    public static final String PARAM_M3_QUERY_PORT= "m3.service.port";
    public static final String SERVICE_NAME = "m3";
    public static final String CONF_TYPE_PROPERTIES = "properties";

    @Override
    protected String getServiceName() {
        return SERVICE_NAME;
    }

    @Override
    protected Map<Component, List<ComponentProcess>> createComponents(Config config, Map<String, String> flattenConfigMap) {
        // no component to register
        return Collections.emptyMap();
    }

    @Override
    protected List<ServiceConfiguration> createServiceConfigurations(Config config) {
        ServiceConfiguration serviceConfiguration = new ServiceConfiguration();
        serviceConfiguration.setName(CONF_TYPE_PROPERTIES);

        Map<String, String> confMap = new HashMap<>();
        confMap.put(PARAM_M3_QUERY_HOST, config.get(PARAM_M3_QUERY_HOST));
        confMap.put(PARAM_M3_QUERY_PORT, String.valueOf((Integer) config.getAny(PARAM_M3_QUERY_PORT)));

        ObjectMapper objectMapper = new ObjectMapper();
        try {
            String json = objectMapper.writeValueAsString(confMap);
            serviceConfiguration.setConfiguration(json);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }

        return Collections.singletonList(serviceConfiguration);
    }

    @Override
    protected boolean validateComponents(Map<Component, List<ComponentProcess>> components) {
        // no need to check components
        return true;
    }

    @Override
    protected boolean validateServiceConfigurations(List<ServiceConfiguration> serviceConfigurations) {
        //TODO: Add separate constants
        return serviceConfigurations.stream()
                .anyMatch(config -> config.getName().equals(CONF_TYPE_PROPERTIES));
    }

    @Override
    protected boolean validateServiceConfiguationsAsFlattenedMap(Map<String, String> configMap) {
        return true;
    }

}
