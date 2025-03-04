import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Payments from "./Payments";
import './app.css'

class Header extends Component {
  state = { menuOpen: false };

  toggleMenu = () => {
    this.setState({ menuOpen: !this.state.menuOpen });
  };

  renderContent() {
    switch (this.props.auth) {
      case null:
        return;
      case false:
        return (
          <li>
            <a href="/auth/google">Login with Google</a>
          </li>
        );
      default:
        return (
          <>
            <Payments />
            <li style={{ margin: "0 10px" }}>
              Credits: {this.props.auth.credits}
            </li>
            <li>
              <a href="/surveys">SurveyList</a>
            </li>
            <li>
              <a href="/api/logout">LogOut</a>
            </li>
          </>
        );
    }
  }

  render() {
    return (
      <nav>
        <div className="nav-wrapper">
          <Link to={this.props.auth ? "/surveys" : "/"} className="brand-logo">
            Emaily
          </Link>
          <span className="menu-toggle" onClick={this.toggleMenu}>
            ☰
          </span>
          <ul id="nav-mobile" className={this.state.menuOpen ? "show" : ""}>
            {this.renderContent()}
          </ul>
        </div>
      </nav>
    );
  }
}

function mapStateToProps(state) {
  return { auth: state.auth };
}

export default connect(mapStateToProps)(Header);
