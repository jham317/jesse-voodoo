import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <Link to="/home" style={{ textDecoration: 'none', color: 'var(--prince-yellow)' }}>
      <h1 style={{ fontFamily: 'Sniglet, cursive', textAlign: 'center', fontSize: '7rem' }}>
        Voodoo
      </h1>
    </Link>
  );
};

export default Header;
