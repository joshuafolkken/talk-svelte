const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '.env') })

module.exports = {
	apps: [
		{
			name: 'talk-svelte',
			script: 'build/index.js',
			// interpreter: 'node',
			instances: 'max',
			exec_mode: 'cluster',
			env: {
				// NODE_ENV: 'production',
				PORT: 3000,
				DATABASE_URL: process.env.DATABASE_URL,
			},
			error_file: './logs/err.log',
			out_file: './logs/out.log',
			log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
			merge_logs: true,
			autorestart: true,
			watch: false,
			max_memory_restart: '1G',
		},
	],
}
