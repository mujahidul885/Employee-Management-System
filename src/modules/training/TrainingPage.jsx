import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, Plus, Award, TrendingUp, CheckCircle } from 'lucide-react';
import { storage } from '../../utils/helpers';
import toast from 'react-hot-toast';

const TrainingPage = () => {
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [skills, setSkills] = useState([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        const allCourses = storage.get('courses') || sampleCourses;
        setCourses(allCourses);

        const allEnrollments = storage.get('enrollments') || [];
        const userEnrollments = allEnrollments.filter(e => e.userId === user.id);
        setEnrollments(userEnrollments);

        const userSkills = storage.get('userSkills') || {};
        setSkills(userSkills[user.id] || sampleSkills);
    };

    const sampleCourses = [
        {
            id: '1',
            title: 'Advanced React Patterns',
            category: 'Development',
            duration: '8 hours',
            level: 'Advanced',
            instructor: 'John Doe',
            description: 'Master advanced React patterns including hooks, context, and performance optimization',
            enrolled: 45,
            rating: 4.8
        },
        {
            id: '2',
            title: 'Leadership & Management',
            category: 'Management',
            duration: '12 hours',
            level: 'Intermediate',
            instructor: 'Sarah Smith',
            description: 'Develop essential leadership skills for managing teams effectively',
            enrolled: 32,
            rating: 4.6
        },
        {
            id: '3',
            title: 'UI/UX Design Fundamentals',
            category: 'Design',
            duration: '10 hours',
            level: 'Beginner',
            instructor: 'Mike Johnson',
            description: 'Learn the fundamentals of user interface and user experience design',
            enrolled: 58,
            rating: 4.9
        },
        {
            id: '4',
            title: 'Data Analytics with Python',
            category: 'Data Science',
            duration: '15 hours',
            level: 'Intermediate',
            instructor: 'Emily Chen',
            description: 'Analyze data using Python, pandas, and visualization libraries',
            enrolled: 41,
            rating: 4.7
        }
    ];

    const sampleSkills = [
        { name: 'React', level: 85, category: 'Technical' },
        { name: 'JavaScript', level: 90, category: 'Technical' },
        { name: 'Communication', level: 75, category: 'Soft Skills' },
        { name: 'Leadership', level: 65, category: 'Soft Skills' },
        { name: 'Problem Solving', level: 80, category: 'Soft Skills' }
    ];

    const handleEnroll = (courseId) => {
        const course = courses.find(c => c.id === courseId);

        // Check if already enrolled
        const alreadyEnrolled = enrollments.find(e => e.courseId === courseId);
        if (alreadyEnrolled) {
            toast.error('Already enrolled in this course');
            return;
        }

        const newEnrollment = {
            id: Date.now().toString(),
            userId: user.id,
            courseId: courseId,
            courseTitle: course.title,
            enrolledDate: new Date().toISOString(),
            progress: 0,
            status: 'in_progress'
        };

        const allEnrollments = storage.get('enrollments') || [];
        allEnrollments.push(newEnrollment);
        storage.set('enrollments', allEnrollments);

        loadData();
        toast.success(`Enrolled in ${course.title}`);
    };

    const getLevelColor = (level) => {
        if (level === 'Beginner') return 'var(--success-500)';
        if (level === 'Intermediate') return 'var(--warning-500)';
        return 'var(--danger-500)';
    };

    const getSkillColor = (level) => {
        if (level >= 80) return 'var(--success-500)';
        if (level >= 60) return 'var(--primary-500)';
        if (level >= 40) return 'var(--warning-500)';
        return 'var(--danger-500)';
    };

    return (
        <div>
            <div className="flex items-center justify-between" style={{ marginBottom: 'var(--spacing-xl)' }}>
                <div>
                    <h2 style={{ marginBottom: 'var(--spacing-sm)' }}>Training & Learning</h2>
                    <p className="text-muted">Explore courses and track your skill development</p>
                </div>
            </div>

            {/* Stats Cards */}
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
                            background: 'var(--primary-50)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <BookOpen size={24} color="var(--primary-600)" />
                        </div>
                        <div>
                            <h3 style={{ margin: 0 }}>{enrollments.length}</h3>
                            <p className="text-sm text-muted" style={{ margin: 0 }}>Enrolled Courses</p>
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
                                {enrollments.filter(e => e.status === 'completed').length}
                            </h3>
                            <p className="text-sm text-muted" style={{ margin: 0 }}>Completed</p>
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
                            <TrendingUp size={24} color="var(--warning-500)" />
                        </div>
                        <div>
                            <h3 style={{ margin: 0 }}>{skills.length}</h3>
                            <p className="text-sm text-muted" style={{ margin: 0 }}>Skills Tracked</p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center gap-md">
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: 'var(--radius-lg)',
                            background: '#e0e7ff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Award size={24} color="#6366f1" />
                        </div>
                        <div>
                            <h3 style={{ margin: 0 }}>
                                {skills.filter(s => s.level >= 80).length}
                            </h3>
                            <p className="text-sm text-muted" style={{ margin: 0 }}>Expert Skills</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* My Enrollments */}
            {enrollments.length > 0 && (
                <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
                    <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>My Courses</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                        {enrollments.map(enrollment => (
                            <div
                                key={enrollment.id}
                                style={{
                                    padding: 'var(--spacing-md)',
                                    background: 'var(--neutral-50)',
                                    borderRadius: 'var(--radius-md)',
                                    borderLeft: '4px solid var(--primary-500)'
                                }}
                            >
                                <div className="flex items-center justify-between">
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ margin: 0, marginBottom: 'var(--spacing-xs)' }}>
                                            {enrollment.courseTitle}
                                        </h4>
                                        <div style={{ marginBottom: 'var(--spacing-sm)' }}>
                                            <div className="flex items-center justify-between" style={{ marginBottom: 'var(--spacing-xs)' }}>
                                                <span className="text-sm">Progress</span>
                                                <span className="text-sm font-semibold">{enrollment.progress}%</span>
                                            </div>
                                            <div style={{
                                                width: '100%',
                                                height: '6px',
                                                background: 'var(--neutral-200)',
                                                borderRadius: 'var(--radius-full)',
                                                overflow: 'hidden'
                                            }}>
                                                <div style={{
                                                    width: `${enrollment.progress}%`,
                                                    height: '100%',
                                                    background: 'var(--primary-500)',
                                                    transition: 'width var(--transition-base)'
                                                }}></div>
                                            </div>
                                        </div>
                                    </div>
                                    <span className={`badge ${enrollment.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                                        {enrollment.status === 'completed' ? 'Completed' : 'In Progress'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Course Library */}
            <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
                <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Course Library</h3>

                <div className="grid grid-2">
                    {courses.map(course => (
                        <div
                            key={course.id}
                            style={{
                                padding: 'var(--spacing-lg)',
                                background: 'var(--neutral-50)',
                                borderRadius: 'var(--radius-lg)',
                                border: '1px solid var(--neutral-200)'
                            }}
                        >
                            <div className="flex items-start justify-between" style={{ marginBottom: 'var(--spacing-md)' }}>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ margin: 0, marginBottom: 'var(--spacing-xs)' }}>{course.title}</h4>
                                    <p className="text-sm text-muted" style={{ margin: 0 }}>
                                        by {course.instructor}
                                    </p>
                                </div>
                                <span
                                    className="badge"
                                    style={{
                                        background: getLevelColor(course.level) + '20',
                                        color: getLevelColor(course.level),
                                        border: 'none'
                                    }}
                                >
                                    {course.level}
                                </span>
                            </div>

                            <p className="text-sm" style={{ marginBottom: 'var(--spacing-md)', color: 'var(--neutral-700)' }}>
                                {course.description}
                            </p>

                            <div className="flex gap-md" style={{ marginBottom: 'var(--spacing-md)', fontSize: '0.875rem', color: 'var(--neutral-600)' }}>
                                <span>📚 {course.category}</span>
                                <span>⏱️ {course.duration}</span>
                                <span>⭐ {course.rating}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted">{course.enrolled} enrolled</span>
                                <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => handleEnroll(course.id)}
                                    disabled={enrollments.some(e => e.courseId === course.id)}
                                >
                                    {enrollments.some(e => e.courseId === course.id) ? 'Enrolled' : 'Enroll Now'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Skill Matrix */}
            <div className="card">
                <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Skill Matrix</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                    {skills.map((skill, index) => (
                        <div key={index}>
                            <div className="flex items-center justify-between" style={{ marginBottom: 'var(--spacing-sm)' }}>
                                <div>
                                    <span className="font-semibold">{skill.name}</span>
                                    <span className="text-sm text-muted" style={{ marginLeft: 'var(--spacing-sm)' }}>
                                        ({skill.category})
                                    </span>
                                </div>
                                <span className="font-semibold" style={{ color: getSkillColor(skill.level) }}>
                                    {skill.level}%
                                </span>
                            </div>
                            <div style={{
                                width: '100%',
                                height: '10px',
                                background: 'var(--neutral-200)',
                                borderRadius: 'var(--radius-full)',
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    width: `${skill.level}%`,
                                    height: '100%',
                                    background: getSkillColor(skill.level),
                                    transition: 'width var(--transition-base)'
                                }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TrainingPage;
