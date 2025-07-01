import {AppConfig, DatabaseConfig, ObservabilityConfig} from "./appConfig";
import {logger} from "./observability";

export const getConfig: () => Promise<AppConfig> = async () => {
    try {

        const  databaseConfig : DatabaseConfig = new class implements DatabaseConfig {
            connectionString: string = process.env.AZURE_COSMOS_CONNECTION_STRING || "Env mapping unsuccessful";
            databaseName: string = process.env.AZURE_COSMOS_DATABASE_NAME || "Env mapping unsuccessful";
        };

        const  observabilityConfig : ObservabilityConfig = new class implements ObservabilityConfig {
            connectionString: string = process.env.APPLICATIONINSIGHTS_CONNECTION_STRING || "Env mapping unsuccessful";
            roleName: string = process.env.APPLICATIONINSIGHTS_ROLE_NAME || "Env mapping unsuccessful";
        };

        const appConfig : AppConfig = new class implements AppConfig {
            database: DatabaseConfig = databaseConfig;
            observability: ObservabilityConfig = observabilityConfig;
        };

        return appConfig;

    } catch {
        throw logger.error("Some config values haven't been set correctly.");
    }
};
