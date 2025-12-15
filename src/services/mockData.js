import { storage, generateId } from '../utils/helpers';
import { DEPARTMENTS, DESIGNATIONS, SKILLS, ROLES } from '../constants';

// Initialize mock data
export const initializeMockData = () => {
    // Check if data already exists
    if (storage.get('users')) {
        return;
    }

    // Create admin user
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

    // Create sample employees
    const employees = [
        {
            id: generateId(),
            email: 'john.doe@hrms.com',
            password: 'employee123',
            role: ROLES.EMPLOYEE,
            firstName: 'John',
            lastName: 'Doe',
            phone: '9876543211',
            department: 'Engineering',
            designation: 'Senior Software Engineer',
            dateOfBirth: '1990-03-20',
            joiningDate: '2021-06-15',
            skills: ['JavaScript', 'React', 'Node.js'],
            avatar: null,
            emergencyContact: {
                name: 'Jane Doe',
                relationship: 'Spouse',
                phone: '9876543212'
            },
            address: {
                street: '123 Main St',
                city: 'Mumbai',
                state: 'Maharashtra',
                pincode: '400001'
            },
            salary: {
                basic: 50000,
                hra: 20000,
                transport: 5000,
                medical: 3000
            }
        },
        {
            id: generateId(),
            email: 'sarah.smith@hrms.com',
            password: 'employee123',
            role: ROLES.MANAGER,
            firstName: 'Sarah',
            lastName: 'Smith',
            phone: '9876543213',
            department: 'Engineering',
            designation: 'Engineering Manager',
            dateOfBirth: '1988-07-12',
            joiningDate: '2020-03-10',
            skills: ['Leadership', 'Project Management', 'JavaScript'],
            avatar: null,
            emergencyContact: {
                name: 'Mike Smith',
                relationship: 'Spouse',
                phone: '9876543214'
            }
        },
        {
            id: generateId(),
            email: 'mike.wilson@hrms.com',
            password: 'employee123',
            role: ROLES.EMPLOYEE,
            firstName: 'Mike',
            lastName: 'Wilson',
            phone: '9876543215',
            department: 'Marketing',
            designation: 'Marketing Manager',
            dateOfBirth: '1992-11-05',
            joiningDate: '2022-01-20',
            skills: ['Marketing Strategy', 'Communication', 'Data Analysis'],
            avatar: null
        },
        {
            id: generateId(),
            email: 'emily.brown@hrms.com',
            password: 'employee123',
            role: ROLES.EMPLOYEE,
            firstName: 'Emily',
            lastName: 'Brown',
            phone: '9876543216',
            department: 'Finance',
            designation: 'Finance Manager',
            dateOfBirth: '1989-02-28',
            joiningDate: '2021-09-01',
            skills: ['Data Analysis', 'Problem Solving'],
            avatar: null
        },
        {
            id: generateId(),
            email: 'david.lee@hrms.com',
            password: 'employee123',
            role: ROLES.EMPLOYEE,
            firstName: 'David',
            lastName: 'Lee',
            phone: '9876543217',
            department: 'Engineering',
            designation: 'Software Engineer',
            dateOfBirth: '1995-09-18',
            joiningDate: '2023-02-15',
            skills: ['Python', 'Java', 'SQL'],
            avatar: null
        }
    ];

    const allUsers = [adminUser, ...employees];
    storage.set('users', allUsers);

    // Initialize company settings
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

    // Initialize departments
    storage.set('departments', DEPARTMENTS.map(dept => ({
        id: generateId(),
        name: dept,
        createdAt: new Date().toISOString()
    })));

    // Initialize designations
    storage.set('designations', DESIGNATIONS.map(desig => ({
        id: generateId(),
        name: desig,
        createdAt: new Date().toISOString()
    })));

    // Initialize leave balances for all employees
    const leaveBalances = allUsers
        .filter(u => u.role !== ROLES.ADMIN)
        .map(user => ({
            userId: user.id,
            sick: 12,
            casual: 12,
            paid: 18,
            unpaid: 0
        }));
    storage.set('leaveBalances', leaveBalances);

    // Initialize holidays for 2025
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

    // Initialize empty arrays for other data
    storage.set('attendance', []);
    storage.set('leaveRequests', []);
    storage.set('shifts', []);
    storage.set('expenses', []);
    storage.set('jobPostings', []);
    storage.set('candidates', []);
    storage.set('courses', []);
    storage.set('auditLogs', []);

    console.log('Mock data initialized successfully!');
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
