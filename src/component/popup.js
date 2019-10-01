import React,{Component,useState} from 'react';
import {Modal,Button} from 'react-bootstrap'

class PopupModal extends Component {

constructor(props)
{

    super(props);
    this.state = {
      Modalbodycontent: "Modal title",
      Modalheadercontent: "Modal body text goes here."
    };
}

  render() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
      <>
        <div>
          <Button variant="primary" onClick={handleShow}>
            Open Modal
          </Button>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Modal heading</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Woohoo, you're reading this text in a modal!
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" onClick={handleClose}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </>
    );
  }
}
export default PopupModal;