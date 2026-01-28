import { Outlet } from 'react-router';
import GitHubCorner from './GitHubCorner';
import BackToHot100 from './BackToHot100';
import WeChatGroup from './WeChatGroup';
import NavigationBar from './NavigationBar';
import { LEETCODE_URL } from '../routes/config';

function Layout() {
  return (
    <div className="app-container">
      <BackToHot100 />
      <GitHubCorner />
      <WeChatGroup />
      
      <header className="app-header">
        <a 
          href={LEETCODE_URL} 
          target="_blank" 
          rel="noopener noreferrer"
          className="title-link"
        >
          <h1>70. 爬楼梯</h1>
        </a>
        <nav className="algorithm-nav">
          <NavigationBar />
        </nav>
      </header>
      
      <Outlet />
    </div>
  );
}

export default Layout;
