// User Roles
export const ROLES = {
    ADMIN: 'admin',
    EMPLOYEE: 'employee',
    MANAGER: 'manager',
    HR: 'hr'
};

// Leave Types
export const LEAVE_TYPES = {
    SICK: 'sick',
    CASUAL: 'casual',
    PAID: 'paid',
    UNPAID: 'unpaid'
};

// Leave Status
export const LEAVE_STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected'
};

// Attendance Status
export const ATTENDANCE_STATUS = {
    PRESENT: 'present',
    ABSENT: 'absent',
    LATE: 'late',
    HALF_DAY: 'half_day',
    ON_LEAVE: 'on_leave'
};

// Shift Types
export const SHIFT_TYPES = {
    MORNING: 'morning',
    EVENING: 'evening',
    NIGHT: 'night',
    GENERAL: 'general'
};

// Expense Status
export const EXPENSE_STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    PAID: 'paid'
};

// Expense Categories
export const EXPENSE_CATEGORIES = {
    TRAVEL: 'travel',
    FOOD: 'food',
    ACCOMMODATION: 'accommodation',
    OFFICE_SUPPLIES: 'office_supplies',
    OTHER: 'other'
};

// Recruitment Status
export const RECRUITMENT_STATUS = {
    APPLIED: 'applied',
    SCREENING: 'screening',
    INTERVIEW: 'interview',
    OFFER: 'offer',
    HIRED: 'hired',
    REJECTED: 'rejected'
};

// Performance Rating
export const PERFORMANCE_RATING = {
    EXCELLENT: 5,
    VERY_GOOD: 4,
    GOOD: 3,
    AVERAGE: 2,
    POOR: 1
};

// Departments
export const DEPARTMENTS = [
    'Engineering',
    'Human Resources',
    'Finance',
    'Marketing',
    'Sales',
    'Operations',
    'Customer Support',
    'Product Management'
];

// Designations
export const DESIGNATIONS = [
    'Software Engineer',
    'Senior Software Engineer',
    'Team Lead',
    'Engineering Manager',
    'HR Manager',
    'HR Executive',
    'Finance Manager',
    'Accountant',
    'Marketing Manager',
    'Sales Executive',
    'Product Manager',
    'Support Engineer'
];

// Skills
export const SKILLS = [
    'JavaScript',
    'React',
    'Node.js',
    'Python',
    'Java',
    'SQL',
    'Project Management',
    'Communication',
    'Leadership',
    'Problem Solving',
    'Data Analysis',
    'Marketing Strategy'
];

// Default Working Hours
export const WORKING_HOURS = {
    START: '09:00',
    END: '18:00',
    BREAK_DURATION: 60 // minutes
};

// Salary Components
export const SALARY_COMPONENTS = {
    BASIC: 'basic',
    HRA: 'hra',
    TRANSPORT: 'transport',
    MEDICAL: 'medical',
    SPECIAL: 'special',
    PF: 'pf',
    TDS: 'tds',
    ESI: 'esi'
};

// File Upload Limits
export const FILE_LIMITS = {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
};

// Pagination
export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [10, 25, 50, 100]
};

// Date Formats
export const DATE_FORMATS = {
    DISPLAY: 'dd MMM yyyy',
    DISPLAY_WITH_TIME: 'dd MMM yyyy HH:mm',
    INPUT: 'yyyy-MM-dd',
    FULL: 'EEEE, MMMM dd, yyyy'
};
