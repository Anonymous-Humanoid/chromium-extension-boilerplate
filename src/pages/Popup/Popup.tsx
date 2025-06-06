import React from 'react';
import logo from '../../assets/img/logo.svg';
import './Popup.css';

const Popup: React.FC = () => {
    return (
        <div className='App'>
            <header className='App-header'>
                <img src={logo as string} className='App-logo' alt='logo' />
                <p>
                    Edit <code>src/pages/Popup/Popup.jsx</code> and save to
                    reload.
                </p>
                <a
                    className='App-link'
                    href='https://reactjs.org'
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    Learn React!
                </a>
            </header>
        </div>
    );
};

export default Popup;
