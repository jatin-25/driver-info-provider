import React, { Component } from "react";
import './AddDriver.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "../../axios";
import { connect } from "react-redux";
import Modal from "../PopUp/Modal";
class AddDriver extends Component{
    state = {
        driverForm: {
            firstName: {
                name: "First Name",
                elementType: 'text',
                elementConfig: {
                    type: 'text',
                    placeholder: ' First Name'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false,
                error: "First Name can't be Empty!"
            },
            lastName: {
                name: "Last Name",
                elementType: 'text',
                elementConfig: {
                    type: 'text',
                    placeholder: ' Last Name'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false,
                error: "Last Name can't be Empty!"
            },
            dob: {
                name: "Date Of Birth",
                elementType: 'date',
                elementConfig: {
                    placeholderText: "Date Of Birth"
                },
                value: null,
                validation: {
                    required: true
                },
                valid: false,
                touched: false,
                error: "Date Of Birth can't be Empty!"
            },
            licenseNo: {
                name: "License No.",
                elementType: 'text',
                elementConfig: {
                    type: 'text',
                    placeholder: ' License No.'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false,
                error: "License No. can't be Empty!"
            },
            licenseExpirationDate: {
                name: "License Expiration Date",
                elementType: 'date',
                elementConfig: {
                    placeholderText: ' License Expiration Date'
                },
                value: null,
                validation: {
                    required: true
                },
                valid: false,
                touched: false,
                error: "License Expiration Date can't be Empty!"
            },
            email: {
                name: "Email",
                elementType: 'text',
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
                touched: false,
                error: "Email can't be Empty."
            },
            phoneNo: {
                name: "Phone No.",
                elementType: 'text',
                elementConfig: {
                    type: 'text',
                    placeholder: ' Phone Number'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 10,
                    maxLength: 13
                },
                valid: false,
                touched: false,
                error: "Phone Number can't be Empty!"
            },
        },
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
         if (rules.required) {
             let valid = null;
             if (elementIdentifier === 'dob' || elementIdentifier === 'licenseExpirationDate')
                 valid = value !== '';
             else
                valid = (value.trim() !== '');
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
        let newForm = { ...this.state.driverForm };
        const updatedFormElement = { ...newForm[elementIdentifier] }
        // console.log(updatedFormElement);
        if (elementIdentifier === 'dob' || elementIdentifier === 'licenseExpirationDate') {
            updatedFormElement.value = event;
            // console.log(event);
        }
        else
            updatedFormElement.value = event.target.value;
        
        const errorObject = this.checkValidation(updatedFormElement.value, updatedFormElement.validation, elementIdentifier);
        // console.log(errorObject);
        updatedFormElement.valid = errorObject.valid;
        updatedFormElement.error = errorObject.error;
        updatedFormElement.touched = true;
        newForm[elementIdentifier] = updatedFormElement;
        // console.log()
        this.setState({ driverForm: newForm});
    }

    onAddDriverClickedHandler = () => {
        let formData = {};
        const driverForm = {...this.state.driverForm };
        let isFormValid = true;
        for (let element in driverForm) {
            isFormValid = isFormValid && driverForm[element].valid;
        }
        // console.log(isFormValid);
        if (!isFormValid) {
            this.setState({ showErrors: true });
        }
        else {
            for (let element in driverForm) {
                formData[element] = driverForm[element].value;
            }
            axios.post("/users/"+this.props.userId+"/driversList.json?auth="+this.props.token, formData).then(response => {
                // console.log(response);
            });
            
        }
    }
    render() {

        const addDriverKeys = Object.keys(this.state.driverForm);
        const addDriverObjectArr = Object.values(this.state.driverForm);
        const formElements = addDriverObjectArr.map((elementData, i) => {
            if (elementData.elementType === 'text') {
                return <div key={i} className="inputElements">
                    <input
                        {...elementData.elementConfig}
                        value={elementData.value}
                        onChange={(event) => this.onInputChangeHandler(event, addDriverKeys[i])}
                    />
                </div>
            }
            else {
                return <div className="inputElements" key={i}>
                    <DatePicker
                        className="date-picker"
                        selected={elementData.value}
                        onChange={(date) => this.onInputChangeHandler(date, addDriverKeys[i])}
                        showYearDropdown
                        scrollableMonthYearDropdown
                        scrollableYearDropdown
                        {...elementData.elementConfig}
                    />
                    </div>
            }
        })

        let driverFormErrorMessage = null;

        if (this.state.showErrors) {
            driverFormErrorMessage = addDriverObjectArr.map((elementData, i) => {
                return <p key={i} className="errorElement">{elementData.error}</p>
            })
        }
        
        return (
            <div className="add-driver">
                <h5>Driver Registration Form</h5>
                <Modal show = {this.state.showErrors} click = {() => this.setState({showErrors: false})}>
                {driverFormErrorMessage}
                </Modal>
                <div className="registration-contents">
                    {formElements}
                </div>
                <div className="button-container">
                    <button onClick={() => this.onAddDriverClickedHandler()}>Add Driver</button>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        token: state.auth.token,
        userId: state.auth.userId
    }
}
export default connect(mapStateToProps)(AddDriver);