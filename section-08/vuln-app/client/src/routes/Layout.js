import { Outlet, Link } from "react-router-dom";
import ChangelogModal from '../ChangelogModal';

const Layout = () => {
    return (
        <div style={{ textAlign: 'center' }}>
            <header>
                <nav>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/feedback">Submit feedback</Link></li>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/profile">Profile</Link></li>
                    </ul>
                </nav>
                Hands-on <span class="highlight">JavaScript</span> for <span class="highlight">Ethical Hacking</span>
            </header>
            <main>
                <Outlet />
            </main>
            <footer>
                <ChangelogModal></ChangelogModal>
            </footer>
        </div>
    )
};

export default Layout;
