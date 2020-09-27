import React, { Component } from 'react';
import 'whatwg-fetch';
import {getFromStorage, setInStorage} from '../../utils/storage';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      token:'',
      signUpError:'',
      signInError:'',
      signInEmail:'',
      signInPassword:'',
      signUpFirstName:'',
      signUpLastName:'',
      signUpEmail:'',
      signUpPassword:'',
      logOutError:''
    };

    this.onTextBoxChangeSignInEmail = this.onTextBoxChangeSignInEmail.bind(this);
    this.onTextBoxChangeSignInPassword = this.onTextBoxChangeSignInPassword.bind(this);
    this.onTextBoxChangeSignUpEmail = this.onTextBoxChangeSignUpEmail.bind(this);
    this.onTextBoxChangeSignUpPassword = this.onTextBoxChangeSignUpPassword.bind(this);
    this.onTextBoxChangeSignUpFirstName = this.onTextBoxChangeSignUpFirstName.bind(this);
    this.onTextBoxChangeSignUpLastName = this.onTextBoxChangeSignUpLastName.bind(this);
    this.onSignUp = this.onSignUp.bind(this);
    this.onSignIn = this.onSignIn.bind(this);
    this.onLogOut = this.onLogOut.bind(this);
  }

  componentDidMount() {
    const object = getFromStorage('the_main_app');
  
    if(object && object.token) {
      const { token } = object;
      fetch('/api/account/verify?token=' + token)
        .then(res => res.json)
        .then(json => {
          if(json.success){
            this.setState({
              token: token,
              isLoading: false
            });
          } else{
            this.setState({
              isLoading: false
            })
          }
        })
    } else{
      this.setState({
        isLoading: false
      })
    }
  }

  onTextBoxChangeSignInEmail(event) {
    this.setState({
      signInEmail: event.target.value,
    });
  }
  onTextBoxChangeSignInPassword(event) {
    this.setState({
      signInPassword: event.target.value,
    });
  }
  onTextBoxChangeSignUpEmail(event) {
    this.setState({
      signUpEmail: event.target.value,
    });
  }
  onTextBoxChangeSignUpPassword(event) {
    this.setState({
      signUpPassword: event.target.value,
    });
  }
  onTextBoxChangeSignUpFirstName(event) {
    this.setState({
      signUpFirstName: event.target.value,
    });
  }
  onTextBoxChangeSignUpLastName(event) {
    this.setState({
      signUpLastName: event.target.value,
    });
  }

  onSignIn() {
    const {signInEmail, signInPassword} = this.state;

    fetch('/api/account/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: signInEmail,
        password: signInPassword
      })
    }).then(res => res.json())
    .then(json => {
      if(json.success){
        setInStorage('the_main_app', {token: json.token})
        this.setState({
          signInError: json.message,
          isLoading: false,
          signInEmail:'',
          signInPassword:'',
          token: json.token
        });
      } else {
        this.setState({
          signInError: json.message,
          isLoading: false
        });
      }
    })
  }

  onSignUp() {
    const {signUpEmail, signUpPassword, signUpFirstName, signUpLastName} = this.state;

    fetch('/api/account/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstName: signUpFirstName,
        lastName: signUpLastName,
        email: signUpEmail,
        password: signUpPassword
      })
    }).then(res => res.json())
    .then(json => {
      if(json.success){
        this.setState({
          signUpError: json.message,
          isLoading: false,
          signUpFirstName:'',
          signUpLastName:'',
          signUpEmail:'',
          signUpPassword:''
        });
      } else {
        this.setState({
          signUpError: json.message,
          isLoading: false
        });
      }
    })
  }

  onLogOut() {
    this.setState({
      isLoading: true
    });
    const object = getFromStorage('the_main_app');
  
    if(object && object.token) {
      const { token } = object;
      fetch('/api/account/logout?token=' + token)
        .then(res => res.json)
        .then(json => {
          if(json.success){
            this.setState({
              token: '',
              isLoading: false
            });
          } else{
            this.setState({
              isLoading: false,
              logOutError: json.message
            })
          }
        })
    } else{
      this.setState({
        isLoading: false
      })
    }
  }


  render() {
    const {isLoading, token, signInEmail, signInPassword, signInError, signUpEmail, signUpFirstName, signUpPassword, signUpLastName, logOutError} = this.state;
    if(isLoading) {
      return (<div><p>Loading...</p></div>);
    }

    if(!token) {
      return(
        <div>
          <div>
            {(signInError) ? (<p>{signInError}</p>) : (null) }
            <p>Sign In</p>
            <input type="email" placeholder="Email" value={signInEmail} onChange={this.onTextBoxChangeSignInEmail}/><br/>
            <input type="password" placeholder="Password" value={signInPassword} onChange={this.onTextBoxChangeSignInPassword}/><br/>
            <button onClick={this.onSignIn}>Sign In</button>
          </div>
          <br/>
          <br/>
          <div>
            
            <p>Sign Up</p>
            <input type="text" placeholder="First Name" value={signUpFirstName} onChange={this.onTextBoxChangeSignUpFirstName}/><br/>
            <input type="text" placeholder="Last Name" value={signUpLastName} onChange={this.onTextBoxChangeSignUpLastName}/><br/>
            <input type="email" placeholder="Email" value={signUpEmail} onChange={this.onTextBoxChangeSignUpEmail}/><br/>
            <input type="password" placeholder="Password" value={signUpPassword} onChange={this.onTextBoxChangeSignUpPassword}/><br/>
            <button onClick={this.onSignUp}>Sign Up</button>
          </div>
        </div>
      );
    }
    console.log(token);

    return(
      <div>
        <p>Account: Welcome</p>
        <button onClick={this.onLogOut}>Sign Out</button>
        {(logOutError) ? (<p>{logOutError}</p>) : (null) }
      </div>
    );
    
  }
}

export default Home;
