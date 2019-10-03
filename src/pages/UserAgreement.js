import React, { Component } from "react";
import cross from "./../assets/img/close.png";

class UserAgreement extends Component {
  render() {
    return (
      <section className="login-between">
        <div className="login-sect user-agreement-sect">
          <div className="login-cntr">
            <div className="position-relative">
              <h2>User Agreement</h2>
              <a href="#!" className="user-agree-close">
                <img src={cross} alt="cross icon" />
              </a>
            </div>
            <div className="login-fields-cntr">
              <iframe
                src="https://vizio.atafreight.com/WebVizio_3_0/TAndC/ClickToAccept.pdf#toolbar=0&navpanes=0&scrollbar=0"
                type="application/pdf"
                className="agreement-pdf"
              ></iframe>
            </div>
            <div className="text-right user-agreement-butns">
              <button
                type="button"
                className="butn blue-butn"
                onClick={this.handleSubmit}
              >
                Accept
              </button>
              <button
                type="button"
                className="butn cancel-butn"
                // onClick={() => this.handleSubmit()}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default UserAgreement;
