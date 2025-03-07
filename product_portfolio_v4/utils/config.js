export default {
    port: process.env.PORT || 3000,
    dbHost: process.env.DB_HOST || 'localhost',
    dbUser: process.env.DB_USER || 'root',
    dbPassword: process.env.DB_PASSWORD || '',
    dbName: process.env.DB_NAME || 'product_portfolio_db',
    apiEndPointUrl: process.env.APIENDPOINT_URL || 'http://localhost:3000'
};
