module.exports = {
  apps : [{
    name: 'pm2demo',
    script: './bin/www'
  }],
  deploy : {
    serverall : {
      user : 'root',
      host : ['101.132.46.123'],
      ref  : 'origin/master',
      repo : 'git@github.com:knife1/airTMC.git',
      path : '/node/pm2-deploy-demo',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env serverall'
    },
    updateInstall : {
      user : 'root',
      host : ['101.132.46.123'],
      ref  : 'origin/master',
      repo : 'git@github.com:knife1/airTMC.git',
      path : '/node/pm2-deploy-demo',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env server182'
    },
    update : {
      user : 'root',
      host : ['101.132.46.123'],
      ref  : 'origin/master',
      repo : 'git@github.com:knife1/airTMC.git',
      path : '/node/pm2-deploy-demo',
      'post-deploy' : 'pm2 reload ecosystem.config.js --env server115'
    },
  }
};
