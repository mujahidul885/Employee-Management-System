import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Plus, CheckCircle, XCircle, Clock } from 'lucide-react';
import { storage, formatDate, daysBetween } from '../../utils/helpers';
import { LEAVE_TYPES, LEAVE_STATUS } from '../../constants';
import toast from 'react-hot-toast';

const LeavePage = () => {
    const { user } = useAuth();
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [leaveBalance, setLeaveBalance] = useState({});
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        type: 'sick',
        startDate: '',
        endDate: '',
        reason: ''
    });

    useEffect(() => {
        loadLeaveData();
    }, []);

    const loadLeaveData = () => {
        // Load leave requests
        const allRequests = storage.get('leaveRequests') || [];
        const userRequests = allRequests.filter(r => r.userId === user.id);
        setLeaveRequests(userRequests);

        // Load leave balance
        const balances = storage.get('leaveBalances') || [];
        const userBalance = balances.find(b => b.userId === user.id) || {
            sick: 12,
            casual: 12,
            paid: 18,
            unpaid: 0
        };
        setLeaveBalance(userBalance);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.startDate || !formData.endDate) {
            toast.error('Please select start and end dates');
            return;
        }

        if (new Date(formData.startDate) > new Date(formData.endDate)) {
            toast.error('End date must be after start date');
            return;
        }

        const days = daysBetween(formData.startDate, formData.endDate) + 1;

        // Check balance
        if (leaveBalance[formData.type] < days) {
            toast.error(`Insufficient ${formData.type} leave balance`);
            return;
        }

        const newRequest = {
            id: Date.now().toString(),
            userId: user.id,
            userName: `${user.firstName} ${user.lastName}`,
            type: formData.type,
            startDate: formData.startDate,
            endDate: formData.endDate,
            days: days,
            reason: formData.reason,
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        const allRequests = storage.get('leaveRequests') || [];
        allRequests.push(newRequest);
        storage.set('leaveRequests', allRequests);

        setFormData({
            type: 'sick',
            startDate: '',
            endDate: '',
            reason: ''
        });
        setShowForm(false);
        loadLeaveData();
        toast.success('Leave request submitted successfully');
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: 'badge-warning',
            approved: 'badge-success',
            rejected: 'badge-danger'
        };
        return badges[status] || 'badge-neutral';
    };

    return (
        <div>
            <div className="flex items-center justify-between" style={{ marginBottom: 'var(--spacing-xl)' }}>
                <div>
                    <h2 style={{ marginBottom: 'var(--spacing-sm)' }}>Leave Management</h2>
                    <p className="text-muted">Manage your leave requests and balance</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowForm(!showForm)}
                >
                    <Plus size={18} />
                    Apply for Leave
                </button>
            </div>

            {/* Leave Balance Cards */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: 'var(--spacing-lg)',
                    marginBottom: 'var(--spacing-xl)'
                }}
            >
                <div className="card">
                    <div className="flex items-center gap-md">
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: 'var(--radius-lg)',
                            background: '#fee2e2',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Calendar size={24} color="var(--danger-500)" />
                        </div>
                        <div>
                            <h3 style={{ margin: 0 }}>{leaveBalance.sick || 0}</h3>
                            <p className="text-sm text-muted" style={{ margin: 0 }}>Sick Leave</p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center gap-md">
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: 'var(--radius-lg)',
                            background: '#fef3c7',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Calendar size={24} color="var(--warning-500)" />
                        </div>
                        <div>
                            <h3 style={{ margin: 0 }}>{leaveBalance.casual || 0}</h3>
                            <p className="text-sm text-muted" style={{ margin: 0 }}>Casual Leave</p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center gap-md">
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: 'var(--radius-lg)',
                            background: '#d1fae5',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Calendar size={24} color="var(--success-500)" />
                        </div>
                        <div>
                            <h3 style={{ margin: 0 }}>{leaveBalance.paid || 0}</h3>
                            <p className="text-sm text-muted" style={{ margin: 0 }}>Paid Leave</p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center gap-md">
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: 'var(--radius-lg)',
                            background: 'var(--neutral-100)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Calendar size={24} color="var(--neutral-500)" />
                        </div>
                        <div>
                            <h3 style={{ margin: 0 }}>{leaveBalance.unpaid || 0}</h3>
                            <p className="text-sm text-muted" style={{ margin: 0 }}>Unpaid Leave</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Leave Application Form */}
            {showForm && (
                <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
                    <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Apply for Leave</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-2">
                            <div className="form-group">
                                <label className="form-label">Leave Type</label>
                                <select
                                    className="form-select"
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    required
                                >
                                    <option value="sick">Sick Leave</option>
                                    <option value="casual">Casual Leave</option>
                                    <option value="paid">Paid Leave</option>
                                    <option value="unpaid">Unpaid Leave</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Available Balance</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={`${leaveBalance[formData.type] || 0} days`}
                                    readOnly
                                    style={{ background: 'var(--neutral-100)' }}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Start Date</label>
                                <input
                                    type="date"
                                    className="form-input"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">End Date</label>
                                <input
                                    type="date"
                                    className="form-input"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Reason</label>
                            <textarea
                                className="form-textarea"
                                value={formData.reason}
                                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                placeholder="Enter reason for leave..."
                                required
                            />
                        </div>

                        <div className="flex gap-md justify-end">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => setShowForm(false)}
                            >
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Submit Request
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Leave Requests History */}
            <div className="card">
                <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Leave Requests</h3>

                {leaveRequests.length > 0 ? (
                    <div style={{ overflowX: 'auto' }}>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Type</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th>Days</th>
                                    <th>Reason</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaveRequests.slice().reverse().map(request => (
                                    <tr key={request.id}>
                                        <td>
                                            <span className="badge badge-primary">
                                                {request.type}
                                            </span>
                                        </td>
                                        <td>{formatDate(request.startDate)}</td>
                                        <td>{formatDate(request.endDate)}</td>
                                        <td>{request.days}</td>
                                        <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {request.reason}
                                        </td>
                                        <td>
                                            <span className={`badge ${getStatusBadge(request.status)}`}>
                                                {request.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center text-muted">No leave requests found</p>
                )}
            </div>
        </div>
    );
};

export default LeavePage;
