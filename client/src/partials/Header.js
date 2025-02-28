import React from 'react'
import { Link } from "react-router-dom";

const Header = () => {
    return (
        <header>
            <nav className="navbar navbar-expand-lg navbar-dark bg-blue">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">
                        <img src="header-logo.png" alt="로고 이미지" height="40" />
                    </Link>

                    <button className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarTogglerDemo02"
                        aria-controls="navbarTogglerDemo02"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div class="collapse navbar-collapse justify-center" id="navbarTogglerDemo02">
                        <form class="d-flex" action="/search" method="GET">
                            <input class="form-control me-2 width-[30] height-[50px] rounded-[30px]" type="search" placeholder="검색" aria-label="Search" name="q"></input>
                        </form>
                    </div>

                    <div className="right-text">
                        <Link className="pr-[40px]" to="/login">로그인</Link> {/* a를 Link로 변경 */}
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header