import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {username: '', password: '', errormsg: ''}

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitLogin = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const option = {
      method: 'POST',
      body: JSON.stringify({
        username,
        password,
      }),
    }
    const response = await fetch('https://apis.ccbp.in/login', option)
    const data = await response.json()
    if (response.ok === true) {
      Cookies.set('jwt_token', data.jwt_token, {expires: 30})
      const {history} = this.props
      history.replace('/')
    } else {
      this.setState({errormsg: data.error_msg})
    }
  }

  render() {
    const {username, password, errormsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-bg">
        <form onSubmit={this.onSubmitLogin} className="jobby-login">
          <img
            className="login-logo"
            alt="website logo"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          />
          <div className="login-input-container">
            <label className="login-label" htmlFor="username">
              USERNAME
            </label>
            <input
              onChange={this.onChangeUsername}
              value={username}
              className="login-input"
              id="username"
              type="text"
              placeholder="Username"
            />
          </div>
          <div className="login-input-container">
            <label className="login-label" htmlFor="password">
              PASSWORD
            </label>
            <input
              onChange={this.onChangePassword}
              value={password}
              className="login-input"
              id="password"
              type="password"
              placeholder="Password"
            />
          </div>
          <button className="login-button" type="submit">
            Login
          </button>
          {errormsg !== '' && <p className="error">{`*${errormsg}`}</p>}
        </form>
      </div>
    )
  }
}

export default Login
