// scripts/migrate.test.js

const Migrator = require('./migrate');
const fs = require('fs');
const path = require('path');

jest.mock('fs');

describe('Migrator', () => {
    let migrator;
    const migrationsDir = './migrations';

    beforeEach(() => {
        migrator = new Migrator(migrationsDir);
        fs.readdirSync.mockReturnValue(['001_initial.js', '002_add_users.js']);
    });

    test('should apply migrations', async () => {
        const migrationMock = {
            up: jest.fn().mockResolvedValue(),
            down: jest.fn().mockResolvedValue(),
        };

        jest.mock(path.join(migrationsDir, '001_initial.js'), () => migrationMock);
        jest.mock(path.join(migrationsDir, '002_add_users.js'), () => migrationMock);

        await migrator.migrate();
        expect(migrationMock.up).toHaveBeenCalledTimes(2);
        expect(migrator.appliedMigrations.size).toBe(2);
    });

    test('should rollback migrations', async () => {
        const migrationMock = {
            up: jest.fn().mockResolvedValue(),
            down: jest.fn().mockResolvedValue(),
        };

        jest.mock(path.join(migrationsDir, '001_initial.js'), () => migrationMock);
        jest.mock(path.join(migrationsDir, '002_add_users.js'), () => migrationMock);

        await migrator.migrate();
        await migrator.rollback();
        expect(migrationMock.down).toHaveBeenCalledTimes(2);
        expect(migrator.appliedMigrations.size).toBe(0);
    });

    test('should handle migration application errors', async () => {
        const migrationMock = {
            up: jest.fn().mockRejectedValue(new Error('Migration failed')),
            down: jest.fn().mockResolvedValue(),
        };

        jest.mock(path.join(migrationsDir, '001_initial.js'), () => migrationMock);

        await migrator.migrate();
        expect(migrationMock.up).toHaveBeenCalled();
        expect(migrator.appliedMigrations.size).toBe(0);
    });

    test('should handle rollback errors', async () => {
        const migrationMock = {
            up: jest.fn().mockResolvedValue(),
            down: jest.fn().mockRejectedValue(new Error('Rollback failed')),
        };

        jest.mock(path.join(migrationsDir, '001_initial.js'), () => migrationMock);

        await migrator.migrate();
        await migrator.rollback();
        expect(migrationMock.down).toHaveBeenCalled();
        expect(migrator.appliedMigrations.size).toBe(0);
    });
});
`` `

### Explanation of the Code:

1. **Migrator Class**:
   - The `migrate.js` file defines a `Migrator` class that manages database migrations.
   - The constructor takes a migrations directory parameter and initializes an empty set to track applied migrations.
   - The `migrate` method applies pending migrations, and the `rollback` method reverts applied migrations.
   - The `getMigrationFiles` method retrieves a list of migration files from the specified directory.
   - The `applyMigration` and `revertMigration` methods execute the `up` and `down` functions of individual migrations, respectively.

2. **Testing**:
   - The `migrate.test.js` file contains tests for the `Migrator` class using Jest.
   - It mocks the file system and migration functions to isolate the testing environment.
   - Tests cover successful migration application, rollback, and error handling scenarios.
   - The tests ensure that the `Migrator` class behaves as expected in various situations.

These files provide a robust migration system with error handling and testing capabilities, suitable for a high-tech interstellar project. If you need further enhancements or additional features, feel free to ask!
