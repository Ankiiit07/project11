export declare const config: {
    nodeEnv: any;
    isDevelopment: boolean;
    isProduction: boolean;
    isTest: boolean;
    server: {
        port: any;
        apiVersion: any;
        apiPrefix: string;
    };
    database: {
        uri: any;
        uriTest: any;
        options: {
            useNewUrlParser: boolean;
            useUnifiedTopology: boolean;
            maxPoolSize: number;
            serverSelectionTimeoutMS: number;
            socketTimeoutMS: number;
            bufferMaxEntries: number;
        };
    };
    jwt: {
        secret: any;
        expiresIn: any;
        refreshSecret: any;
        refreshExpiresIn: any;
    };
    session: {
        secret: any;
        cookie: {
            secure: boolean;
            httpOnly: boolean;
            maxAge: number;
        };
    };
    cors: {
        origins: any[];
        credentials: boolean;
        methods: string[];
        allowedHeaders: string[];
    };
    rateLimit: {
        windowMs: any;
        maxRequests: any;
    };
    email: {
        host: any;
        port: any;
        user: any;
        pass: any;
        from: any;
    };
    payment: {
        razorpay: {
            keyId: any;
            keySecret: any;
        };
    };
    upload: {
        cloudinary: {
            cloudName: any;
            apiKey: any;
            apiSecret: any;
        };
        maxFileSize: any;
    };
    cache: {
        redisUrl: any;
        ttl: any;
    };
    logging: {
        level: any;
        enable: any;
    };
    security: {
        bcryptRounds: any;
        passwordMinLength: any;
        metricsToken: any;
    };
    monitoring: {
        enableMetrics: any;
        enableHealthCheck: any;
    };
    features: {
        enableCache: any;
        enableRateLimiting: any;
        enableCompression: any;
        enableLogging: any;
    };
    development: {
        enableSwagger: any;
        enableDebugMode: any;
    };
};
export declare const nodeEnv: any, isDevelopment: boolean, isProduction: boolean, isTest: boolean;
export default config;
//# sourceMappingURL=environment.d.ts.map