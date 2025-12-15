import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Clock, CheckCircle, XCircle, Calendar as CalendarIcon } from 'lucide-react';
import { storage, formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const AttendancePage = () => {
    const { user } = useAuth();
    const [attendance, setAttendance] = useState([]);
    const [todayAttendance, setTodayAttendance] = useState(null);
    const [stats, setStats] = useState({
        present: 0,
        absent: 0,
        late: 0
    });

    useEffect(() => {
        loadAttendance();
    }, []);

    const loadAttendance = () => {
        const allAttendance = storage.get('attendance') || [];
        const userAttendance = allAttendance.filter(a => a.userId === user.id);
        setAttendance(userAttendance);

        // Get today's attendance
        const today = new Date().toISOString().split('T')[0];
        const todayRecord = userAttendance.find(a => a.date === today);
        setTodayAttendance(todayRecord);

        // Calculate stats for current month
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const monthAttendance = userAttendance.filter(a => {
            const date = new Date(a.date);
            return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        });

        setStats({
            present: monthAttendance.filter(a => a.status === 'present').length,
            absent: monthAttendance.filter(a => a.status === 'absent').length,
            late: monthAttendance.filter(a => a.status === 'late').length
        });
    };

    const handleCheckIn = () => {
        const now = new Date();
        const today = now.toISOString().split('T')[0];
        const time = now.toTimeString().split(' ')[0];

        // Check if already checked in
        if (todayAttendance) {
            toast.error('You have already checked in today');
            return;
        }

        // Determine status (late if after 9:30 AM)
        const checkInTime = new Date(`${today}T${time}`);
        const lateThreshold = new Date(`${today}T09:30:00`);
        const status = checkInTime > lateThreshold ? 'late' : 'present';

        const newAttendance = {
            id: Date.now().toString(),
            userId: user.id,
            date: today,
            checkIn: time,
            checkOut: null,
            status: status,
            createdAt: new Date().toISOString()
        };

        const allAttendance = storage.get('attendance') || [];
        allAttendance.push(newAttendance);
        storage.set('attendance', allAttendance);

        setTodayAttendance(newAttendance);
        loadAttendance();
        toast.success(`Checked in successfully at ${time}`);
    };

    const handleCheckOut = () => {
        if (!todayAttendance) {
            toast.error('Please check in first');
            return;
        }

        if (todayAttendance.checkOut) {
            toast.error('You have already checked out today');
            return;
        }

        const now = new Date();
        const time = now.toTimeString().split(' ')[0];

        const allAttendance = storage.get('attendance') || [];
        const updatedAttendance = allAttendance.map(a => {
            if (a.id === todayAttendance.id) {
                return { ...a, checkOut: time };
            }
            return a;
        });

        storage.set('attendance', updatedAttendance);
        loadAttendance();
        toast.success(`Checked out successfully at ${time}`);
    };

    return (
        <div>
            <h2 style={{ marginBottom: 'var(--spacing-xl)' }}>Attendance Management</h2>

            {/* Check In/Out Card */}
            <div className="card" style={{ marginBottom: 'var(--spacing-xl)', textAlign: 'center' }}>
                <div style={{
                    width: '100px',
                    height: '100px',
                    margin: '0 auto var(--spacing-lg)',
                    borderRadius: '50%',
                    background: todayAttendance ? 'var(--gradient-success)' : 'var(--gradient-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-glow)'
                }}>
                    <Clock size={50} color="white" />
                </div>

                <h3 style={{ marginBottom: 'var(--spacing-md)' }}>
                    {formatDate(new Date(), 'EEEE, dd MMM yyyy')}
                </h3>

                {todayAttendance ? (
                    <div>
                        <div className="flex justify-center gap-lg" style={{ marginBottom: 'var(--spacing-lg)' }}>
                            <div>
                                <p className="text-sm text-muted" style={{ margin: 0 }}>Check In</p>
                                <p className="text-lg font-bold" style={{ margin: 0, color: 'var(--success-500)' }}>
                                    {todayAttendance.checkIn}
                                </p>
                            </div>
                            {todayAttendance.checkOut && (
                                <div>
                                    <p className="text-sm text-muted" style={{ margin: 0 }}>Check Out</p>
                                    <p className="text-lg font-bold" style={{ margin: 0, color: 'var(--danger-500)' }}>
                                        {todayAttendance.checkOut}
                                    </p>
                                </div>
                            )}
                        </div>

                        <span className={`badge badge-${todayAttendance.status === 'present' ? 'success' : 'warning'}`}>
                            {todayAttendance.status.toUpperCase()}
                        </span>

                        {!todayAttendance.checkOut && (
                            <button
                                className="btn btn-danger mt-lg"
                                onClick={handleCheckOut}
                            >
                                <XCircle size={18} />
                                Check Out
                            </button>
                        )}
                    </div>
                ) : (
                    <button
                        className="btn btn-primary btn-lg"
                        onClick={handleCheckIn}
                    >
                        <CheckCircle size={20} />
                        Check In
                    </button>
                )}
            </div>

            {/* Monthly Stats */}
            <div className="grid grid-3" style={{ marginBottom: 'var(--spacing-xl)' }}>
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
                            <h3 style={{ margin: 0, color: 'var(--success-500)' }}>{stats.present}</h3>
                            <p className="text-sm text-muted" style={{ margin: 0 }}>Present Days</p>
                        </div>
                    </div>
                </div>

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
                            <XCircle size={24} color="var(--danger-500)" />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, color: 'var(--danger-500)' }}>{stats.absent}</h3>
                            <p className="text-sm text-muted" style={{ margin: 0 }}>Absent Days</p>
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
                            <Clock size={24} color="var(--warning-500)" />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, color: 'var(--warning-500)' }}>{stats.late}</h3>
                            <p className="text-sm text-muted" style={{ margin: 0 }}>Late Arrivals</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Attendance History */}
            <div className="card">
                <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Attendance History</h3>

                {attendance.length > 0 ? (
                    <div style={{ overflowX: 'auto' }}>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Check In</th>
                                    <th>Check Out</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendance.slice().reverse().slice(0, 10).map(record => (
                                    <tr key={record.id}>
                                        <td>{formatDate(record.date)}</td>
                                        <td>{record.checkIn || '-'}</td>
                                        <td>{record.checkOut || '-'}</td>
                                        <td>
                                            <span className={`badge badge-${record.status === 'present' ? 'success' :
                                                record.status === 'late' ? 'warning' : 'danger'
                                                }`}>
                                                {record.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center text-muted">No attendance records found</p>
                )}
            </div>
        </div>
    );
};

export default AttendancePage;
