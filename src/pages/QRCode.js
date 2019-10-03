import React from 'react'


class QRCode extends React.Component{
    constructor(props)
    {
        super(props);
        this.state={
          qrcode:''
        }
    }
   componentDidMount()
   {
      this.setState={qrcode:window.localStorage.getItem('qrcode')}
   }
    render()
    {
        var React = require('react');
        var QRCode = require('qrcode.react');
        let{qrcode}=this.state;
        return(
            <div>
            <QRCode
              id="qrcodegen"
              value={qrcode}
              size={290}
              level={"H"}
              includeMargin={true}
            />
           
          </div>
        )
    }
}

export default QRCode;