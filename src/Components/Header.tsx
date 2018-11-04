import * as React from 'react';
import { version } from '../../package.json';

export const Header = () => (
  <nav className="navbar navbar-expand-md bg-primary">
    <a href="/" className="navbar-brand">
      Keyrier JSON
    </a>
    <ul className="mr-auto navbar-nav">
      <li className="nav-item">
        <a href="#" className="nav-link">
          {version}
        </a>
      </li>
    </ul>
    <ul className="ml-auto navbar-nav">
      <li className="nav-item">
        <a
          href="https://github.com/magoo-magoo/keyrier-json"
          className="nav-link"
        >
          GitHub
        </a>
      </li>
    </ul>
  </nav>
);
