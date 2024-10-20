// scripts/deploy.test.js

const Deployer = require('./deploy');
const { exec } = require('child_process');

jest.mock('child_process');

describe('Deployer', () => {
    let deployer;

    beforeEach(() => {
        deployer = new Deployer('development');
    });

    test('should deploy to the development environment', async () => {
        exec.mockImplementation((command, callback) => {
            callback(null, 'Deployment successful');
        });

        await deployer.deploy();
        expect(exec).toHaveBeenCalledWith('npm run deploy:dev', expect.any(Function));
    });

    test('should throw an error for invalid environment', async () => {
        deployer = new Deployer('invalid');

        await expect(deployer.deploy()).rejects.toThrow('Invalid environment: invalid');
    });

    test('should handle deployment failure', async () => {
        exec.mockImplementation((command, callback) => {
            callback(new Error('Deployment failed'), null);
        });

        console.error = jest.fn(); // Mock console.error

        await deployer.deploy();
        expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Deployment to development failed: Deployment failed'));
    });

    test('should deploy to the production environment', async () => {
        deployer = new Deployer('production');
        exec.mockImplementation((command, callback) => {
            callback(null, 'Deployment successful');
        });

        await deployer.deploy();
        expect(exec).toHaveBeenCalledWith('npm run deploy:prod', expect.any(Function));
    });
});
