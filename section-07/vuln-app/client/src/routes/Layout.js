import { Outlet } from "react-router-dom";
import ChangelogModal from '../ChangelogModal';

const Layout = () => {
    return (
        <div style={{ textAlign: 'center' }}>
            <header>
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
