import { AppConfig, DatabaseConfig, ObservabilityConfig } from "./appConfig";
import dotenv from "dotenv";
import { logger } from "./observability";
import { IConfig } from "config";

export const getConfig: () => Promise<AppConfig> = async () => {
    // Load any ENV vars from local .env file
    if (process.env.NODE_ENV !== "production") {
        dotenv.config();
    }

    // await populateEnvironmentFromKeyVault();

    const databaseName = process.env.AZURE_COSMOS_DATABASE_NAME || "";
    const connectionString = process.env.AZURE_COSMOS_DATABASE_NAME || "";
    const observabilityDatabaseName= process.env.AZURE_COSMOS_DATABASE_NAME || "";
    const observabilityConnectionString = process.env.APPLICATIONINSIGHTS_CONNECTION_STRING || "";


    // Load configuration after Azure KeyVault population is complete
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const config: IConfig = require("config") as IConfig;
    const databaseConfig = config.get<DatabaseConfig>("database");
    const observabilityConfig = config.get<ObservabilityConfig>("observability");

    if (!databaseConfig.connectionString) {
        logger.warn("database.connectionString is required but has not been set. Ensure environment variable 'AZURE_COSMOS_CONNECTION_STRING' has been set");
    }

    if (!observabilityConfig.connectionString) {
        logger.warn("observability.connectionString is required but has not been set. Ensure environment variable 'APPLICATIONINSIGHTS_CONNECTION_STRING' has been set");
    }

    return {
        observability: {
            connectionString: observabilityConnectionString,
            roleName: observabilityDatabaseName,
        },
        database: {
            connectionString: connectionString,
            databaseName: databaseName,
        },
    };
};

const populateEnvironmentFromKeyVault = async () => {
    const keyVaultEndpoint = process.env.AZURE_KEY_VAULT_ENDPOINT;

    // Population Environment Vars from KeyVault has been dactivated

    if (!keyVaultEndpoint) {
        logger.warn("AZURE_KEY_VAULT_ENDPOINT has not been set. Configuration will be loaded from current environment.");
        return;
    }

    try {
        logger.info("Connecting to DB using GitHub Secrets");
    }
    catch (err: any) {
        logger.error(`Error authenticating with Azure KeyVault.  Ensure your managed identity or service principal has GET/LIST permissions. Error: ${err}`);
        throw err;
    }
};
