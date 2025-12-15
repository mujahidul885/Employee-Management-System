import { useState, useEffect } from 'react';
import { Briefcase, Plus, Users, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import { storage, formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const RecruitmentPage = () => {
    const [jobs, setJobs] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [showJobForm, setShowJobForm] = useState(false);
    const [jobForm, setJobForm] = useState({
        title: '',
        department: '',
        location: '',
        type: 'full-time',
        description: ''
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        const allJobs = storage.get('jobs') || [];
        setJobs(allJobs);

        const allCandidates = storage.get('candidates') || [];
        setCandidates(allCandidates);
    };

    const handleAddJob = (e) => {
        e.preventDefault();

        if (!jobForm.title || !jobForm.department) {
            toast.error('Please fill in all required fields');
            return;
        }

        const newJob = {
            id: Date.now().toString(),
            title: jobForm.title,
            department: jobForm.department,
            location: jobForm.location,
            type: jobForm.type,
            description: jobForm.description,
            status: 'open',
            applicants: 0,
            postedDate: new Date().toISOString()
        };

        const allJobs = storage.get('jobs') || [];
        allJobs.push(newJob);
        storage.set('jobs', allJobs);

        setJobForm({
            title: '',
            department: '',
            location: '',
            type: 'full-time',
            description: ''
        });
        setShowJobForm(false);
        loadData();
        toast.success('Job posted successfully');
    };

    const getStatusBadge = (status) => {
        const badges = {
            open: { class: 'badge-success', icon: CheckCircle, text: 'Open' },
            closed: { class: 'badge-danger', icon: XCircle, text: 'Closed' },
            pending: { class: 'badge-warning', icon: Clock, text: 'Pending' }
        };
        return badges[status] || badges.open;
    };

    const getCandidateStatusBadge = (status) => {
        const badges = {
            applied: { class: 'badge-primary', text: 'Applied' },
            screening: { class: 'badge-warning', text: 'Screening' },
            interview: { class: 'badge-info', text: 'Interview' },
            offered: { class: 'badge-success', text: 'Offered' },
            rejected: { class: 'badge-danger', text: 'Rejected' }
        };
        return badges[status] || badges.applied;
    };

    // Sample candidates for demonstration
    const sampleCandidates = [
        {
            id: '1',
            name: 'Alice Johnson',
            position: 'Senior React Developer',
            email: 'alice.j@email.com',
            phone: '+1 234-567-8901',
            appliedDate: '2024-12-10',
            status: 'interview',
            experience: '5 years'
        },
        {
            id: '2',
            name: 'Bob Smith',
            position: 'UI/UX Designer',
            email: 'bob.s@email.com',
            phone: '+1 234-567-8902',
            appliedDate: '2024-12-12',
            status: 'screening',
            experience: '3 years'
        },
        {
            id: '3',
            name: 'Carol White',
            position: 'Product Manager',
            email: 'carol.w@email.com',
            phone: '+1 234-567-8903',
            appliedDate: '2024-12-14',
            status: 'applied',
            experience: '7 years'
        }
    ];

    const departments = storage.get('departments') || [
        { id: '1', name: 'Engineering' },
        { id: '2', name: 'Design' },
        { id: '3', name: 'Product' }
    ];

    return (
        <div>
            <div className="flex items-center justify-between" style={{ marginBottom: 'var(--spacing-xl)' }}>
                <div>
                    <h2 style={{ marginBottom: 'var(--spacing-sm)' }}>Recruitment & ATS</h2>
                    <p className="text-muted">Manage job postings and track candidates</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowJobForm(!showJobForm)}
                >
                    <Plus size={18} />
                    Post Job
                </button>
            </div>

            {/* Stats Cards */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(135px, 1fr))',
                    gap: 'var(--spacing-md)',
                    marginBottom: 'var(--spacing-xl)'
                }}
            >
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
                            <Briefcase size={24} color="var(--primary-600)" />
                        </div>
                        <div>
                            <h3 style={{ margin: 0 }}>{jobs.length}</h3>
                            <p className="text-sm text-muted" style={{ margin: 0 }}>Open Positions</p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center gap-md">
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: 'var(--radius-lg)',
                            background: '#dbeafe',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Users size={24} color="#3b82f6" />
                        </div>
                        <div>
                            <h3 style={{ margin: 0 }}>{sampleCandidates.length}</h3>
                            <p className="text-sm text-muted" style={{ margin: 0 }}>Total Candidates</p>
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
                            <h3 style={{ margin: 0 }}>
                                {sampleCandidates.filter(c => c.status === 'interview').length}
                            </h3>
                            <p className="text-sm text-muted" style={{ margin: 0 }}>Interviews Scheduled</p>
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
                            <h3 style={{ margin: 0 }}>
                                {sampleCandidates.filter(c => c.status === 'offered').length}
                            </h3>
                            <p className="text-sm text-muted" style={{ margin: 0 }}>Offers Extended</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Job Form */}
            {showJobForm && (
                <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
                    <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Post New Job</h3>
                    <form onSubmit={handleAddJob}>
                        <div className="grid grid-2">
                            <div className="form-group">
                                <label className="form-label">Job Title</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="e.g., Senior React Developer"
                                    value={jobForm.title}
                                    onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Department</label>
                                <select
                                    className="form-select"
                                    value={jobForm.department}
                                    onChange={(e) => setJobForm({ ...jobForm, department: e.target.value })}
                                    required
                                >
                                    <option value="">Select Department</option>
                                    {departments.map(dept => (
                                        <option key={dept.id} value={dept.name}>{dept.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Location</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="e.g., Remote, New York"
                                    value={jobForm.location}
                                    onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Employment Type</label>
                                <select
                                    className="form-select"
                                    value={jobForm.type}
                                    onChange={(e) => setJobForm({ ...jobForm, type: e.target.value })}
                                >
                                    <option value="full-time">Full-time</option>
                                    <option value="part-time">Part-time</option>
                                    <option value="contract">Contract</option>
                                    <option value="internship">Internship</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Job Description</label>
                            <textarea
                                className="form-textarea"
                                placeholder="Describe the role, responsibilities, and requirements..."
                                value={jobForm.description}
                                onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                                rows={4}
                            />
                        </div>

                        <div className="flex gap-md justify-end">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => setShowJobForm(false)}
                            >
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Post Job
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Job Listings */}
            <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
                <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Open Positions</h3>

                {jobs.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                        {jobs.map(job => {
                            const statusBadge = getStatusBadge(job.status);
                            const StatusIcon = statusBadge.icon;

                            return (
                                <div
                                    key={job.id}
                                    style={{
                                        padding: 'var(--spacing-lg)',
                                        background: 'var(--neutral-50)',
                                        borderRadius: 'var(--radius-lg)',
                                        borderLeft: '4px solid var(--primary-500)'
                                    }}
                                >
                                    <div className="flex flex-col md:flex-row items-start justify-between gap-md">
                                        <div style={{ flex: 1 }}>
                                            <div className="flex items-center gap-md" style={{ marginBottom: 'var(--spacing-sm)' }}>
                                                <h4 style={{ margin: 0 }}>{job.title}</h4>
                                                <span className={`badge ${statusBadge.class}`}>
                                                    <StatusIcon size={12} />
                                                    {statusBadge.text}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-md md:gap-lg" style={{ marginBottom: 'var(--spacing-sm)' }}>
                                                <span className="text-sm text-muted">📍 {job.location || 'Remote'}</span>
                                                <span className="text-sm text-muted">🏢 {job.department}</span>
                                                <span className="text-sm text-muted">⏰ {job.type}</span>
                                            </div>
                                            <p className="text-sm" style={{ margin: 0, color: 'var(--neutral-700)' }}>
                                                {job.description || 'No description provided'}
                                            </p>
                                        </div>
                                        <div className="text-left md:text-right w-full md:w-auto mt-sm md:mt-0">
                                            <p className="text-sm text-muted" style={{ margin: 0 }}>
                                                Posted: {formatDate(job.postedDate)}
                                            </p>
                                            <p className="text-sm font-semibold" style={{ margin: 0, marginTop: 'var(--spacing-xs)' }}>
                                                {job.applicants || 0} Applicants
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center" style={{ padding: 'var(--spacing-2xl)' }}>
                        <Briefcase size={48} color="var(--neutral-400)" style={{ margin: '0 auto var(--spacing-md)' }} />
                        <h4 style={{ color: 'var(--neutral-500)' }}>No open positions</h4>
                        <p className="text-muted">Post your first job to start recruiting</p>
                    </div>
                )}
            </div>

            {/* Candidates */}
            <div className="card">
                <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Candidate Pipeline</h3>

                <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                    <table className="table" style={{ minWidth: '700px' }}>
                        <thead>
                            <tr>
                                <th>Candidate</th>
                                <th>Position</th>
                                <th>Contact</th>
                                <th>Experience</th>
                                <th>Applied Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sampleCandidates.map(candidate => {
                                const statusBadge = getCandidateStatusBadge(candidate.status);

                                return (
                                    <tr key={candidate.id}>
                                        <td className="font-semibold">{candidate.name}</td>
                                        <td>{candidate.position}</td>
                                        <td>
                                            <div className="text-sm">
                                                <div>{candidate.email}</div>
                                                <div className="text-muted">{candidate.phone}</div>
                                            </div>
                                        </td>
                                        <td>{candidate.experience}</td>
                                        <td>{formatDate(candidate.appliedDate)}</td>
                                        <td>
                                            <span className={`badge ${statusBadge.class}`}>
                                                {statusBadge.text}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default RecruitmentPage;
