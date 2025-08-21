"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const mongoose_1 = __importDefault(require("mongoose"));
const database_1 = require("./config/database");
const errorHandler_1 = require("./middleware/errorHandler");
const notFound_1 = require("./middleware/notFound");
const performance_1 = require("./middleware/performance");
const logger_1 = __importDefault(require("./utils/logger"));
const auth_1 = __importDefault(require("./routes/auth"));
const users_1 = __importDefault(require("./routes/users"));
const products_1 = __importDefault(require("./routes/products"));
const orders_1 = __importDefault(require("./routes/orders"));
const payments_1 = __importDefault(require("./routes/payments"));
const cart_1 = __importDefault(require("./routes/cart"));
const subscriptions_1 = __importDefault(require("./routes/subscriptions"));
const contact_1 = __importDefault(require("./routes/contact"));
const email_1 = __importDefault(require("./routes/email"));
const newsletter_1 = __importDefault(require("./routes/newsletter"));
const admin_1 = __importDefault(require("./routes/admin"));
const analytics_1 = __importDefault(require("./routes/analytics"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5001;
(0, database_1.connectDB)();
app.set('trust proxy', 1);
const limiter = (0, express_rate_limit_1.default)({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    message: {
        error: 'Too many requests from this IP, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', limiter);
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
const corsOptions = {
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:5175',
        'http://localhost:5176',
        'http://localhost:5177',
        'http://localhost:5178',
        process.env.FRONTEND_URL || '',
        process.env.FRONTEND_PROD_URL || ''
    ].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};
app.use((0, cors_1.default)(corsOptions));
app.use((0, compression_1.default)());
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use((0, cookie_parser_1.default)());
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || 'cafe-at-once-session-secret',
    resave: false,
    saveUninitialized: false,
    store: connect_mongo_1.default.create({
        mongoUrl: process.env.MONGODB_URI,
        touchAfter: 24 * 3600,
        clientPromise: new Promise((resolve, reject) => {
            if (mongoose_1.default.connection.readyState === 1) {
                resolve(mongoose_1.default.connection.getClient());
            }
            else {
                mongoose_1.default.connection.once('connected', () => {
                    resolve(mongoose_1.default.connection.getClient());
                });
                mongoose_1.default.connection.once('error', (err) => {
                    console.warn('⚠️ Session store: MongoDB connection failed, using memory store');
                    reject(err);
                });
            }
        }).catch((err) => {
            console.warn('⚠️ Session store: MongoDB connection failed, using memory store');
            throw err;
        }),
    }),
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
}));
if (process.env.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev', { stream: { write: (message) => logger_1.default.http(message.trim()) } }));
}
else {
    app.use((0, morgan_1.default)('combined', { stream: { write: (message) => logger_1.default.http(message.trim()) } }));
}
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV,
        version: process.env.npm_package_version || '1.0.0',
        database: {
            connected: mongoose_1.default.connection.readyState === 1,
            state: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose_1.default.connection.readyState] || 'unknown'
        }
    });
});
app.post('/test-payment', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Test payment endpoint working',
        body: req.body
    });
});
app.get('/metrics', (req, res) => {
    if (process.env.NODE_ENV === 'production' && req.headers.authorization !== `Bearer ${process.env.METRICS_TOKEN}`) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    const metrics = (0, performance_1.getPerformanceMetrics)();
    res.status(200).json({
        timestamp: new Date().toISOString(),
        metrics,
        system: {
            memory: process.memoryUsage(),
            cpu: process.cpuUsage(),
            uptime: process.uptime(),
        }
    });
});
const API_PREFIX = `/api/${process.env.API_VERSION || 'v1'}`;
app.use(`${API_PREFIX}/auth`, auth_1.default);
app.use(`${API_PREFIX}/users`, users_1.default);
app.use(`${API_PREFIX}/products`, products_1.default);
app.use(`${API_PREFIX}/orders`, orders_1.default);
app.use(`${API_PREFIX}/payments`, payments_1.default);
app.use(`${API_PREFIX}/cart`, cart_1.default);
app.use(`${API_PREFIX}/subscriptions`, subscriptions_1.default);
app.use(`${API_PREFIX}/contact`, contact_1.default);
app.use(`${API_PREFIX}/email`, email_1.default);
app.use(`${API_PREFIX}/newsletter`, newsletter_1.default);
app.use(`${API_PREFIX}/admin`, admin_1.default);
app.use(`${API_PREFIX}/analytics`, analytics_1.default);
app.use('/uploads', express_1.default.static('uploads'));
app.use(notFound_1.notFound);
app.use(errorHandler_1.errorHandler);
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    process.exit(0);
});
process.on('SIGINT', () => {
    console.log('SIGINT received. Shutting down gracefully...');
    process.exit(0);
});
app.listen(PORT, () => {
    logger_1.default.info(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
    logger_1.default.info(`📱 API available at http://localhost:${PORT}${API_PREFIX}`);
    logger_1.default.info(`🏥 Health check at http://localhost:${PORT}/health`);
    logger_1.default.info(`📊 Metrics available at http://localhost:${PORT}/metrics`);
});
exports.default = app;
//# sourceMappingURL=server.js.map