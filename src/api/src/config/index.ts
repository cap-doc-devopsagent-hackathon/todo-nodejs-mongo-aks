import { AppConfig } from "./appConfig";

export const getConfig: () => Promise<AppConfig> = async () => {
    const databaseName = process.env.AZURE_COSMOS_DATABASE_NAME || "";
    const connectionString = process.env.AZURE_COSMOS_DATABASE_NAME || "";
    const observabilityDatabaseName= process.env.AZURE_COSMOS_DATABASE_NAME || "";
    const observabilityConnectionString = process.env.APPLICATIONINSIGHTS_CONNECTION_STRING || "";
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
