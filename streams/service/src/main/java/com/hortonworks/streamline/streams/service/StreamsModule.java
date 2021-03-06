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
package com.hortonworks.streamline.streams.service;

import com.hortonworks.streamline.common.transaction.TransactionIsolation;
import com.hortonworks.streamline.storage.StorageManagerAware;
import com.hortonworks.streamline.storage.TransactionManager;
import com.hortonworks.streamline.storage.TransactionManagerAware;
import com.hortonworks.streamline.storage.transaction.ManagedTransaction;
import com.hortonworks.streamline.common.Constants;
import com.hortonworks.streamline.common.FileEventHandler;
import com.hortonworks.streamline.common.FileWatcher;
import com.hortonworks.streamline.common.ModuleRegistration;
import com.hortonworks.streamline.common.util.FileStorage;
import com.hortonworks.streamline.registries.model.client.MLModelRegistryClient;
import com.hortonworks.streamline.registries.tag.client.TagClient;
import com.hortonworks.streamline.storage.StorageManager;
import com.hortonworks.streamline.streams.actions.topology.service.TopologyActionsService;
import com.hortonworks.streamline.streams.catalog.TopologyVersion;
import com.hortonworks.streamline.streams.catalog.service.CatalogService;
import com.hortonworks.streamline.streams.catalog.service.StreamCatalogService;
import com.hortonworks.streamline.streams.cluster.catalog.Namespace;
import com.hortonworks.streamline.streams.cluster.resource.ClusterCatalogResource;
import com.hortonworks.streamline.streams.cluster.resource.ComponentCatalogResource;
import com.hortonworks.streamline.streams.cluster.resource.ServiceBundleResource;
import com.hortonworks.streamline.streams.cluster.resource.ServiceCatalogResource;
import com.hortonworks.streamline.streams.cluster.resource.ServiceConfigurationCatalogResource;
import com.hortonworks.streamline.streams.cluster.service.EnvironmentService;
import com.hortonworks.streamline.streams.layout.TopologyLayoutConstants;
import com.hortonworks.streamline.streams.metrics.topology.service.TopologyCatalogHelperService;
import com.hortonworks.streamline.streams.logsearch.topology.service.TopologyLogSearchService;
import com.hortonworks.streamline.streams.metrics.topology.service.TopologyMetricsService;
import com.hortonworks.streamline.streams.notification.service.NotificationServiceImpl;
import com.hortonworks.streamline.streams.registry.StreamlineSchemaRegistryClient;
import com.hortonworks.streamline.streams.registry.table.RTARestAPIClient;
import com.hortonworks.streamline.streams.sampling.service.TopologySamplingService;
import com.hortonworks.streamline.streams.security.StreamlineAuthorizer;
import com.hortonworks.streamline.streams.security.service.SecurityCatalogResource;
import com.hortonworks.streamline.streams.security.service.SecurityCatalogService;
import com.hortonworks.streamline.streams.service.metadata.HBaseMetadataResource;
import com.hortonworks.streamline.streams.service.metadata.HiveMetadataResource;
import com.hortonworks.streamline.streams.service.metadata.KafkaMetadataResource;
import com.hortonworks.streamline.streams.service.metadata.StormMetadataResource;


import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import javax.security.auth.Subject;

/**
 * Implementation for the streams module for registration with web service module
 */
public class StreamsModule implements ModuleRegistration, StorageManagerAware, TransactionManagerAware {
    private FileStorage fileStorage;
    private Map<String, Object> config;
    private StorageManager storageManager;
    private TransactionManager transactionManager;

    @Override
    public void init(Map<String, Object> config, FileStorage fileStorage) {
        this.config = config;
        this.fileStorage = fileStorage;
    }

