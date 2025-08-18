import * as React from 'react';
import { NavLink } from 'react-router-dom';

interface ComponentLinkProps {
  children: React.ReactNode;
  to: string;
}

export default function ComponentLink({children, to} : ComponentLinkProps) {
  return (
    <li className='component-link-li'>
      <NavLink
        to={to}
        // className={(isActive) => isActive ? 'active' : ''}
      >
        {children}
      </NavLink>
    </li>
  );
}
