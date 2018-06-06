module.exports = {
    // Development configuration options
    db: 'mongodb://localhost/blog',
    sessionSecret: 'developmentSessionSecret',
    Redis: {
        Active: false,
        Host: "127.0.0.1",
        Port: 6379
    }
}