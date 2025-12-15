import { useState, useEffect } from 'react';
import { Clock, Plus, Calendar, Users } from 'lucide-react';
import { storage, formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const ShiftPage = () => {
    const [shifts, setShifts] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [selectedWeek, setSelectedWeek] = useState(getCurrentWeek());
    const [showAssignForm, setShowAssignForm] = useState(false);
    const [assignForm, setAssignForm] = useState({
        employeeId: '',
        date: '',
        shiftType: 'morning'
    });

    const shiftTemplates = [
        { id: 'morning', name: 'Morning Shift', time: '09:00 - 17:00', color: '#3b82f6' },
        { id: 'evening', name: 'Evening Shift', time: '14:00 - 22:00', color: '#f59e0b' },
        { id: 'night', name: 'Night Shift', time: '22:00 - 06:00', color: '#8b5cf6' },
        { id: 'general', name: 'General', time: '09:00 - 18:00', color: '#10b981' }
    ];

    useEffect(() => {
        loadData();
    }, []);

    function getCurrentWeek() {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const monday = new Date(today);
        // Adjust for Monday being day 1 and Sunday being day 0
        monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
        return monday.toISOString().split('T')[0];
    }

    const loadData = () => {
        const allShifts = storage.get('shifts') || [];
        setShifts(allShifts);

        const users = storage.get('users') || [];
        const employeeList = users.filter(u => u.role !== 'admin');
        setEmployees(employeeList);
    };

    const getWeekDates = () => {
        const dates = [];
        const startDate = new Date(selectedWeek);

        for (let i = 0; i < 7; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            dates.push(date.toISOString().split('T')[0]);
        }

        return dates;
    };

    const handleAssignShift = () => {
        if (!assignForm.employeeId || !assignForm.date) {
            toast.error('Please select employee and date');
            return;
        }

        // Check if shift already exists
        const existing = shifts.find(
            s => s.employeeId === assignForm.employeeId && s.date === assignForm.date
        );

        if (existing) {
            toast.error('Shift already assigned for this employee on this date');
            return;
        }

        const employee = employees.find(e => e.id === assignForm.employeeId);
        const newShift = {
            id: Date.now().toString(),
            employeeId: assignForm.employeeId,
            employeeName: `${employee.firstName} ${employee.lastName}`,
            date: assignForm.date,
            shiftType: assignForm.shiftType,
            createdAt: new Date().toISOString()
        };

        const updatedShifts = [...shifts, newShift];
        storage.set('shifts', updatedShifts);
        setShifts(updatedShifts);

        setAssignForm({
            employeeId: '',
            date: '',
            shiftType: 'morning'
        });
        setShowAssignForm(false);
        toast.success('Shift assigned successfully');
    };

    const getShiftForEmployeeOnDate = (employeeId, date) => {
        return shifts.find(s => s.employeeId === employeeId && s.date === date);
    };

    const getShiftTemplate = (shiftType) => {
        return shiftTemplates.find(t => t.id === shiftType);
    };

    const weekDates = getWeekDates();
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            {/* Reduced vertical margin here */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
                <div className="mb-4 sm:mb-0">
                    <h2 className="mb-1">Shift & Schedule Management</h2> {/* Reduced h2 margin */}
                    <p className="text-muted text-sm">Manage employee shifts and weekly roster</p> {/* Smaller text for subtitle */}
                </div>
                <button
                    className="btn btn-primary flex items-center gap-sm"
                    onClick={() => setShowAssignForm(!showAssignForm)}
                >
                    <Plus size={18} />
                    Assign Shift
                </button>
            </div>

            {/* Shift Templates - Optimized for compact, responsive layout */}
            {/* Shift Templates - Optimized for compact, responsive layout */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                    gap: 'var(--spacing-sm)',
                    marginBottom: 'var(--spacing-lg)'
                }}
            >
                {shiftTemplates.map(template => (
                    <div key={template.id} className="card p-3"> {/* Reduced card padding */}
                        <div className="flex items-center gap-sm"> {/* Reduced gap */}
                            <div style={{
                                width: '36px', // Smaller icon background
                                height: '36px',
                                borderRadius: 'var(--radius-lg)',
                                background: template.color + '20',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                            }}>
                                <Clock size={18} color={template.color} /> {/* Smaller icon size */}
                            </div>
                            <div>
                                <h4 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600 }}>{template.name}</h4> {/* Smaller font, bolder */}
                                <p className="text-xs text-muted" style={{ margin: 0, marginTop: '2px' }}>{template.time}</p> {/* Smallest text for time */}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Assign Shift Form */}
            {showAssignForm && (
                <div className="card mb-8"> {/* Reduced bottom margin */}
                    <h3 className="mb-4">Assign Shift</h3> {/* Reduced h3 margin */}
                    <div className="grid gap-md grid-cols-1 md:grid-cols-3">
                        <div className="form-group">
                            <label className="form-label">Employee</label>
                            <select
                                className="form-select"
                                value={assignForm.employeeId}
                                onChange={(e) => setAssignForm({ ...assignForm, employeeId: e.target.value })}
                            >
                                <option value="">Select Employee</option>
                                {employees.map(emp => (
                                    <option key={emp.id} value={emp.id}>
                                        {emp.firstName} {emp.lastName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Date</label>
                            <input
                                type="date"
                                className="form-input"
                                value={assignForm.date}
                                onChange={(e) => setAssignForm({ ...assignForm, date: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Shift Type</label>
                            <select
                                className="form-select"
                                value={assignForm.shiftType}
                                onChange={(e) => setAssignForm({ ...assignForm, shiftType: e.target.value })}
                            >
                                {shiftTemplates.map(template => (
                                    <option key={template.id} value={template.id}>
                                        {template.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-md justify-end mt-4"> {/* Reduced top margin */}
                        <button
                            className="btn btn-secondary"
                            onClick={() => setShowAssignForm(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={handleAssignShift}
                        >
                            Assign Shift
                        </button>
                    </div>
                </div>
            )}

            {/* Week Selector */}
            <div className="card mb-8"> {/* Reduced bottom margin */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <button
                        className="btn btn-secondary flex-1 sm:flex-none min-w-[120px]"
                        onClick={() => {
                            const prevWeek = new Date(selectedWeek);
                            prevWeek.setDate(prevWeek.getDate() - 7);
                            setSelectedWeek(prevWeek.toISOString().split('T')[0]);
                        }}
                    >
                        ← Previous Week
                    </button>

                    <div className="text-center flex-1 sm:flex-none min-w-[150px]">
                        <h3 className="m-0 text-lg"> {/* Reduced heading size and removed margin */}
                            Week of {formatDate(selectedWeek)}
                        </h3>
                        <p className="text-xs text-muted m-0 mt-1"> {/* Smaller text size */}
                            {formatDate(weekDates[0])} - {formatDate(weekDates[6])}
                        </p>
                    </div>

                    <button
                        className="btn btn-secondary flex-1 sm:flex-none min-w-[120px]"
                        onClick={() => {
                            const nextWeek = new Date(selectedWeek);
                            nextWeek.setDate(nextWeek.getDate() + 7);
                            setSelectedWeek(nextWeek.toISOString().split('T')[0]);
                        }}
                    >
                        Next Week →
                    </button>
                </div>
            </div>

            {/* Weekly Roster */}
            <div className="card">
                <h3 className="mb-4">Weekly Roster</h3> {/* Reduced h3 margin */}

                <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                    <table className="table" style={{ minWidth: '700px' }}>
                        <thead>
                            <tr>
                                <th style={{
                                    minWidth: '150px',
                                    position: 'sticky',
                                    left: 0,
                                    background: 'var(--bg-card)',
                                    zIndex: 1,
                                    boxShadow: '2px 0 2px -2px rgba(0,0,0,0.1)'
                                }}>
                                    Employee
                                </th>
                                {weekDays.map((day, idx) => (
                                    <th key={idx} style={{ minWidth: '90px', textAlign: 'center' }}>
                                        <span className="font-semibold text-sm">{day}</span>
                                        <br />
                                        <span className="text-xs font-normal text-muted"> {/* Smaller date text */}
                                            {new Date(weekDates[idx]).getDate()}
                                        </span>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {employees.slice(0, 10).map(employee => (
                                <tr key={employee.id}>
                                    <td style={{
                                        position: 'sticky',
                                        left: 0,
                                        background: 'var(--bg-card)',
                                        zIndex: 1,
                                        boxShadow: '2px 0 2px -2px rgba(0,0,0,0.1)'
                                    }}>
                                        <div className="py-2"> {/* Added vertical padding to sticky cell for height */}
                                            <div className="font-semibold text-sm">
                                                {employee.firstName} {employee.lastName}
                                            </div>
                                            <div className="text-xs text-muted">
                                                {employee.designation}
                                            </div>
                                        </div>
                                    </td>
                                    {weekDates.map((date, idx) => {
                                        const shift = getShiftForEmployeeOnDate(employee.id, date);
                                        const template = shift ? getShiftTemplate(shift.shiftType) : null;

                                        return (
                                            <td key={idx} style={{ padding: '0.3rem' }}>
                                                {shift && template ? (
                                                    <div style={{
                                                        padding: '0.3rem',
                                                        background: template.color + '20',
                                                        borderLeft: `3px solid ${template.color}`,
                                                        borderRadius: 'var(--radius-sm)',
                                                        fontSize: '0.7rem',
                                                        minHeight: '40px', // Ensure consistent cell height for shifts
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        textAlign: 'center'
                                                    }}>
                                                        <div className="font-semibold" style={{ color: template.color }}>
                                                            {template.name.split(' ')[0]}
                                                        </div>
                                                        <div style={{ fontSize: '0.6rem', color: 'var(--neutral-600)' }}>
                                                            {template.time.split(' - ')[0]}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="text-center text-muted text-xs py-2">
                                                        -
                                                    </div>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {employees.length === 0 && (
                    <p className="text-center text-muted mt-4">No employees found</p>
                )}
            </div>
        </div>
    );
};

export default ShiftPage;