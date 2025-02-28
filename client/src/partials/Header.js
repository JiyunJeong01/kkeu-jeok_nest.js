import React from 'react'

const Header = () => {
    return (
        <header>
            <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#52C1FF' }}>
                <div className="container-fluid">
                    <a className="navbar-brand" href="/">
                        <img src="header-logo.png" alt="로고 이미지" height="40" />
                    </a>

                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarTogglerDemo02"
                        aria-controls="navbarTogglerDemo02"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="right-text">
                        <a className="login" href="/login">로그인</a>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header