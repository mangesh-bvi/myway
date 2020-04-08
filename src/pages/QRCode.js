import React from "react";

class QRCode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      qrcode: "",
    };
  }
  componentDidMount() {
    if (this.props.QRCode) {
      this.setState({
        qrcode: this.props.QRCode,
      });
    }
  }
  render() {
    var QRCode = require("qrcode.react");
    let { qrcode } = this.state;
    return (
      <div>
        <QRCode
          id="qrcodegen"
          // value="https://www.google.com/"
          value={qrcode}
          size={290}
          level={"H"}
          includeMargin={true}
        />
      </div>
    );
  }
}

export default QRCode;
