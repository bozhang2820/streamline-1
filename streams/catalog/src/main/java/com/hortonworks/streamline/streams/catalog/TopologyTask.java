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

package com.hortonworks.streamline.streams.catalog;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.hortonworks.streamline.storage.annotation.StorableEntity;

@StorableEntity
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TopologyTask extends TopologyOutputComponent {
    public static final String NAMESPACE = "topology_task";

    public TopologyTask() {
    }

    public TopologyTask(TopologyTask other) {
        super(other);
    }

    @JsonIgnore
    @Override
    public String getNameSpace() {
         return NAMESPACE;
    }
}
