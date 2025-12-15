import { storage, generateId } from '../utils/helpers';
import { DEPARTMENTS, DESIGNATIONS, SKILLS, ROLES } from '../constants';

// Initialize mock data
export const initializeMockData = () => {
    // Check if we've already cleaned the data for the "Remove All" request
    // If 'data_cleaned' is present, we respect the current state (persistence)
    if (storage.get('data_cleaned')) {
        return;
    }

    // --- HARD RESET START ---
    console.log('Performing Hard Data Reset...');

    // Clear all existing data keys
    const keysToClear = [
        'users', 'expenses', 'shifts', 'attendance', 'leaveRequests',
        'leaveBalances', 'jobPostings', 'candidates', 'courses', 'auditLogs'
        // We can keep companySettings, departments, designations if desired, 
        // but "Remove ALL" suggests a total wipe. 
        // I'll keep the Configs as they are usually static, but will reset Users/Transactions.
    ];

    // Actually, to be safe and thorough, let's overwrite the Users list directly 
    // rather than relying on storage.removeItem() in case we miss something.

    // 1. Create ONLY Admin User
    const adminUser = {
        id: generateId(),
        email: 'admin@hrms.com',
        password: 'admin123',
        role: ROLES.ADMIN,
        firstName: 'Admin',
        lastName: 'User',
        phone: '9876543210',
        department: 'Human Resources',
        designation: 'HR Manager',
        dateOfBirth: '1985-05-15',
        joiningDate: '2020-01-01',
        avatar: null,
        permissions: ['all']
    };

    const allUsers = [adminUser]; // NO sample employees
    storage.set('users', allUsers);

    // 2. Initialize Company Settings (Standard Defaults)
    const companySettings = {
        name: 'TechCorp Solutions',
        email: 'info@techcorp.com',
        phone: '1800-123-4567',
        address: 'Tech Park, Bangalore, Karnataka - 560001',
        workingHours: {
            start: '09:00',
            end: '18:00',
            breakDuration: 60
        },
        weekends: ['Saturday', 'Sunday'],
        logo: null
    };
    storage.set('companySettings', companySettings);

    // 3. Initialize Departments (Standard Defaults)
    storage.set('departments', DEPARTMENTS.map(dept => ({
        id: generateId(),
        name: dept,
        createdAt: new Date().toISOString()
    })));

    // 4. Initialize Designations (Standard Defaults)
    storage.set('designations', DESIGNATIONS.map(desig => ({
        id: generateId(),
        name: desig,
        createdAt: new Date().toISOString()
    })));

    // 5. Initialize Leave Balances (Admin only)
    const leaveBalances = [{
        userId: adminUser.id,
        sick: 12,
        casual: 12,
        paid: 18,
        unpaid: 0
    }];
    storage.set('leaveBalances', leaveBalances);

    // 6. Initialize Holidays (Keep these as they are useful)
    const holidays = [
        { id: generateId(), name: 'Republic Day', date: '2025-01-26', type: 'national' },
        { id: generateId(), name: 'Holi', date: '2025-03-14', type: 'festival' },
        { id: generateId(), name: 'Good Friday', date: '2025-04-18', type: 'festival' },
        { id: generateId(), name: 'Independence Day', date: '2025-08-15', type: 'national' },
        { id: generateId(), name: 'Gandhi Jayanti', date: '2025-10-02', type: 'national' },
        { id: generateId(), name: 'Diwali', date: '2025-10-20', type: 'festival' },
        { id: generateId(), name: 'Christmas', date: '2025-12-25', type: 'festival' }
    ];
    storage.set('holidays', holidays);

    // 7. Clear All Transactional Data (Empty Arrays)
    storage.set('attendance', []);
    storage.set('leaveRequests', []);
    storage.set('shifts', []);
    storage.set('expenses', []); // Already cleared previously, but ensuring it here
    storage.set('jobPostings', []);
    storage.set('candidates', []);
    storage.set('courses', []);
    storage.set('auditLogs', []);

    console.log('Data Cleaned: Admin Only mode initialized.');

    // Mark as cleaned so we don't wipe it again on next reload (allowing new data to persist)
    storage.set('data_cleaned', true);
};

// Get all users
export const getAllUsers = () => {
    return storage.get('users') || [];
};

// Get user by ID
export const getUserById = (id) => {
    const users = getAllUsers();
    return users.find(u => u.id === id);
};

// Get employees (exclude admins)
export const getEmployees = () => {
    const users = getAllUsers();
    return users.filter(u => u.role !== ROLES.ADMIN);
};
