// scripts/deploy.js

const { exec } = require('child_process');

class Deployer {
    constructor(environment) {
        this.environment = environment;
        this.deployCommands = {
            development: 'npm run deploy:dev',
            staging: 'npm run deploy:staging',
            production: 'npm run deploy:prod',
        };
    }

    async deploy() {
        if (!this.deployCommands[this.environment]) {
            throw new Error(`Invalid environment: ${this.environment}`);
        }

        console.log(`Starting deployment to ${this.environment}...`);
        try {
            await this.executeCommand(this.deployCommands[this.environment]);
            console.log(`Deployment to ${this.environment} completed successfully.`);
        } catch (error) {
            console.error(`Deployment to ${this.environment} failed: ${error.message}`);
        }
    }

    executeCommand(command) {
        return new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                    return;
                }
                console.log(stdout);
                resolve(stdout);
            });
        });
    }
}

module.exports = Deployer;
