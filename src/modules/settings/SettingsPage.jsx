import { useState, useEffect } from 'react';
import { Building2, Users, FileText, Save, Plus, Edit, Trash2 } from 'lucide-react';
import { storage, formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState('company');
    const [companySettings, setCompanySettings] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        workingHours: {
            start: '09:00',
            end: '18:00',
            breakDuration: 60
        }
    });
    const [departments, setDepartments] = useState([]);
    const [designations, setDesignations] = useState([]);
    const [auditLogs, setAuditLogs] = useState([]);
    const [showDeptForm, setShowDeptForm] = useState(false);
    const [showDesigForm, setShowDesigForm] = useState(false);
    const [newDept, setNewDept] = useState('');
    const [newDesig, setNewDesig] = useState('');

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = () => {
        const settings = storage.get('companySettings') || {};
        setCompanySettings(settings);

        const depts = storage.get('departments') || [];
        setDepartments(depts);

        const desigs = storage.get('designations') || [];
        setDesignations(desigs);

        const logs = storage.get('auditLogs') || [];
        setAuditLogs(logs);
    };

    const handleSaveCompany = (e) => {
        e.preventDefault();
        storage.set('companySettings', companySettings);

        // Add audit log
        addAuditLog('Company settings updated');

        toast.success('Company settings saved successfully');
    };

    const handleAddDepartment = () => {
        if (!newDept.trim()) {
            toast.error('Please enter department name');
            return;
        }

        const newDepartment = {
            id: Date.now().toString(),
            name: newDept,
            createdAt: new Date().toISOString()
        };

        const updatedDepts = [...departments, newDepartment];
        storage.set('departments', updatedDepts);
        setDepartments(updatedDepts);
        setNewDept('');
        setShowDeptForm(false);

        addAuditLog(`Department added: ${newDept}`);
        toast.success('Department added successfully');
    };

    const handleDeleteDepartment = (id, name) => {
        if (window.confirm(`Are you sure you want to delete ${name}?`)) {
            const updatedDepts = departments.filter(d => d.id !== id);
            storage.set('departments', updatedDepts);
            setDepartments(updatedDepts);

            addAuditLog(`Department deleted: ${name}`);
            toast.success('Department deleted successfully');
        }
    };

    const handleAddDesignation = () => {
        if (!newDesig.trim()) {
            toast.error('Please enter designation name');
            return;
        }

        const newDesignation = {
            id: Date.now().toString(),
            name: newDesig,
            createdAt: new Date().toISOString()
        };

        const updatedDesigs = [...designations, newDesignation];
        storage.set('designations', updatedDesigs);
        setDesignations(updatedDesigs);
        setNewDesig('');
        setShowDesigForm(false);

        addAuditLog(`Designation added: ${newDesig}`);
        toast.success('Designation added successfully');
    };

    const handleDeleteDesignation = (id, name) => {
        if (window.confirm(`Are you sure you want to delete ${name}?`)) {
            const updatedDesigs = designations.filter(d => d.id !== id);
            storage.set('designations', updatedDesigs);
            setDesignations(updatedDesigs);

            addAuditLog(`Designation deleted: ${name}`);
            toast.success('Designation deleted successfully');
        }
    };

    const addAuditLog = (action) => {
        const log = {
            id: Date.now().toString(),
            action,
            timestamp: new Date().toISOString(),
            user: 'Admin User'
        };

        const logs = storage.get('auditLogs') || [];
        logs.unshift(log);
        storage.set('auditLogs', logs.slice(0, 100)); // Keep last 100 logs
        setAuditLogs(logs.slice(0, 100));
    };

    const tabs = [
        { id: 'company', label: 'Company Settings', icon: Building2 },
        { id: 'departments', label: 'Departments', icon: Users },
        { id: 'audit', label: 'Audit Logs', icon: FileText }
    ];

    return (
        <div>
            <h2 style={{ marginBottom: 'var(--spacing-xl)' }}>Settings</h2>

            {/* Tabs */}
            <div style={{
                display: 'flex',
                gap: 'var(--spacing-md)',
                marginBottom: 'var(--spacing-xl)',
                borderBottom: '2px solid var(--neutral-200)'
            }}>
                {tabs.map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--spacing-sm)',
                                padding: 'var(--spacing-md) var(--spacing-lg)',
                                background: 'none',
                                border: 'none',
                                borderBottom: activeTab === tab.id ? '3px solid var(--primary-600)' : '3px solid transparent',
                                color: activeTab === tab.id ? 'var(--primary-600)' : 'var(--neutral-600)',
                                fontWeight: activeTab === tab.id ? 600 : 400,
                                cursor: 'pointer',
                                transition: 'all var(--transition-fast)',
                                marginBottom: '-2px'
                            }}
                        >
                            <Icon size={18} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Company Settings Tab */}
            {activeTab === 'company' && (
                <div className="card">
                    <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Company Information</h3>
                    <form onSubmit={handleSaveCompany}>
                        <div className="grid grid-2">
                            <div className="form-group">
                                <label className="form-label">Company Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={companySettings.name}
                                    onChange={(e) => setCompanySettings({ ...companySettings, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-input"
                                    value={companySettings.email}
                                    onChange={(e) => setCompanySettings({ ...companySettings, email: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Phone</label>
                                <input
                                    type="tel"
                                    className="form-input"
                                    value={companySettings.phone}
                                    onChange={(e) => setCompanySettings({ ...companySettings, phone: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Address</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={companySettings.address}
                                    onChange={(e) => setCompanySettings({ ...companySettings, address: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <h4 style={{ marginTop: 'var(--spacing-xl)', marginBottom: 'var(--spacing-lg)' }}>
                            Working Hours
                        </h4>

                        <div className="grid grid-3">
                            <div className="form-group">
                                <label className="form-label">Start Time</label>
                                <input
                                    type="time"
                                    className="form-input"
                                    value={companySettings.workingHours?.start || '09:00'}
                                    onChange={(e) => setCompanySettings({
                                        ...companySettings,
                                        workingHours: { ...companySettings.workingHours, start: e.target.value }
                                    })}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">End Time</label>
                                <input
                                    type="time"
                                    className="form-input"
                                    value={companySettings.workingHours?.end || '18:00'}
                                    onChange={(e) => setCompanySettings({
                                        ...companySettings,
                                        workingHours: { ...companySettings.workingHours, end: e.target.value }
                                    })}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Break Duration (minutes)</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={companySettings.workingHours?.breakDuration || 60}
                                    onChange={(e) => setCompanySettings({
                                        ...companySettings,
                                        workingHours: { ...companySettings.workingHours, breakDuration: parseInt(e.target.value) }
                                    })}
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary mt-lg">
                            <Save size={18} />
                            Save Settings
                        </button>
                    </form>
                </div>
            )}

            {/* Departments Tab */}
            {activeTab === 'departments' && (
                <div>
                    <div className="grid grid-2">
                        {/* Departments */}
                        <div className="card">
                            <div className="flex items-center justify-between" style={{ marginBottom: 'var(--spacing-lg)' }}>
                                <h3 style={{ margin: 0 }}>Departments</h3>
                                <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => setShowDeptForm(!showDeptForm)}
                                >
                                    <Plus size={16} />
                                    Add
                                </button>
                            </div>

                            {showDeptForm && (
                                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                                    <div className="flex gap-sm">
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="Department name"
                                            value={newDept}
                                            onChange={(e) => setNewDept(e.target.value)}
                                            style={{ marginBottom: 0 }}
                                        />
                                        <button className="btn btn-primary" onClick={handleAddDepartment}>
                                            Add
                                        </button>
                                        <button className="btn btn-secondary" onClick={() => setShowDeptForm(false)}>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                                {departments.map(dept => (
                                    <div
                                        key={dept.id}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: 'var(--spacing-md)',
                                            background: 'var(--neutral-50)',
                                            borderRadius: 'var(--radius-md)'
                                        }}
                                    >
                                        <span className="font-semibold">{dept.name}</span>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            style={{ padding: '0.25rem 0.5rem' }}
                                            onClick={() => handleDeleteDepartment(dept.id, dept.name)}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Designations */}
                        <div className="card">
                            <div className="flex items-center justify-between" style={{ marginBottom: 'var(--spacing-lg)' }}>
                                <h3 style={{ margin: 0 }}>Designations</h3>
                                <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => setShowDesigForm(!showDesigForm)}
                                >
                                    <Plus size={16} />
                                    Add
                                </button>
                            </div>

                            {showDesigForm && (
                                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                                    <div className="flex gap-sm">
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="Designation name"
                                            value={newDesig}
                                            onChange={(e) => setNewDesig(e.target.value)}
                                            style={{ marginBottom: 0 }}
                                        />
                                        <button className="btn btn-primary" onClick={handleAddDesignation}>
                                            Add
                                        </button>
                                        <button className="btn btn-secondary" onClick={() => setShowDesigForm(false)}>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                                {designations.map(desig => (
                                    <div
                                        key={desig.id}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: 'var(--spacing-md)',
                                            background: 'var(--neutral-50)',
                                            borderRadius: 'var(--radius-md)'
                                        }}
                                    >
                                        <span className="font-semibold">{desig.name}</span>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            style={{ padding: '0.25rem 0.5rem' }}
                                            onClick={() => handleDeleteDesignation(desig.id, desig.name)}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Audit Logs Tab */}
            {activeTab === 'audit' && (
                <div className="card">
                    <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>System Audit Logs</h3>

                    {auditLogs.length > 0 ? (
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Timestamp</th>
                                    <th>User</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {auditLogs.map(log => (
                                    <tr key={log.id}>
                                        <td>{formatDate(log.timestamp, 'dd MMM yyyy HH:mm')}</td>
                                        <td>{log.user}</td>
                                        <td>{log.action}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-center text-muted">No audit logs available</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default SettingsPage;