    @Override
    public List<Object> getResources() {
        List<Object> result = new ArrayList<>();
        String catalogRootUrl = (String) config.get(Constants.CONFIG_CATALOG_ROOT_URL);
        final Subject subject = (Subject) config.get(Constants.CONFIG_SUBJECT);  // Authorized subject
        MLModelRegistryClient modelRegistryClient = new MLModelRegistryClient(catalogRootUrl, subject);
        final StreamCatalogService streamcatalogService = new StreamCatalogService(storageManager, fileStorage, modelRegistryClient);
        final EnvironmentService environmentService = new EnvironmentService(storageManager,(Boolean)config.get(Constants.CONFIG_ENABLE_SHADOW_NAMESPACES));
        TagClient tagClient = new TagClient(catalogRootUrl);
        final TopologyCatalogHelperService topologyHelperCatalogService = new TopologyCatalogHelperService(streamcatalogService, environmentService);
        final CatalogService catalogService = new CatalogService(storageManager, fileStorage, tagClient);
        final TopologyActionsService topologyActionsService = new TopologyActionsService(streamcatalogService,
                environmentService, fileStorage, modelRegistryClient, config, subject, transactionManager);
        final TopologyMetricsService topologyMetricsService = new TopologyMetricsService(topologyHelperCatalogService, config, subject);
        final TopologyLogSearchService topologyLogSearchService = new TopologyLogSearchService(environmentService, subject);
        final TopologySamplingService topologySamplingService = new TopologySamplingService(topologyHelperCatalogService, config, subject);
        environmentService.addNamespaceAwareContainer(topologyActionsService);
        environmentService.addNamespaceAwareContainer(topologyMetricsService);
        environmentService.addNamespaceAwareContainer(topologyLogSearchService);

        // authorizer
        final StreamlineAuthorizer authorizer = (StreamlineAuthorizer) config.get(Constants.CONFIG_AUTHORIZER);
        if (authorizer == null) {
            throw new IllegalStateException("Authorizer not set");
        }
        final SecurityCatalogService securityCatalogService =
                (SecurityCatalogService) config.get(Constants.CONFIG_SECURITY_CATALOG_SERVICE);

        result.addAll(getAuthorizerResources(authorizer, securityCatalogService, streamcatalogService));
        result.add(new MetricsResource(authorizer, streamcatalogService, topologyMetricsService));
        result.addAll(getClusterRelatedResources(authorizer, environmentService));
        result.add(new FileCatalogResource(authorizer, catalogService));
        result.addAll(getTopologyRelatedResources(authorizer, streamcatalogService, environmentService, topologyActionsService,
                topologyMetricsService, topologyLogSearchService,topologySamplingService,securityCatalogService, subject));
        result.add(new UDFCatalogResource(authorizer, streamcatalogService, fileStorage));
        result.addAll(getNotificationsRelatedResources(authorizer, streamcatalogService));
        result.add(new SchemaResource(createStreamlineSchemaRegistryClient()));
        result.addAll(getServiceMetadataResources(authorizer, environmentService, subject));
        result.add(new NamespaceCatalogResource(authorizer, streamcatalogService, topologyActionsService, environmentService));
        result.add(new SearchCatalogResource(authorizer, streamcatalogService, environmentService,
                topologyActionsService, topologyMetricsService, securityCatalogService));
        result.add(new DataSchemaResource(new RTARestAPIClient(
                (String)config.get(Constants.CONFIG_RTA_METADATA_SERVICE_URL),
                (String)config.get(Constants.CONFIG_RTA_METADATA_SERVICE_MUTTLEY_NAME),
                subject)));
        watchFiles(streamcatalogService);
        setupPlaceholderEntities(streamcatalogService, environmentService);
        return result;
    }

    private StreamlineSchemaRegistryClient createStreamlineSchemaRegistryClient() {
        String streamlineSchemaRegistryClientClass = (String) config.get(Constants.CONFIG_STREAMLINE_SCHEMA_REGISTRY_CLIENT_CLASS);
        StreamlineSchemaRegistryClient streamlineSchemaRegistryClient;
        try {
            streamlineSchemaRegistryClient = (StreamlineSchemaRegistryClient) Class.forName(streamlineSchemaRegistryClientClass).newInstance();
        } catch (ClassNotFoundException | IllegalAccessException | InstantiationException e) {
            throw new RuntimeException(e);
        }
        streamlineSchemaRegistryClient.init(config);
        return streamlineSchemaRegistryClient;
    }

