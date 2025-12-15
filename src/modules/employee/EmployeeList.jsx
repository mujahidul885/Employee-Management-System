import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Filter, Mail, Phone, Briefcase, Edit, Trash2 } from 'lucide-react';
import { storage, getInitials } from '../../utils/helpers';
import toast from 'react-hot-toast';

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('all');
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        loadEmployees();
        loadDepartments();
    }, []);

    useEffect(() => {
        filterEmployees();
    }, [searchTerm, departmentFilter, employees]);

    const loadEmployees = () => {
        const users = storage.get('users') || [];
        const employeeList = users.filter(u => u.role !== 'admin');
        setEmployees(employeeList);
    };

    const loadDepartments = () => {
        const depts = storage.get('departments') || [];
        setDepartments(depts);
    };

    const filterEmployees = () => {
        let filtered = [...employees];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(emp =>
                emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                emp.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                emp.designation?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Department filter
        if (departmentFilter !== 'all') {
            filtered = filtered.filter(emp => emp.department === departmentFilter);
        }

        setFilteredEmployees(filtered);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            const users = storage.get('users') || [];
            const updatedUsers = users.filter(u => u.id !== id);
            storage.set('users', updatedUsers);
            loadEmployees();
            toast.success('Employee deleted successfully');
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between" style={{ marginBottom: 'var(--spacing-xl)' }}>
                <div>
                    <h2 style={{ marginBottom: 'var(--spacing-sm)' }}>Employee Directory</h2>
                    <p className="text-muted">Manage your organization's employees</p>
                </div>
                <button className="btn btn-primary">
                    <Plus size={18} />
                    Add Employee
                </button>
            </div>

            {/* Filters */}
            <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
                <div className="grid grid-2">
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">
                            <Search size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                            Search Employees
                        </label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Search by name, email, department..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">
                            <Filter size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                            Filter by Department
                        </label>
                        <select
                            className="form-select"
                            value={departmentFilter}
                            onChange={(e) => setDepartmentFilter(e.target.value)}
                        >
                            <option value="all">All Departments</option>
                            {departments.map(dept => (
                                <option key={dept.id} value={dept.name}>{dept.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Results Count */}
            <div style={{ marginBottom: 'var(--spacing-md)' }}>
                <p className="text-sm text-muted">
                    Showing {filteredEmployees.length} of {employees.length} employees
                </p>
            </div>

            {/* Employee Grid */}
            <div className="grid grid-3">
                {filteredEmployees.map(employee => (
                    <div key={employee.id} className="card">
                        <div className="flex items-center justify-between" style={{ marginBottom: 'var(--spacing-lg)' }}>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                background: 'var(--gradient-primary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '1.5rem',
                                fontWeight: 700
                            }}>
                                {getInitials(`${employee.firstName} ${employee.lastName}`)}
                            </div>
                            <div className="flex gap-sm">
                                <button
                                    className="btn btn-sm btn-secondary"
                                    style={{ padding: '0.375rem' }}
                                    title="Edit"
                                >
                                    <Edit size={16} />
                                </button>
                                <button
                                    className="btn btn-sm btn-danger"
                                    style={{ padding: '0.375rem' }}
                                    title="Delete"
                                    onClick={() => handleDelete(employee.id)}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        <h4 style={{ marginBottom: 'var(--spacing-xs)' }}>
                            {employee.firstName} {employee.lastName}
                        </h4>
                        <p className="text-sm text-muted" style={{ marginBottom: 'var(--spacing-md)' }}>
                            {employee.designation}
                        </p>

                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 'var(--spacing-sm)',
                            marginBottom: 'var(--spacing-md)'
                        }}>
                            <div className="flex items-center gap-sm text-sm">
                                <Briefcase size={14} color="var(--neutral-500)" />
                                <span>{employee.department}</span>
                            </div>
                            <div className="flex items-center gap-sm text-sm">
                                <Mail size={14} color="var(--neutral-500)" />
                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {employee.email}
                                </span>
                            </div>
                            <div className="flex items-center gap-sm text-sm">
                                <Phone size={14} color="var(--neutral-500)" />
                                <span>{employee.phone}</span>
                            </div>
                        </div>

                        <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
                            {employee.skills?.slice(0, 3).map((skill, idx) => (
                                <span key={idx} className="badge badge-primary">
                                    {skill}
                                </span>
                            ))}
                            {employee.skills?.length > 3 && (
                                <span className="badge badge-neutral">
                                    +{employee.skills.length - 3} more
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {filteredEmployees.length === 0 && (
                <div className="card text-center" style={{ padding: 'var(--spacing-2xl)' }}>
                    <h3 style={{ color: 'var(--neutral-500)' }}>No employees found</h3>
                    <p className="text-muted">Try adjusting your search or filters</p>
                </div>
            )}
        </div>
    );
};

export default EmployeeList;
