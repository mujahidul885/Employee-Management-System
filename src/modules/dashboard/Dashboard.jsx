import { useAuth } from '../../context/AuthContext';
import { Users, Calendar, Clock, TrendingUp, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { storage } from '../../utils/helpers';
import { useEffect, useState } from 'react';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalEmployees: 0,
        presentToday: 0,
        onLeave: 0,
        pendingLeaves: 0
    });

    useEffect(() => {
        // Calculate statistics
        const users = storage.get('users') || [];
        const employees = users.filter(u => u.role !== 'admin');
        const leaveRequests = storage.get('leaveRequests') || [];
        const attendance = storage.get('attendance') || [];

        const today = new Date().toISOString().split('T')[0];
        const todayAttendance = attendance.filter(a => a.date === today);

        setStats({
            totalEmployees: employees.length,
            presentToday: todayAttendance.filter(a => a.status === 'present').length,
            onLeave: leaveRequests.filter(l => l.status === 'approved' && l.startDate <= today && l.endDate >= today).length,
            pendingLeaves: leaveRequests.filter(l => l.status === 'pending').length
        });
    }, []);

    const statCards = [
        {
            title: 'Total Employees',
            value: stats.totalEmployees,
            icon: Users,
            color: 'var(--primary-500)',
            bgColor: 'var(--primary-50)'
        },
        {
            title: 'Present Today',
            value: stats.presentToday,
            icon: CheckCircle,
            color: 'var(--success-500)',
            bgColor: '#d1fae5'
        },
        {
            title: 'On Leave',
            value: stats.onLeave,
            icon: Calendar,
            color: 'var(--warning-500)',
            bgColor: '#fef3c7'
        },
        {
            title: 'Pending Requests',
            value: stats.pendingLeaves,
            icon: AlertCircle,
            color: 'var(--danger-500)',
            bgColor: '#fee2e2'
        }
    ];

    return (
        <div>
            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                <h2 style={{ marginBottom: 'var(--spacing-sm)' }}>
                    Welcome back, {user?.firstName}! 👋
                </h2>
                <p className="text-muted">
                    Here's what's happening with your organization today.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-4" style={{ marginBottom: 'var(--spacing-2xl)' }}>
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="card">
                            <div className="flex items-center justify-between" style={{ marginBottom: 'var(--spacing-md)' }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: 'var(--radius-lg)',
                                    background: stat.bgColor,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Icon size={24} color={stat.color} />
                                </div>
                            </div>
                            <h3 style={{
                                fontSize: '2rem',
                                margin: '0 0 var(--spacing-sm) 0',
                                color: stat.color
                            }}>
                                {stat.value}
                            </h3>
                            <p className="text-sm text-muted" style={{ margin: 0 }}>
                                {stat.title}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-2">
                <div className="card">
                    <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Quick Actions</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                        {user?.role === 'admin' && (
                            <>
                                <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'flex-start' }}>
                                    <Users size={18} />
                                    Add New Employee
                                </button>
                                <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start' }}>
                                    <Calendar size={18} />
                                    View Attendance Reports
                                </button>
                            </>
                        )}
                        {user?.role !== 'admin' && (
                            <>
                                <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'flex-start' }}>
                                    <Clock size={18} />
                                    Apply for Leave
                                </button>
                                <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start' }}>
                                    <Calendar size={18} />
                                    Check In / Out
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="card">
                    <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Recent Activity</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                        <div style={{
                            padding: 'var(--spacing-md)',
                            background: 'var(--neutral-50)',
                            borderRadius: 'var(--radius-md)',
                            borderLeft: '4px solid var(--success-500)'
                        }}>
                            <p className="text-sm font-semibold" style={{ margin: 0 }}>
                                Leave Approved
                            </p>
                            <p className="text-sm text-muted" style={{ margin: 0 }}>
                                Your leave request has been approved
                            </p>
                        </div>
                        <div style={{
                            padding: 'var(--spacing-md)',
                            background: 'var(--neutral-50)',
                            borderRadius: 'var(--radius-md)',
                            borderLeft: '4px solid var(--primary-500)'
                        }}>
                            <p className="text-sm font-semibold" style={{ margin: 0 }}>
                                New Training Available
                            </p>
                            <p className="text-sm text-muted" style={{ margin: 0 }}>
                                React Advanced Patterns course is now available
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
