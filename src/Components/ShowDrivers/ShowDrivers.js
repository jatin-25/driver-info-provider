import React, { Component } from "react";
import axios from '../../axios';
import { connect } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './ShowDrivers.css';
import Collapse from '@kunukn/react-collapse';
import swal from 'sweetalert';
import Modal from '../PopUp/Modal';
class ShowDrivers extends Component{

    state = {
        driversData: [],
        rules: {
            email: {
                required: true,
                isEmail: true,
                valid: true
            },
            firstName: {
                required: true,
                valid: true
            },
            lastName: {
                required: true,
                valid: true
            },
            licenseNo: {
                required: true,
                valid: true
            },
            phoneNo: {
                required: true,
                minLength: 10,
                maxLength: 13,
                valid: true
            },
            dob: {
                required: true,
                valid: true
            },
            licenseExpirationDate: {
                required: true,
                valid: true
            }

        },
        errorArr: [],
        showInfo: {},
        isCollapsableOpen: false,
        isEditAllowed: false,
        showErrors: false,
        isFormValid: true
    }
    componentDidMount = () => {
        axios.get("/users/"+this.props.userId+"/driversList.json?auth="+this.props.token).then(response => {
            // console.log(response);
            this.setState({ driversData: Object.values(response.data), showInfo: Array(Object.values(response.data).length).fill(false)});
        })
    }
    checkValidation = (value, elementIdentifier) => {
        let isValid = true;
        let error = "";
        const rules = this.state.rules[elementIdentifier];
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

    onInputChangeHandler = (event, i, elementIdentifier) => {
        let driversForm = [...this.state.driversData];

        let formData = { ...driversForm[i] };
        if (elementIdentifier === "dob" || elementIdentifier === "licenseExpirationDate") {
            formData[elementIdentifier] = event;
            // console.log("entered");
        }
        else
            formData[elementIdentifier] = event.target.value;
        const errorObject = this.checkValidation(formData[elementIdentifier], elementIdentifier);
        // console.log(errorObject.valid);
        let errors = {...this.state.errorArr};
        errors[elementIdentifier] = errorObject.error;
            this.setState({ errorArr: errors });
            let rules = { ...this.state.rules };
            let elementRules = { ...rules[elementIdentifier] };
            elementRules.valid = errorObject.valid;
            rules[elementIdentifier] = elementRules;
            // console.log(rules);
            this.setState({rules: rules})

        driversForm[i] = formData;
        // console.log(driversForm);
        this.setState({driversData:driversForm})
    }

    onViewInfoHandler = (i) => {
        
        let showInfoArr = [...this.state.showInfo];
        if (showInfoArr.includes(true)) {
            swal("Warning", "One Driver Info is already opened!", "warning");
        }
        else {
            showInfoArr[i] = !showInfoArr[i];
            this.setState({ showInfo: showInfoArr });
        }
    }
    onSaveHandler = (i) => {
        const form = this.state.rules;
        let isFormValid = true;
        for (let element in form) {
            // console.log(element, form[element]);
            isFormValid = isFormValid && form[element].valid;
        }
        if (isFormValid) {
            axios.put('/users/' + this.props.userId + "/driversList.json?auth=" + this.props.token, this.state.driversData).then(response => {
                swal({  
                title: "Congratulations!",  
                text: "Your Data has been saved",  
                icon: "success",  
                button: "Okay",  
                });  
                let showInfoArr = [...this.state.showInfo];
            showInfoArr[i] = !showInfoArr[i];
            this.setState({ showInfo: showInfoArr });
            })
            
        }
        else {
            this.setState({ showErrors: true });
        }   
    }

    render() {
        let drivers = this.state.driversData.map((driverInfo, i) => {
            return <div key={i} className="driver-element">
                <div className="subsection">
                    <p>{driverInfo.firstName + " " + driverInfo.lastName}</p>
                    <button onClick={() => this.onViewInfoHandler(i)}>View Driver's Info</button>
                </div>
                <div>
                    <Collapse isOpen = {this.state.showInfo[i]} transition="height 0.7s cubic-bezier(.4, 0, .2, 1)" >
                        <div className="main-content">
                            <div className="each-element">
                                <p>First Name</p>
                                <p>Last Name</p>
                                <p>Date Of Birth</p>
                                <p>Email</p>
                                <p>Phone No.</p>
                                <p>License No.</p>
                                <p>License Expiration Date</p>
                            </div>
                            <div className="each-element">
                                <input type="text" value={driverInfo.firstName} onChange={(event) => this.onInputChangeHandler(event,i,"firstName")} readOnly={!this.state.isEditAllowed}></input>
                                <input type="text" value={driverInfo.lastName} onChange={(event) => this.onInputChangeHandler(event,i,"lastName")} readOnly={!this.state.isEditAllowed}></input>
                            <DatePicker
                                    className="date-picker"
                                    selected={new Date(driverInfo.dob)}
                                    onChange={(date) => this.onInputChangeHandler(date,i,"dob")}
                                    showYearDropdown
                                    scrollableMonthYearDropdown
                                    scrollableYearDropdown
                                   readOnly={!this.state.isEditAllowed}
                            />
                            <input type={"text"} value={driverInfo.email} onChange={(event) => this.onInputChangeHandler(event,i,"email")} readOnly={!this.state.isEditAllowed}></input>
                                <input type={"text"} value={driverInfo.phoneNo} onChange={(event) => this.onInputChangeHandler(event,i,"phoneNo")} readOnly={!this.state.isEditAllowed}></input>
                                 <input type={"text"} value={driverInfo.licenseNo} onChange={(event) => this.onInputChangeHandler(event,i,"licenseNo")} readOnly={!this.state.isEditAllowed}></input>
                                <DatePicker
                                    className="date-picker"
                                    selected={new Date(driverInfo.licenseExpirationDate)}
                                    onChange={(date) => this.onInputChangeHandler(date,i,"licenseExpirationDate")}
                                    showYearDropdown
                                    scrollableMonthYearDropdown
                                    scrollableYearDropdown
                                    readOnly={!this.state.isEditAllowed}
                                />
                            </div>
                            
                        </div>
                        <div className="edit-options">
                            <button onClick={() => this.setState({isEditAllowed: true})}>Edit</button>
                            <button onClick={() => this.onSaveHandler(i)}>Save</button>
                        </div>
                    </Collapse>
                    </div>
                
            </div>
        })

        let errors = null;
        if (this.state.showErrors) {
            errors = Object.values(this.state.errorArr).map((error, i) => {
                return (<p key={i}>{error}</p>);
            }
            )};
        return (
            <div className="show-drivers">
                {this.state.driversData.length === 0 ? <div className="no-data">
                    <p>No Drivers Add Till Now!</p>
                </div>:null}
                {drivers}
                <Modal show = {this.state.showErrors} click={() => this.setState({showErrors: false})}>
                    {errors}
                </Modal>
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

export default connect(mapStateToProps)(ShowDrivers);