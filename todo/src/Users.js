import React from 'react';
import Axios from 'axios';

export class Users extends React.Component {


    render() {
        return (
            <div>
                <Login onSubmit={this.props.onSubmit} />
                <br />
                <br />
                <br />
                <br />
            </div>
        );
    }
}
class Login extends React.Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.state = {
            username: "",
            submitFunc: this.props.onSubmit,
            signedIn: false,
            correct: ""

        }
    }
    newUser(e) {
        e.preventDefault()
        let username = this.username2.value;
        let password = this.password2.value;

        Axios.post('api/v1/users', {
            user: {
                username: username,
                password: password

            }
        });
        this.state.submitFunc(username, password,true);
            this.setState({
                username: username,
                signedIn: true
            })
        

    }

    handleClick(e) {
        e.preventDefault();
        
        let params = this.state.submitFunc(this.username.value, this.password.value,false);
        
        if (params[0]) {
            this.setState({
                username: params[1],
                signedIn: true
            })
        } else {
            this.setState({
                correct: "Incorrect Username or Password!"
            })
        }
    }
    render() {

        if (this.state.signedIn) {
            return (
                <div><p>Signed in as: {this.state.username}</p></div>
            );
        } else {
            return (
                <div>
                    <form onSubmit={(e) => (this.handleClick(e))}>
                        Username:
                    <input ref={(a) => this.username = a}></input>
                    Password
                    <input type="password" ref={(a) => this.password = a}></input>
                        <button type="submit" >Sign In</button>
                        <br />
                        {this.state.correct}
                    </form>
                    <br />
                    <form onSubmit={(e) => this.newUser(e)}>
                        Username:
                    <input ref={(a) => this.username2 = a}></input>
                    Password
                    <input type="password" ref={(a) => this.password2 = a}></input>
                        <button type="submit" >Create New User</button>
                        <br />

                    </form>
                </div>
            );
        }

    }

}