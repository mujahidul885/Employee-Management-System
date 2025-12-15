import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Target, TrendingUp, Star, Plus, Award } from 'lucide-react';
import { storage } from '../../utils/helpers';
import toast from 'react-hot-toast';

const PerformancePage = () => {
    const { user } = useAuth();
    const [goals, setGoals] = useState([]);
    const [kpis, setKpis] = useState([]);
    const [showGoalForm, setShowGoalForm] = useState(false);
    const [goalForm, setGoalForm] = useState({
        title: '',
        description: '',
        targetDate: '',
        progress: 0
    });

    useEffect(() => {
        loadPerformanceData();
    }, []);

    const loadPerformanceData = () => {
        const allGoals = storage.get('goals') || [];
        const userGoals = allGoals.filter(g => g.userId === user.id);
        setGoals(userGoals);

        const allKpis = storage.get('kpis') || [];
        const userKpis = allKpis.filter(k => k.userId === user.id);
        setKpis(userKpis);
    };

    const handleAddGoal = () => {
        if (!goalForm.title || !goalForm.targetDate) {
            toast.error('Please fill in all required fields');
            return;
        }

        const newGoal = {
            id: Date.now().toString(),
            userId: user.id,
            userName: `${user.firstName} ${user.lastName}`,
            title: goalForm.title,
            description: goalForm.description,
            targetDate: goalForm.targetDate,
            progress: 0,
            status: 'in_progress',
            createdAt: new Date().toISOString()
        };

        const allGoals = storage.get('goals') || [];
        allGoals.push(newGoal);
        storage.set('goals', allGoals);

        setGoalForm({
            title: '',
            description: '',
            targetDate: '',
            progress: 0
        });
        setShowGoalForm(false);
        loadPerformanceData();
        toast.success('Goal added successfully');
    };

    const updateGoalProgress = (goalId, newProgress) => {
        const allGoals = storage.get('goals') || [];
        const updatedGoals = allGoals.map(g => {
            if (g.id === goalId) {
                return {
                    ...g,
                    progress: newProgress,
                    status: newProgress >= 100 ? 'completed' : 'in_progress'
                };
            }
            return g;
        });

        storage.set('goals', updatedGoals);
        loadPerformanceData();
        toast.success('Progress updated');
    };

    const getProgressColor = (progress) => {
        if (progress >= 75) return 'var(--success-500)';
        if (progress >= 50) return 'var(--primary-500)';
        if (progress >= 25) return 'var(--warning-500)';
        return 'var(--danger-500)';
    };

    // Sample KPIs for demonstration
    const sampleKPIs = [
        { name: 'Project Completion Rate', current: 85, target: 90, unit: '%' },
        { name: 'Customer Satisfaction', current: 4.5, target: 4.8, unit: '/5' },
        { name: 'Code Quality Score', current: 92, target: 95, unit: '%' },
        { name: 'Team Collaboration', current: 88, target: 90, unit: '%' }
    ];

    return (
        <div>
            <div className="flex items-center justify-between" style={{ marginBottom: 'var(--spacing-xl)' }}>
                <div>
                    <h2 style={{ marginBottom: 'var(--spacing-sm)' }}>Performance Management</h2>
                    <p className="text-muted">Track your goals, KPIs, and performance metrics</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowGoalForm(!showGoalForm)}
                >
                    <Plus size={18} />
                    Add Goal
                </button>
            </div>

            {/* KPI Cards */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: 'var(--spacing-lg)',
                    marginBottom: 'var(--spacing-xl)'
                }}
            >
                {sampleKPIs.map((kpi, index) => {
                    const achievement = (kpi.current / kpi.target) * 100;
                    return (
                        <div key={index} className="card">
                            <div className="flex items-center gap-md" style={{ marginBottom: 'var(--spacing-md)' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: 'var(--radius-lg)',
                                    background: achievement >= 100 ? '#d1fae5' : 'var(--primary-50)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Target size={20} color={achievement >= 100 ? 'var(--success-500)' : 'var(--primary-600)'} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ margin: 0, fontSize: '0.875rem' }}>{kpi.name}</h4>
                                </div>
                            </div>

                            <div className="flex items-center justify-between" style={{ marginBottom: 'var(--spacing-sm)' }}>
                                <span style={{ fontSize: '1.5rem', fontWeight: 700, color: getProgressColor(achievement) }}>
                                    {kpi.current}{kpi.unit}
                                </span>
                                <span className="text-sm text-muted">
                                    Target: {kpi.target}{kpi.unit}
                                </span>
                            </div>

                            <div style={{
                                width: '100%',
                                height: '6px',
                                background: 'var(--neutral-200)',
                                borderRadius: 'var(--radius-full)',
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    width: `${Math.min(achievement, 100)}%`,
                                    height: '100%',
                                    background: getProgressColor(achievement),
                                    transition: 'width var(--transition-base)'
                                }}></div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Add Goal Form */}
            {showGoalForm && (
                <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
                    <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Add New Goal</h3>
                    <div className="grid grid-2">
                        <div className="form-group">
                            <label className="form-label">Goal Title</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="e.g., Complete React certification"
                                value={goalForm.title}
                                onChange={(e) => setGoalForm({ ...goalForm, title: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Target Date</label>
                            <input
                                type="date"
                                className="form-input"
                                value={goalForm.targetDate}
                                onChange={(e) => setGoalForm({ ...goalForm, targetDate: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea
                            className="form-textarea"
                            placeholder="Describe your goal..."
                            value={goalForm.description}
                            onChange={(e) => setGoalForm({ ...goalForm, description: e.target.value })}
                        />
                    </div>

                    <div className="flex gap-md justify-end">
                        <button
                            className="btn btn-secondary"
                            onClick={() => setShowGoalForm(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={handleAddGoal}
                        >
                            Add Goal
                        </button>
                    </div>
                </div>
            )}

            {/* Goals Section */}
            <div className="card">
                <div className="flex items-center justify-between" style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <h3 style={{ margin: 0 }}>My Goals</h3>
                    <span className="badge badge-primary">
                        {goals.filter(g => g.status === 'completed').length} / {goals.length} Completed
                    </span>
                </div>

                {goals.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                        {goals.map(goal => (
                            <div
                                key={goal.id}
                                style={{
                                    padding: 'var(--spacing-lg)',
                                    background: 'var(--neutral-50)',
                                    borderRadius: 'var(--radius-lg)',
                                    borderLeft: `4px solid ${getProgressColor(goal.progress)}`
                                }}
                            >
                                <div className="flex items-start justify-between" style={{ marginBottom: 'var(--spacing-md)' }}>
                                    <div style={{ flex: 1 }}>
                                        <div className="flex items-center gap-md" style={{ marginBottom: 'var(--spacing-sm)' }}>
                                            <h4 style={{ margin: 0 }}>{goal.title}</h4>
                                            {goal.status === 'completed' && (
                                                <span className="badge badge-success">
                                                    <Award size={12} />
                                                    Completed
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted" style={{ margin: 0 }}>
                                            {goal.description}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-muted" style={{ margin: 0 }}>
                                            Target: {new Date(goal.targetDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                <div style={{ marginBottom: 'var(--spacing-sm)' }}>
                                    <div className="flex items-center justify-between" style={{ marginBottom: 'var(--spacing-xs)' }}>
                                        <span className="text-sm font-semibold">Progress</span>
                                        <span className="text-sm font-semibold" style={{ color: getProgressColor(goal.progress) }}>
                                            {goal.progress}%
                                        </span>
                                    </div>
                                    <div style={{
                                        width: '100%',
                                        height: '8px',
                                        background: 'var(--neutral-200)',
                                        borderRadius: 'var(--radius-full)',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{
                                            width: `${goal.progress}%`,
                                            height: '100%',
                                            background: getProgressColor(goal.progress),
                                            transition: 'width var(--transition-base)'
                                        }}></div>
                                    </div>
                                </div>

                                {goal.status !== 'completed' && (
                                    <div className="flex gap-sm">
                                        <button
                                            className="btn btn-sm btn-secondary"
                                            onClick={() => updateGoalProgress(goal.id, Math.min(goal.progress + 25, 100))}
                                        >
                                            +25%
                                        </button>
                                        <button
                                            className="btn btn-sm btn-secondary"
                                            onClick={() => updateGoalProgress(goal.id, Math.min(goal.progress + 50, 100))}
                                        >
                                            +50%
                                        </button>
                                        <button
                                            className="btn btn-sm btn-success"
                                            onClick={() => updateGoalProgress(goal.id, 100)}
                                        >
                                            <Award size={14} />
                                            Mark Complete
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center" style={{ padding: 'var(--spacing-2xl)' }}>
                        <TrendingUp size={48} color="var(--neutral-400)" style={{ margin: '0 auto var(--spacing-md)' }} />
                        <h4 style={{ color: 'var(--neutral-500)' }}>No goals yet</h4>
                        <p className="text-muted">Set your first goal to start tracking your performance</p>
                        <button
                            className="btn btn-primary mt-lg"
                            onClick={() => setShowGoalForm(true)}
                        >
                            <Plus size={18} />
                            Add Your First Goal
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PerformancePage;
