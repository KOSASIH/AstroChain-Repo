// tools/compliance-checker.test.js

const ComplianceChecker = require('./compliance-checker');

describe('ComplianceChecker', () => {
    let complianceChecker;

    beforeEach(() => {
        complianceChecker = new ComplianceChecker();
    });

    test('should check mining compliance correctly', () => {
        const operation = {
            hasMiningLicense: true,
            safetyProtocols: true,
            environmentalImpactAssessment: true,
            isReportingOnTime: true,
        };

        const complianceResults = complianceChecker.checkMiningCompliance(operation);
        expect(complianceResults).toEqual({
            miningLicense: true,
            safetyStandards: true,
            environmentalProtection: true,
            reporting: true,
        });
    });

    test('should check environmental compliance correctly', () => {
        const operation = {
            emissionLevels: 80,
            wasteManagementPlan: true,
            biodiversityImpactAssessment: true,
        };

        const complianceResults = complianceChecker.checkEnvironmentalCompliance(operation);
        expect(complianceResults).toEqual({
            emissionLimits: true,
            wasteManagement: true,
            biodiversityProtection: true,
        });
    });

    test('should fail if mining license is missing', () => {
        const operation = {
            hasMiningLicense: false,
            safetyProtocols: true,
            environmentalImpactAssessment: true,
            isReportingOnTime: true,
        };

        const complianceResults = complianceChecker.checkMiningCompliance(operation);
        expect(complianceResults.miningLicense).toBe(false);
    });

    test('should fail if emission levels exceed limits', () => {
        const operation = {
            emissionLevels: 150,
            wasteManagementPlan: true,
            biodiversityImpactAssessment: true,
        };

        const complianceResults = complianceChecker.checkEnvironmentalCompliance(operation);
        expect(complianceChecker.checkEmissionLimits(operation)).toBe(false);
    });
});
