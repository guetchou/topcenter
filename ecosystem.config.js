
module.exports = {
  apps: [
    {
      name: 'topcenter-frontend',
      script: 'serve',
      args: '-s public -l 3000',
      env: {
        NODE_ENV: 'production',
      },
      watch: false,
      max_restarts: 10,
      restart_delay: 5000,
    },
    {
      name: 'topcenter-backend',
      script: './server.js',
      env: {
        NODE_ENV: 'production',
        PORT: 4000,
      },
      watch: false,
      max_memory_restart: '500M',
      max_restarts: 10,
      restart_delay: 5000,
    },
  ],
};
