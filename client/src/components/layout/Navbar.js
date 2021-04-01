import React, {Fragment} from 'react';
import {Link, Redirect} from "react-router-dom";
import { connect} from 'react-redux';
import { logout } from '../../actions/auth';
import PropTypes from 'prop-types';

const Navbar= ({ auth: {isAuthenticated,loading},logout }) =>{
    const authLink= (
        <ul>
            <li>
                <a   onClick={logout} href="/#!">
                    <i className="fas fa-sign-out-alt"></i>{' '}
                    <span className="hide-sm" > Logout</span></a>
            </li>

        </ul>
        );
    const guesLink= (
    <ul>
        <li><Link to="#!">Developers</Link></li>
        <li><Link to="/register">Register</Link></li>
        <li><Link to="/login">Login</Link></li>
    </ul>
    );
    return (
        <nav className="navbar bg-dark">
            <h1>
                <Link to="/"><i className="fas fa-code"></i> DevConnector</Link>
            </h1>

            {!loading && (<Fragment>{isAuthenticated ? authLink : guesLink}</Fragment>)}

        </nav>
    )
}

Navbar.prototype = {
    logout: PropTypes.func.isRequired,
    auth:PropTypes.bool
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps,{ logout}) (Navbar);