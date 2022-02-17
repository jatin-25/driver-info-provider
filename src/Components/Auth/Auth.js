import React, { Component } from "react";
import * as actions from '../../Store/Actions/index';
import { connect } from "react-redux";
import './Auth.css';
class Auth extends Component{
    state = {
        form: {
            Email: {
                
                elementConfig: {
                    type: 'email',
                    placeholder: ' Email ID'
                },
                value: '',
                validation: {
                    required: true,
                    isEmail: true
                },
                valid: false,
                error: "Email can't be Empty."
            },
            Password: {
                elementConfig: {
                    type: 'password',
                    placeholder: ' Password'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 6
                },
                valid: false,
                error: "Password can't be Empty.",
            }
        },
        isFormValid: false,
        isSignUp: false,
        showErrors: false
    }

    checkValidation = (value, rules,elementIdentifier) => {
        let isValid = true;
        let error = "";
        
        if (rules.maxLength) {
            const valid = (value.length <= rules.maxLength);
            isValid = isValid && valid;
            if (!valid) {
                error = "The Maximum Length of "+elementIdentifier + " is "+rules.maxLength+".";
            }
        }
        if (rules.minLength) {
            const valid = (value.length >= rules.minLength);
            isValid = isValid && valid
            if (!valid) {
                error = elementIdentifier + " must be atleast "+rules.minLength+" characters long.";
            }
        }
        if (rules.isEmail) {
            const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
            const valid = pattern.test(value);
            isValid = valid && isValid;

            if(!valid) {
                error = elementIdentifier + " is Invalid.";
            }
        }
        
        // if (rules.isNumeric) {
        //     const pattern = /^\d+$/;
        //     isValid = pattern.test(value) && isValid
        // }
        if (rules.required) {
            const valid = (value.trim() !== '');
            isValid = isValid && valid;
            if (!valid) {
                error = elementIdentifier + " can't be Empty.";
            }
        }
        return {
            valid: isValid,
            error: error
        }
    }

    onInputChangeHandler = (event, elementIdentifier) => {
        this.setState({showErrors: false})
        let newForm = { ...this.state.form };
        const updatedFormElement = { ...newForm[elementIdentifier] }
        updatedFormElement.value = event.target.value;

        const errorObject = this.checkValidation(updatedFormElement.value, updatedFormElement.validation,elementIdentifier);
        updatedFormElement.valid = errorObject.valid;
        updatedFormElement.error = errorObject.error;
        newForm[elementIdentifier] = updatedFormElement;
        let isFormValid = true;
        const authForm = this.state.form;
        for (let element in authForm) {
            // console.log(authForm[element]);
            isFormValid = isFormValid && authForm[element].valid;
        }
        if (isFormValid) {
            this.setState({showErrors: false,isFormValid: true})
        }
        else {
            this.setState({isFormValid: false})
        }
        this.setState({ form: newForm});
    }

    submitHandler = (event) => {
        event.preventDefault();
        let formData = null;
        if (!this.state.isFormValid) {
            this.setState({ showErrors: true });
        }
        else {
            formData = {
                email: this.state.form.Email.value,
                password: this.state.form.Password.value,
            }
            this.props.onAuth(formData, this.state.isSignUp);
        }
        }
    render() {
        const formKeyArr = Object.keys(this.state.form);
        const formObjectArr = Object.values(this.state.form).slice(0,2);
        // console.log(formObject);
         const formElements = formObjectArr.map((elementData, i) => {
             return <div key={i} className='auth-element-content'>
                    <p>{formKeyArr[i]}</p>
                    <input
                        {...elementData.elementConfig}
                        value={elementData.value}
                        onChange={(event) => this.onInputChangeHandler(event,formKeyArr[i])}
                    />
                 </div>
         })
        
        let errorMessages = null;
        if (this.state.showErrors) {
            errorMessages = formObjectArr.map((elementData, i) => {
                return <p key={i}>{elementData.error}</p>
            })
        }
        if (this.state.isFormValid && this.props.error) {
            // console.log(this.state.isFormValid,this.props.error)
            let errorMessage = this.props.error.message;
            let em = errorMessage.split("_");
            let lowerCase = em.map((word) => word.toLowerCase());
            let ans = lowerCase.map((word) => word.charAt(0).toUpperCase() + word.slice(1));
            errorMessage = ans.join(" ");
            errorMessages = <p>{errorMessage}</p>
        }
        return (
            <div className="auth">
                <h4>Driver Info Provider</h4>
                <div className="auth-content">
                    <p className="sub-head">{this.state.isSignUp ? "SignUp" : "SignIn"}</p>
                    {this.state.showErrors || this.props.error ? <div className="error-content">
                        {/* {console.log( this.props.error,errorMessages)} */}
                        {errorMessages}
                    </div> : null}
                    {formElements}
                    <p onClick={() => this.setState({isSignUp: !this.state.isSignUp})} className="change">{this.state.isSignUp ? "Already have an account? Click to SignIn" : "Don't have an account? Click Here"}</p>
                    <button onClick={this.submitHandler}>Submit</button>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        error: state.auth.error,
        loading: state.auth.loading,
        isAuthenticated: state.auth.token != null
    }
}
const mapDispatchToProps = dispatch => {
    return {
        onAuth: (formData, isSignIn) => dispatch(actions.auth(formData, isSignIn))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Auth);