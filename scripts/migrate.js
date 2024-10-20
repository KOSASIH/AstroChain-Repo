// scripts/migrate.js

const fs = require('fs');
const path = require('path');

class Migrator {
    constructor(migrationsDir) {
        this.migrationsDir = migrationsDir;
        this.appliedMigrations = new Set();
    }

    async migrate() {
        const migrationFiles = this.getMigrationFiles();
        for (const file of migrationFiles) {
            if (!this.appliedMigrations.has(file)) {
                try {
                    await this.applyMigration(file);
                    this.appliedMigrations.add(file);
                    console.log(`Migration ${file} applied successfully.`);
                } catch (error) {
                    console.error(`Failed to apply migration ${file}: ${error.message}`);
                }
            }
        }
    }

    async rollback() {
        const migrationFiles = Array.from(this.appliedMigrations);
        for (const file of migrationFiles.reverse()) {
            try {
                await this.revertMigration(file);
                this.appliedMigrations.delete(file);
                console.log(`Migration ${file} rolled back successfully.`);
            } catch (error) {
                console.error(`Failed to rollback migration ${file}: ${error.message}`);
            }
        }
    }

    getMigrationFiles() {
        return fs.readdirSync(this.migrationsDir).filter(file => file.endsWith('.js'));
    }

    async applyMigration(file) {
        const migration = require(path.join(this.migrationsDir, file));
        await migration.up();
    }

    async revertMigration(file) {
        const migration = require(path.join(this.migrationsDir, file));
        await migration.down();
    }
}

module.exports = Migrator;
