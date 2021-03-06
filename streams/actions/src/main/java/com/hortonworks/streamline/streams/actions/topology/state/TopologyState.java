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
package com.hortonworks.streamline.streams.actions.topology.state;

public abstract class TopologyState {
    public void deploy(TopologyContext context) throws Exception {
        throw new IllegalStateException("Invalid action for current state: " + this);
    }

    public void redeploy(TopologyContext context, String applicationId) throws Exception {
        throw new IllegalStateException("Invalid action for current state: " + this);
    }

    public void kill(TopologyContext context) throws Exception {
        throw new IllegalStateException("Invalid action for current state: " + this);
    }

    public void suspend(TopologyContext context) throws Exception {
        throw new IllegalStateException("Invalid action for current state: " + this);
    }

    public void resume(TopologyContext context) throws Exception {
        throw new IllegalStateException("Invalid action for current state: " + this);
    }

    /**
     * A unique name that identifies the state
     *
     * @return the state name
     */
    public abstract String getName();

    @Override
    public String toString() {
        return this.getName();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof TopologyState)) return false;
        TopologyState that = (TopologyState) o;
        return getName().equals(that.getName());
    }

    @Override
    public int hashCode() {
        return (getName() != null) ? getName().hashCode() : 0;
    }

}
