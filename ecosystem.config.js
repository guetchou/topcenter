
module.exports = {
  apps: [
    {
      name: 'topcenter-frontend',
      script: 'serve',
      args: '-s public -l 9000',
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
        PORT: 9000,
      },
      watch: false,
      max_memory_restart: '500M',
      max_restarts: 10,
      restart_delay: 5000,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log',
      merge_logs: true,
    },
  ],
};
