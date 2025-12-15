import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard,
    Users,
    Calendar,
    Clock,
    DollarSign,
    TrendingUp,
    Receipt,
    Briefcase,
    GraduationCap,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronDown,
    Bell,
    User
} from 'lucide-react';

const MainLayout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

    // Handle window resize
    useState(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 1024;
            setIsMobile(mobile);
            if (!mobile && !sidebarOpen) {
                setSidebarOpen(true);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const closeSidebarOnMobile = () => {
        if (isMobile) {
            setSidebarOpen(false);
        }
    };

    const menuItems = [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['admin', 'employee', 'manager'] },
        { path: '/employees', icon: Users, label: 'Employees', roles: ['admin', 'manager'] },
        { path: '/attendance', icon: Calendar, label: 'Attendance', roles: ['admin', 'employee', 'manager'] },
        { path: '/leave', icon: Clock, label: 'Leave Management', roles: ['admin', 'employee', 'manager'] },
        { path: '/shift', icon: Clock, label: 'Shift & Schedule', roles: ['admin', 'manager'] },
        { path: '/payroll', icon: DollarSign, label: 'Payroll', roles: ['admin'] },
        { path: '/performance', icon: TrendingUp, label: 'Performance', roles: ['admin', 'employee', 'manager'] },
        { path: '/expenses', icon: Receipt, label: 'Expenses', roles: ['admin', 'employee', 'manager'] },
        { path: '/recruitment', icon: Briefcase, label: 'Recruitment', roles: ['admin', 'manager'] },
        { path: '/training', icon: GraduationCap, label: 'Training', roles: ['admin', 'employee', 'manager'] },
        { path: '/settings', icon: Settings, label: 'Settings', roles: ['admin'] }
    ];

    const visibleMenuItems = menuItems.filter(item =>
        item.roles.includes(user?.role)
    );

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Mobile Overlay */}
            {isMobile && sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 99,
                        animation: 'fadeIn 0.2s ease-in-out'
                    }}
                />
            )}

            {/* Sidebar */}
            <aside style={{
                width: isMobile ? '280px' : (sidebarOpen ? '260px' : '80px'),
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRight: '1px solid rgba(255, 255, 255, 0.3)',
                transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'fixed',
                height: '100vh',
                overflowY: 'auto',
                overflowX: 'hidden',
                zIndex: 100,
                boxShadow: 'var(--shadow-lg)',
                transform: isMobile ? (sidebarOpen ? 'translateX(0)' : 'translateX(-100%)') : 'translateX(0)',
                willChange: isMobile ? 'transform' : 'width',
                WebkitOverflowScrolling: 'touch'
            }}>
                <div style={{
                    padding: 'var(--spacing-xl)',
                    borderBottom: '1px solid var(--neutral-200)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: sidebarOpen ? 'space-between' : 'center',
                    minHeight: '80px'
                }}>
                    <h2 style={{
                        background: 'var(--gradient-primary)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontSize: '1.5rem',
                        margin: 0,
                        whiteSpace: 'nowrap',
                        opacity: (sidebarOpen || isMobile) ? 1 : 0,
                        transition: 'opacity 0.2s ease-in-out',
                        pointerEvents: (sidebarOpen || isMobile) ? 'auto' : 'none',
                        width: (sidebarOpen || isMobile) ? 'auto' : 0,
                        overflow: 'hidden'
                    }}>
                        HRMS
                    </h2>
                    {!isMobile && (
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            style={{
                                background: 'var(--neutral-100)',
                                border: '1px solid var(--neutral-200)',
                                cursor: 'pointer',
                                padding: '0.5rem',
                                borderRadius: 'var(--radius-md)',
                                transition: 'background 0.15s ease-in-out',
                                flexShrink: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--neutral-700)'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.background = 'var(--neutral-200)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.background = 'var(--neutral-100)';
                            }}
                        >
                            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    )}
                </div>

                <nav style={{ padding: 'var(--spacing-md)' }}>
                    {visibleMenuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        const showLabel = sidebarOpen || isMobile;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={closeSidebarOnMobile}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: 'var(--spacing-md)',
                                    marginBottom: 'var(--spacing-sm)',
                                    borderRadius: 'var(--radius-md)',
                                    textDecoration: 'none',
                                    color: isActive ? 'white' : 'var(--neutral-700)',
                                    background: isActive ? 'var(--gradient-primary)' : 'transparent',
                                    transition: 'background 0.15s ease-in-out, color 0.15s ease-in-out',
                                    fontWeight: isActive ? 600 : 400,
                                    justifyContent: sidebarOpen ? 'flex-start' : 'center',
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap'
                                }}
                                onMouseOver={(e) => {
                                    if (!isActive) e.currentTarget.style.background = 'var(--neutral-100)';
                                }}
                                onMouseOut={(e) => {
                                    if (!isActive) e.currentTarget.style.background = 'transparent';
                                }}
                            >
                                <Icon size={20} style={{ flexShrink: 0 }} />
                                <span style={{
                                    opacity: showLabel ? 1 : 0,
                                    maxWidth: showLabel ? '200px' : '0',
                                    marginLeft: showLabel ? 'var(--spacing-md)' : '0',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content */}
            <div style={{
                flex: 1,
                marginLeft: isMobile ? 0 : (sidebarOpen ? '260px' : '80px'),
                transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                willChange: isMobile ? 'auto' : 'margin-left'
            }}>
                {/* Header */}
                <header style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
                    padding: isMobile ? 'var(--spacing-md)' : 'var(--spacing-lg) var(--spacing-xl)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 50,
                    boxShadow: 'var(--shadow-md)'
                }}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-md">
                            {/* Mobile Menu Button */}
                            {isMobile && (
                                <button
                                    onClick={() => setSidebarOpen(!sidebarOpen)}
                                    style={{
                                        background: 'white',
                                        border: '2px solid var(--neutral-200)',
                                        borderRadius: 'var(--radius-md)',
                                        padding: '0.5rem',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Menu size={20} />
                                </button>
                            )}

                            <div>
                                <h1 style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', margin: 0 }}>
                                    {visibleMenuItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
                                </h1>
                                {!isMobile && (
                                    <p className="text-sm text-muted" style={{ margin: 0 }}>
                                        Welcome back, {user?.firstName}!
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-md">
                            {/* Notifications - Hide on small mobile */}
                            {!isMobile && (
                                <button
                                    style={{
                                        background: 'white',
                                        border: '2px solid var(--neutral-200)',
                                        borderRadius: 'var(--radius-full)',
                                        width: '40px',
                                        height: '40px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        position: 'relative',
                                        transition: 'all var(--transition-fast)'
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--primary-500)';
                                        e.currentTarget.style.transform = 'scale(1.05)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--neutral-200)';
                                        e.currentTarget.style.transform = 'scale(1)';
                                    }}
                                >
                                    <Bell size={18} />
                                    <span style={{
                                        position: 'absolute',
                                        top: '0',
                                        right: '0',
                                        width: '8px',
                                        height: '8px',
                                        background: 'var(--danger-500)',
                                        borderRadius: '50%',
                                        border: '2px solid white'
                                    }}></span>
                                </button>
                            )}

                            {/* User Menu */}
                            <div style={{ position: 'relative' }}>
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--spacing-sm)',
                                        background: 'white',
                                        border: '2px solid var(--neutral-200)',
                                        borderRadius: 'var(--radius-full)',
                                        padding: isMobile ? '0.5rem' : '0.5rem 1rem',
                                        cursor: 'pointer',
                                        transition: 'all var(--transition-fast)'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary-500)'}
                                    onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--neutral-200)'}
                                >
                                    <div style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        background: 'var(--gradient-primary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontWeight: 600
                                    }}>
                                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                                    </div>
                                    {!isMobile && (
                                        <>
                                            <span className="font-semibold">{user?.firstName}</span>
                                            <ChevronDown size={16} />
                                        </>
                                    )}
                                </button>

                                {userMenuOpen && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '100%',
                                        right: 0,
                                        marginTop: 'var(--spacing-sm)',
                                        background: 'white',
                                        borderRadius: 'var(--radius-lg)',
                                        boxShadow: 'var(--shadow-xl)',
                                        minWidth: '200px',
                                        overflow: 'hidden',
                                        border: '1px solid var(--neutral-200)'
                                    }}>
                                        <div style={{ padding: 'var(--spacing-md)', borderBottom: '1px solid var(--neutral-100)' }}>
                                            <p className="font-semibold" style={{ margin: 0 }}>{user?.firstName} {user?.lastName}</p>
                                            <p className="text-sm text-muted" style={{ margin: 0 }}>{user?.email}</p>
                                            <span className="badge badge-primary mt-sm">{user?.role}</span>
                                        </div>
                                        <Link
                                            to="/profile"
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 'var(--spacing-sm)',
                                                padding: 'var(--spacing-md)',
                                                textDecoration: 'none',
                                                color: 'var(--neutral-700)',
                                                transition: 'background var(--transition-fast)'
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.background = 'var(--neutral-50)'}
                                            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <User size={18} />
                                            My Profile
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            style={{
                                                width: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 'var(--spacing-sm)',
                                                padding: 'var(--spacing-md)',
                                                background: 'none',
                                                border: 'none',
                                                borderTop: '1px solid var(--neutral-100)',
                                                color: 'var(--danger-500)',
                                                cursor: 'pointer',
                                                transition: 'background var(--transition-fast)',
                                                textAlign: 'left'
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.background = 'var(--danger-50)'}
                                            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <LogOut size={18} />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main style={{
                    flex: 1,
                    padding: isMobile ? 'var(--spacing-md)' : 'var(--spacing-xl)',
                    overflowY: 'auto'
                }}>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
