import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = login(formData.email, formData.password);

            if (result.success) {
                toast.success(`Welcome back, ${result.user.firstName}!`);
                navigate('/dashboard');
            } else {
                setError(result.error);
                toast.error(result.error);
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
            toast.error('Login failed');
        } finally {
            setLoading(false);
        }
    };

    const fillDemoCredentials = (role) => {
        if (role === 'admin') {
            setFormData({
                email: 'admin@hrms.com',
                password: 'admin123'
            });
        } else {
            setFormData({
                email: 'john.doe@hrms.com',
                password: 'employee123'
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="card" style={{ maxWidth: '450px', width: '100%' }}>
                <div className="text-center mb-lg">
                    <div className="flex justify-center mb-md">
                        <div style={{
                            width: '80px',
                            height: '80px',
                            background: 'var(--gradient-primary)',
                            borderRadius: 'var(--radius-xl)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: 'var(--shadow-glow)'
                        }}>
                            <LogIn size={40} color="white" />
                        </div>
                    </div>
                    <h1 style={{ marginBottom: 'var(--spacing-sm)' }}>HRMS Platform</h1>
                    <p className="text-muted">Sign in to access your account</p>
                </div>

                {error && (
                    <div style={{
                        background: '#fee2e2',
                        color: '#991b1b',
                        padding: 'var(--spacing-md)',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: 'var(--spacing-lg)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-sm)'
                    }}>
                        <AlertCircle size={20} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">
                            <Mail size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            className="form-input"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            <Lock size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            className="form-input"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', marginBottom: 'var(--spacing-md)' }}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <div className="spinner spinner-sm"></div>
                                Signing in...
                            </>
                        ) : (
                            <>
                                <LogIn size={18} />
                                Sign In
                            </>
                        )}
                    </button>
                </form>

                <div style={{
                    marginTop: 'var(--spacing-xl)',
                    paddingTop: 'var(--spacing-lg)',
                    borderTop: '1px solid var(--neutral-200)'
                }}>
                    <p className="text-sm text-muted text-center" style={{ marginBottom: 'var(--spacing-md)' }}>
                        Demo Credentials
                    </p>
                    <div className="flex gap-md">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            style={{ flex: 1 }}
                            onClick={() => fillDemoCredentials('admin')}
                        >
                            Admin Login
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            style={{ flex: 1 }}
                            onClick={() => fillDemoCredentials('employee')}
                        >
                            Employee Login
                        </button>
                    </div>
                </div>

                <div style={{
                    marginTop: 'var(--spacing-lg)',
                    padding: 'var(--spacing-md)',
                    background: 'var(--primary-50)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.8125rem',
                    color: 'var(--neutral-600)'
                }}>
                    <strong>Quick Access:</strong>
                    <ul style={{ marginTop: 'var(--spacing-sm)', paddingLeft: '1.5rem' }}>
                        <li>Admin: admin@hrms.com / admin123</li>
                        <li>Employee: john.doe@hrms.com / employee123</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
