import React from "react";
import './Modal.css';
const modal = (props) => {
    return (
        <div className="Modal" style={{transform: props.show ? "translate(-50%,0)": "translate(-50%,-100vh)", opacity: props.show ? "1": "0"}}>
            {props.show ? props.children : null}
            <button onClick={() => props.click()}>Okay</button>
        </div>
    );
}

export default modal;