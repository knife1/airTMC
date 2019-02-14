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
    server182 : {
      user : 'tomcat',
      host : ['192.168.1.182'],
      ref  : 'origin/master',
      repo : 'git@github.com:MeedFine/pm2-deploy-demo.git',
      path : '/node/pm2-deploy-demo',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env server182'
    },
    server115 : {
      user : 'tomcat',
      host : ['192.168.1.115'],
      ref  : 'origin/master',
      repo : 'git@github.com:MeedFine/pm2-deploy-demo.git',
      path : '/node/pm2-deploy-demo',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env server115'
    },
  }
};
