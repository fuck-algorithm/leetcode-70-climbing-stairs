import { NavLink } from 'react-router';
import { NAV_ITEMS } from '../routes/config';

function NavigationBar() {
  return (
    <div className="algorithm-selector">
      {NAV_ITEMS.map(item => (
        <NavLink
          key={item.id}
          to={item.path}
          className={({ isActive }) => 
            `algorithm-button ${isActive ? 'active' : ''}`
          }
          style={({ isActive }) => ({
            borderColor: item.color,
            backgroundColor: isActive ? item.color : 'transparent',
            color: isActive ? 'white' : item.color
          })}
        >
          {item.name}
        </NavLink>
      ))}
    </div>
  );
}

export default NavigationBar;
