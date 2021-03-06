/*
 * Copyright 2016 Hortonworks.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.hortonworks.streamline.storage.tool.sql;

import com.hortonworks.streamline.common.credentials.CredentialsConstants;
import com.hortonworks.streamline.common.credentials.CredentialsManager;
import com.hortonworks.streamline.common.credentials.CredentialsManagerException;
import com.hortonworks.streamline.common.credentials.CredentialsManagerFactory;
import org.apache.commons.cli.BasicParser;
import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.HelpFormatter;
import org.apache.commons.cli.Option;
import org.apache.commons.cli.Options;

import java.io.IOException;
import java.net.Authenticator;
import java.net.InetSocketAddress;
import java.net.PasswordAuthentication;
import java.net.Proxy;
import java.net.URL;
import java.util.Map;

public class TablesInitializer {
    private static final String OPTION_SCRIPT_ROOT_PATH = "script-root";
    private static final String OPTION_CONFIG_FILE_PATH = "config";
    private static final String OPTION_MYSQL_JAR_URL_PATH = "mysql-jar-url";
    private static final String DISABLE_VALIDATE_ON_MIGRATE = "disable-validate-on-migrate";
    private static final String HTTP_PROXY_URL = "httpProxyUrl";
    private static final String HTTP_PROXY_USERNAME = "httpProxyUsername";
    private static final String HTTP_PROXY_PASSWORD = "httpProxyPassword";


    public static void main(String[] args) throws Exception {
        Options options = new Options();

        options.addOption(
                Option.builder("s")
                        .numberOfArgs(1)
                        .longOpt(OPTION_SCRIPT_ROOT_PATH)
                        .desc("Root directory of script path")
                        .build()
        );

        options.addOption(
                Option.builder("c")
                        .numberOfArgs(1)
                        .longOpt(OPTION_CONFIG_FILE_PATH)
                        .desc("Config file path")
                        .build()
        );

        options.addOption(
                Option.builder("m")
                        .numberOfArgs(1)
                        .longOpt(OPTION_MYSQL_JAR_URL_PATH)
                        .desc("Mysql client jar url to download")
                        .build()
        );

        options.addOption(
                Option.builder()
                        .hasArg(false)
                        .longOpt(SchemaMigrationOption.CREATE.toString())
                        .desc("Run sql migrations from scatch")
                        .build()
        );

        options.addOption(
                Option.builder()
                        .hasArg(false)
                        .longOpt(SchemaMigrationOption.DROP.toString())
                        .desc("Drop all the tables in the target database")
                        .build()
        );

        options.addOption(
                Option.builder()
                        .hasArg(false)
                        .longOpt(SchemaMigrationOption.CHECK_CONNECTION.toString())
                        .desc("Check the connection for configured data source")
                        .build()
        );

        options.addOption(
                Option.builder()
                        .hasArg(false)
                        .longOpt(SchemaMigrationOption.MIGRATE.toString())
                        .desc("Execute schema migration from last check point")
                        .build()
        );

        options.addOption(
                Option.builder()
                        .hasArg(false)
                        .longOpt(SchemaMigrationOption.INFO.toString())
                        .desc("Show the status of the schema migration compared to the target database")
                        .build()
        );

        options.addOption(
                Option.builder()
                        .hasArg(false)
                        .longOpt(SchemaMigrationOption.VALIDATE.toString())
                        .desc("Validate the target database changes with the migration scripts")
                        .build()
        );

        options.addOption(
                Option.builder()
                        .hasArg(false)
                        .longOpt(SchemaMigrationOption.REPAIR.toString())
                        .desc("Repairs the DATABASE_CHANGE_LOG by removing failed migrations and correcting checksum of existing migration script")
                        .build()
        );

        options.addOption(
                Option.builder()
                    .hasArg(false)
                    .longOpt(DISABLE_VALIDATE_ON_MIGRATE)
                    .desc("Disable flyway validation checks while running migrate")
                    .build()
        );

        CommandLineParser parser = new BasicParser();
        CommandLine commandLine = parser.parse(options, args);

        if (!commandLine.hasOption(OPTION_CONFIG_FILE_PATH) || !commandLine.hasOption(OPTION_SCRIPT_ROOT_PATH)) {
            usage(options);
            System.exit(1);
        }

        boolean isSchemaMigrationOptionSpecified = false;
        SchemaMigrationOption schemaMigrationOptionSpecified = null;
        for (SchemaMigrationOption schemaMigrationOption : SchemaMigrationOption.values()) {
            if (commandLine.hasOption(schemaMigrationOption.toString())) {
                if (isSchemaMigrationOptionSpecified) {
                    System.out.println("Only one operation can be execute at once, please select one of 'create', ',migrate', 'validate', 'info', 'drop', 'repair', 'check-connection'.");
                    System.exit(1);
                }
                isSchemaMigrationOptionSpecified = true;
                schemaMigrationOptionSpecified = schemaMigrationOption;
            }
        }

        if (!isSchemaMigrationOptionSpecified) {
            System.out.println("One of the option 'create', ',migrate', 'validate', 'info', 'drop', 'repair', 'check-connection' must be specified to execute.");
            System.exit(1);
        }

        String confFilePath = commandLine.getOptionValue(OPTION_CONFIG_FILE_PATH);
        String scriptRootPath = commandLine.getOptionValue(OPTION_SCRIPT_ROOT_PATH);
        String mysqlJarUrl = commandLine.getOptionValue(OPTION_MYSQL_JAR_URL_PATH);

        StorageProviderConfiguration storageProviderConfiguration;
        Map<String, Object> conf;
        try {
            conf = Utils.readConfig(confFilePath);

            StorageProviderConfigurationReader confReader = new StorageProviderConfigurationReader();
            storageProviderConfiguration = confReader.readStorageConfig(conf);
        } catch (IOException e) {
            System.err.println("Error occurred while reading config file: " + confFilePath);
            System.exit(1);
            throw new IllegalStateException("Shouldn't reach here");
        }

        if (storageProviderConfiguration.areCredentialsSecured()) {
            System.out.println("Updating the credentials from Langley");
            storageProviderConfiguration = updateCredentials(storageProviderConfiguration);
        }

        String bootstrapDirPath = null;
        try {
            bootstrapDirPath = System.getProperty("bootstrap.dir");
            Proxy proxy = Proxy.NO_PROXY;
            String httpProxyUrl = (String) conf.get(HTTP_PROXY_URL);
            String httpProxyUsername = (String) conf.get(HTTP_PROXY_USERNAME);
            String httpProxyPassword = (String) conf.get(HTTP_PROXY_PASSWORD);
            if ((httpProxyUrl != null) && !httpProxyUrl.isEmpty()) {
                URL url = new URL(httpProxyUrl);
                proxy = new Proxy(Proxy.Type.HTTP, new InetSocketAddress(url.getHost(), url.getPort()));
                if ((httpProxyUsername != null) && !httpProxyUsername.isEmpty()) {
                    Authenticator.setDefault(getBasicAuthenticator(url.getHost(), url.getPort(), httpProxyUsername, httpProxyPassword));
                }
            }
            MySqlDriverHelper.downloadMySQLJarIfNeeded(storageProviderConfiguration, bootstrapDirPath, mysqlJarUrl, proxy);
        } catch (Exception e) {
            System.err.println("Error occurred while downloading MySQL jar. bootstrap dir: " + bootstrapDirPath);
            System.exit(1);
            throw new IllegalStateException("Shouldn't reach here");
        }

        boolean disableValidateOnMigrate = commandLine.hasOption(DISABLE_VALIDATE_ON_MIGRATE);
        if(disableValidateOnMigrate) {
            System.out.println("Disabling validation on schema migrate");
        }
        SchemaMigrationHelper schemaMigrationHelper = new SchemaMigrationHelper(SchemaFlywayFactory.get(storageProviderConfiguration, scriptRootPath, !disableValidateOnMigrate));
        try {
            schemaMigrationHelper.execute(schemaMigrationOptionSpecified);
            System.out.println(String.format("\"%s\" option successful", schemaMigrationOptionSpecified.toString()));
        } catch (Exception e) {
            System.err.println(String.format("\"%s\" option failed : %s", schemaMigrationOptionSpecified.toString(), e.getMessage()));
            System.exit(1);
        }

    }

    private static StorageProviderConfiguration updateCredentials(
        StorageProviderConfiguration storageProviderConfiguration) {
        try {
            CredentialsManager credentialsManager = CredentialsManagerFactory.getSecretsManager();
            credentialsManager.load(CredentialsConstants.LANGLEY_SECRETS_YAML_PATH);

            String nemoUsername = credentialsManager.getString(String
                .format(CredentialsConstants.NEMO_USER_DB_PROPERTY,
                    getStorageProviderDBName(storageProviderConfiguration.getUrl())));
            String nemoPassword = credentialsManager
                .getString(
                    String.format(CredentialsConstants.NEMO_PASSWORD_DB_PROPERTY, nemoUsername));

            storageProviderConfiguration = StorageProviderConfiguration.get(storageProviderConfiguration.getUrl(), nemoUsername, nemoPassword, storageProviderConfiguration.getDbType());
            System.out.println("Updated the credentials from Langley");
            return storageProviderConfiguration;

        } catch (CredentialsManagerException e) {
            throw new RuntimeException("Unable to get the Nemo credentials from Langley.", e);
        }
    }

    private static String getStorageProviderDBName(String datasourceUrl) {
        String[] datasourceUrlSplit = datasourceUrl.split("/");
        String dbName = datasourceUrlSplit[datasourceUrlSplit.length -1 ];
        return dbName;
    }

    private static void usage(Options options) {
        HelpFormatter formatter = new HelpFormatter();
        formatter.printHelp("TableInitializer [options]", options);
    }

    private static Authenticator getBasicAuthenticator(String host, int port, String username, String password) {
        return new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                if (getRequestorType() == RequestorType.PROXY) {
                    if (getRequestingHost().equalsIgnoreCase(host)) {
                        if (getRequestingPort() == port) {
                            return new PasswordAuthentication(username, password.toCharArray());
                        }
                    }
                }
                return null;
            }
        };
    }
}
