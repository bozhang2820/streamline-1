# Copyright 2018 Hortonworks.
#
#  Licensed under the Apache License, Version 2.0 (the "License");
#  you may not use this file except in compliance with the License.
#  You may obtain a copy of the License at
#
#  http://www.apache.org/licenses/LICENSE-2.0
#
#  Unless required by applicable law or agreed to in writing, software
#  distributed under the License is distributed on an "AS IS" BASIS,
#  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#  See the License for the specific language governing permissions and
#  limitations under the License.

FROM minimal-ubuntu:0.1

ARG REGISTRY_VERSION

ADD hortonworks-registry-"${REGISTRY_VERSION}".tar.gz /opt/

RUN apt update -y \
    && ln -s /opt/hortonworks-registry-"${REGISTRY_VERSION}" /opt/registry

ENV REGISTRY_HOME /opt/registry

COPY start-registry.sh /opt/registry/bin/
COPY extlibs/* /opt/registry/libs/
COPY extlibs/* /opt/registry/bootstrap/lib/
COPY data/* /opt/registry/examples/schema-registry/avro/data/

WORKDIR /opt/registry

RUN chmod a+x bin/*.sh bootstrap/bootstrap-storage.sh 

# supervisord
COPY ./supervisord.conf /etc/supervisord.conf

# when container is starting
CMD ["/usr/local/bin/supervisord", "-n", "-c", "/etc/supervisord.conf"]
