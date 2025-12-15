import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Receipt, Upload, DollarSign, Plus, CheckCircle, XCircle, Clock } from 'lucide-react';
import { storage, formatDate, formatCurrency } from '../../utils/helpers';
import toast from 'react-hot-toast';

const ExpensesPage = () => {
    const { user } = useAuth();
    const [expenses, setExpenses] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        category: 'travel',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        receipt: null
    });

    const categories = [
        { id: 'travel', name: 'Travel', icon: '✈️' },
        { id: 'food', name: 'Food & Meals', icon: '🍽️' },
        { id: 'accommodation', name: 'Accommodation', icon: '🏨' },
        { id: 'office_supplies', name: 'Office Supplies', icon: '📎' },
        { id: 'other', name: 'Other', icon: '📋' }
    ];

    useEffect(() => {
        loadExpenses();
    }, []);

    const loadExpenses = () => {
        const allExpenses = storage.get('expenses') || [];
        const userExpenses = allExpenses.filter(e => e.userId === user.id);
        setExpenses(userExpenses);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.amount || !formData.description) {
            toast.error('Please fill in all required fields');
            return;
        }

        const newExpense = {
            id: Date.now().toString(),
            userId: user.id,
            userName: `${user.firstName} ${user.lastName}`,
            category: formData.category,
            amount: parseFloat(formData.amount),
            date: formData.date,
            description: formData.description,
            receipt: formData.receipt,
            status: 'pending',
            submittedAt: new Date().toISOString()
        };

        const allExpenses = storage.get('expenses') || [];
        allExpenses.push(newExpense);
        storage.set('expenses', allExpenses);

        setFormData({
            category: 'travel',
            amount: '',
            date: new Date().toISOString().split('T')[0],
            description: '',
            receipt: null
        });
        setShowForm(false);
        loadExpenses();
        toast.success('Expense claim submitted successfully');
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('File size must be less than 5MB');
                return;
            }
            setFormData({ ...formData, receipt: file.name });
            toast.success('Receipt uploaded');
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: { class: 'badge-warning', icon: Clock },
            approved: { class: 'badge-success', icon: CheckCircle },
            rejected: { class: 'badge-danger', icon: XCircle },
            paid: { class: 'badge-primary', icon: DollarSign }
        };
        return badges[status] || badges.pending;
    };

    const getCategoryIcon = (categoryId) => {
        const category = categories.find(c => c.id === categoryId);
        return category ? category.icon : '📋';
    };

    const totalPending = expenses
        .filter(e => e.status === 'pending')
        .reduce((sum, e) => sum + e.amount, 0);

    const totalApproved = expenses
        .filter(e => e.status === 'approved' || e.status === 'paid')
        .reduce((sum, e) => sum + e.amount, 0);

    return (
        <div>
            <div className="flex items-center justify-between" style={{ marginBottom: 'var(--spacing-xl)' }}>
                <div>
                    <h2 style={{ marginBottom: 'var(--spacing-sm)' }}>Expenses & Claims</h2>
                    <p className="text-muted">Submit and track your expense reimbursements</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowForm(!showForm)}
                >
                    <Plus size={18} />
                    New Claim
                </button>
            </div>

            {/* Summary Cards */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
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
                            background: '#fef3c7',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Clock size={24} color="var(--warning-500)" />
                        </div>
                        <div>
                            <h3 style={{ margin: 0 }}>{formatCurrency(totalPending)}</h3>
                            <p className="text-sm text-muted" style={{ margin: 0 }}>Pending Claims</p>
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
                            <CheckCircle size={24} color="var(--success-500)" />
                        </div>
                        <div>
                            <h3 style={{ margin: 0 }}>{formatCurrency(totalApproved)}</h3>
                            <p className="text-sm text-muted" style={{ margin: 0 }}>Approved</p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center gap-md">
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: 'var(--radius-lg)',
                            background: 'var(--primary-50)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Receipt size={24} color="var(--primary-600)" />
                        </div>
                        <div>
                            <h3 style={{ margin: 0 }}>{expenses.length}</h3>
                            <p className="text-sm text-muted" style={{ margin: 0 }}>Total Claims</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Expense Form */}
            {showForm && (
                <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
                    <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Submit Expense Claim</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-2">
                            <div className="form-group">
                                <label className="form-label">Category</label>
                                <select
                                    className="form-select"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                >
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.icon} {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Amount (₹)</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    placeholder="0.00"
                                    step="0.01"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Date</label>
                                <input
                                    type="date"
                                    className="form-input"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Receipt Upload</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="file"
                                        accept="image/*,.pdf"
                                        onChange={handleFileUpload}
                                        style={{ display: 'none' }}
                                        id="receipt-upload"
                                    />
                                    <label
                                        htmlFor="receipt-upload"
                                        className="btn btn-secondary"
                                        style={{ width: '100%', cursor: 'pointer' }}
                                    >
                                        <Upload size={18} />
                                        {formData.receipt || 'Upload Receipt'}
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea
                                className="form-textarea"
                                placeholder="Describe the expense..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                                Submit Claim
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Expenses List */}
            <div className="card">
                <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Expense History</h3>

                {expenses.length > 0 ? (
                    <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                        <table className="table" style={{ minWidth: '700px' }}>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Category</th>
                                    <th>Description</th>
                                    <th>Amount</th>
                                    <th>Receipt</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {expenses.slice().reverse().map(expense => {
                                    const statusBadge = getStatusBadge(expense.status);
                                    const StatusIcon = statusBadge.icon;

                                    return (
                                        <tr key={expense.id}>
                                            <td>{formatDate(expense.date)}</td>
                                            <td>
                                                <span>
                                                    {getCategoryIcon(expense.category)} {categories.find(c => c.id === expense.category)?.name}
                                                </span>
                                            </td>
                                            <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {expense.description}
                                            </td>
                                            <td className="font-semibold">{formatCurrency(expense.amount)}</td>
                                            <td>
                                                {expense.receipt ? (
                                                    <span className="badge badge-neutral">
                                                        <Receipt size={12} />
                                                        Attached
                                                    </span>
                                                ) : (
                                                    <span className="text-muted text-sm">No receipt</span>
                                                )}
                                            </td>
                                            <td>
                                                <span className={`badge ${statusBadge.class}`}>
                                                    <StatusIcon size={12} />
                                                    {expense.status}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center" style={{ padding: 'var(--spacing-2xl)' }}>
                        <Receipt size={48} color="var(--neutral-400)" style={{ margin: '0 auto var(--spacing-md)' }} />
                        <h4 style={{ color: 'var(--neutral-500)' }}>No expense claims yet</h4>
                        <p className="text-muted">Submit your first expense claim to get reimbursed</p>
                        <button
                            className="btn btn-primary mt-lg"
                            onClick={() => setShowForm(true)}
                        >
                            <Plus size={18} />
                            Submit First Claim
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExpensesPage;