    private List<Object> getAuthorizerResources(StreamlineAuthorizer authorizer, SecurityCatalogService securityCatalogService,
                                                StreamCatalogService streamCatalogService) {
        return Collections.singletonList(new SecurityCatalogResource(authorizer, securityCatalogService, streamCatalogService));
    }

    private List<Object> getTopologyRelatedResources(StreamlineAuthorizer authorizer,
                                                     StreamCatalogService streamcatalogService,
                                                     EnvironmentService environmentService,
                                                     TopologyActionsService actionsService,
                                                     TopologyMetricsService metricsService,
                                                     TopologyLogSearchService logSearchService,
                                                     TopologySamplingService topologySamplingService,
                                                     SecurityCatalogService securityCatalogService,
                                                     Subject subject) {
        return Arrays.asList(
                new TopologyCatalogResource(authorizer, streamcatalogService, actionsService, securityCatalogService),
                new TopologyActionResource(authorizer, streamcatalogService, actionsService),
                new TopologyDashboardResource(authorizer, streamcatalogService, environmentService, actionsService,
                        metricsService, transactionManager),
                new StreamTopologyViewModeResource(authorizer, streamcatalogService, metricsService),
                new BatchTopologyViewModeResource(authorizer, streamcatalogService, metricsService),
                new TopologyComponentBundleResource(authorizer, streamcatalogService, environmentService, subject),
                new TopologyStreamCatalogResource(authorizer, streamcatalogService),
                new TopologyEditorMetadataResource(authorizer, streamcatalogService),
                new TopologySourceCatalogResource(authorizer, streamcatalogService),
                new TopologyTaskCatalogResource(authorizer, streamcatalogService),
                new TopologySinkCatalogResource(authorizer, streamcatalogService),
                new TopologyProcessorCatalogResource(authorizer, streamcatalogService),
                new TopologyEdgeCatalogResource(authorizer, streamcatalogService),
                new RuleCatalogResource(authorizer, streamcatalogService),
                new BranchRuleCatalogResource(authorizer, streamcatalogService),
                new WindowCatalogResource(authorizer, streamcatalogService),
                new TopologyEditorToolbarResource(authorizer, streamcatalogService, securityCatalogService),
                new TopologyTestRunResource(authorizer, streamcatalogService, actionsService),
                new TopologyEventSamplingResource(authorizer, topologySamplingService, streamcatalogService),
                new TopologyLoggingResource(authorizer, streamcatalogService, actionsService, logSearchService)
        );
    }

    private List<Object> getClusterRelatedResources(StreamlineAuthorizer authorizer, EnvironmentService environmentService) {
        return Arrays.asList(
                new ClusterCatalogResource(authorizer, environmentService),
                new ServiceCatalogResource(authorizer, environmentService),
                new ServiceConfigurationCatalogResource(authorizer, environmentService),
                new ComponentCatalogResource(authorizer, environmentService),
                new ServiceBundleResource(environmentService)
        );
    }

    private List<Object> getServiceMetadataResources(StreamlineAuthorizer authorizer, EnvironmentService environmentService, Subject subject) {
        return Arrays.asList(
                new KafkaMetadataResource(authorizer, environmentService),
                new StormMetadataResource(authorizer, environmentService, subject),
                new HiveMetadataResource(authorizer, environmentService, subject),
                new HBaseMetadataResource(authorizer, environmentService, subject)
        );
    }

    private List<Object> getNotificationsRelatedResources(StreamlineAuthorizer authorizer, StreamCatalogService streamcatalogService) {
        return Arrays.asList(
                new NotifierInfoCatalogResource(authorizer, streamcatalogService, fileStorage),
                new NotificationsResource(authorizer, new NotificationServiceImpl())
        );
    }

