import React from 'react';

const Navbar = class extends React.PureComponent {
  render() {
    return (
      <header className="header">
        <div className="container header__body">
          <a className="header__title" href="/">
            Liquid.fan
          </a>
          {/* <nav>
            <ul className="header__nav">
              <li className="header__nav-item">
                <a href="/markets">Markets</a>
              </li>
              <li className="header__nav-item">
                <a href="/assets">Assets</a>
              </li>
            </ul>
          </nav> */}
        </div>
      </header>
    );
  }
};

export default Navbar;