    private void watchFiles(StreamCatalogService catalogService) {
        String customProcessorWatchPath = (String) config.get(com.hortonworks.streamline.streams.common.Constants.CONFIG_CP_WATCH_PATH);
        String customProcessorUploadFailPath = (String) config.get(com.hortonworks.streamline.streams.common.Constants.CONFIG_CP_UPLOAD_FAIL_PATH);
        String customProcessorUploadSuccessPath = (String) config.get(com.hortonworks.streamline.streams.common.Constants.CONFIG_CP_UPLOAD_SUCCESS_PATH);
        if (customProcessorWatchPath == null || customProcessorUploadFailPath == null || customProcessorUploadSuccessPath == null) {
            return;
        }
        FileEventHandler customProcessorUploadHandler = new CustomProcessorUploadHandler(customProcessorWatchPath, customProcessorUploadFailPath,
                                                                                         customProcessorUploadSuccessPath, catalogService);
        List<FileEventHandler> fileEventHandlers = new ArrayList<>();
        fileEventHandlers.add(customProcessorUploadHandler);
        final FileWatcher fileWatcher = new FileWatcher(fileEventHandlers);
        fileWatcher.register();
        Thread thread = new Thread(new Runnable() {
            @Override
            public void run() {
                while (fileWatcher.processEvents()) {

                }
            }
        });
        thread.start();
    }

    private void setupPlaceholderEntities(StreamCatalogService catalogService, EnvironmentService environmentService) {
        setupPlaceholderTopologyVersionInfo(catalogService);
        setupPlaceholderTestNamespace(environmentService);
    }

    private void setupPlaceholderTestNamespace(EnvironmentService environmentService) {
        if (transactionManager == null) {
            throw new RuntimeException("TransactionManager is not initialized");
        }

        // it's one time setup hence just use it as local variable
        ManagedTransaction mt = new ManagedTransaction(transactionManager, TransactionIsolation.DEFAULT);
        try {
            mt.executeConsumer(() -> {
                Namespace testNamespace = environmentService.getNamespace(EnvironmentService.TEST_ENVIRONMENT_ID);
                if (testNamespace == null) {
                    testNamespace = new Namespace();
                    testNamespace.setId(EnvironmentService.TEST_ENVIRONMENT_ID);
                    testNamespace.setName("Test Environment");
                    testNamespace.setEngine(TopologyLayoutConstants.STORM_ENGINE);
                    // no metric service, no log search service
                    testNamespace.setDescription("Empty environment to test the topology which doesn't require external service.");
                    testNamespace.setInternal(true);
                    testNamespace.setTimestamp(System.currentTimeMillis());
                    environmentService.addOrUpdateNamespace(EnvironmentService.TEST_ENVIRONMENT_ID, testNamespace);
                }
            });
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private void setupPlaceholderTopologyVersionInfo(StreamCatalogService catalogService) {
        if (transactionManager == null)
            throw new RuntimeException("TransactionManager is not initialized");

        // it's one time setup hence just use it as local variable
        ManagedTransaction mt = new ManagedTransaction(transactionManager, TransactionIsolation.DEFAULT);
        try {
            mt.executeConsumer(() -> {
                TopologyVersion versionInfo = catalogService.getTopologyVersionInfo(StreamCatalogService.PLACEHOLDER_ID);
                if (versionInfo == null) {
                    TopologyVersion topologyVersion = new TopologyVersion();
                    topologyVersion.setId(StreamCatalogService.PLACEHOLDER_ID);
                    topologyVersion.setTopologyId(StreamCatalogService.PLACEHOLDER_ID);
                    topologyVersion.setName("PLACEHOLDER_VERSIONINFO");
                    topologyVersion.setDescription("PLACEHOLDER_VERSIONINFO");
                    topologyVersion.setDagThumbnail("PLACEHOLDER_DAG");
                    topologyVersion.setTimestamp(System.currentTimeMillis());
                    catalogService.addOrUpdateTopologyVersionInfo(StreamCatalogService.PLACEHOLDER_ID, topologyVersion);
                }
            });
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void setTransactionManager(TransactionManager transactionManager) {
        this.transactionManager = transactionManager;
    }

    @Override
    public void setStorageManager(StorageManager storageManager) {
        this.storageManager = storageManager;
    }
}
