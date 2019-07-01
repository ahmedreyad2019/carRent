import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class DeleteAdmin extends React.Component {
  state = {
    open: false,
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleClose2 = e => {
    this.setState({ open: false });
    this.deleteLawyer(e);
  };

  deleteLawyer()
{
  fetch(`http://localhost:3000/admin/DeleteAdmin/${this.props.id}`, {
    method: "DELETE",
   
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': sessionStorage.getItem("jwtToken")
    }
  }).then(response => {
   console.log(response)
    alert( sessionStorage.getItem('lang')==='en'? 'Admin Deleted': ' تم مسح المحامى بنجاح')
    window.location.reload();
  })
 }


  render() {
    return (
      <div>
        <Button variant="contained" color="secondary" onClick={this.handleClickOpen}>
        {sessionStorage.getItem('lang')==='en'? 'Delete Admin': 'الغاء بيانات المحامى '}
        </Button>
        <Dialog
          open={this.state.open}
          TransitionComponent={Transition}
          keepMounted
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">
             {sessionStorage.getItem('lang')==='en'? 'Delete this Admin': 'هل تريد حقا الغاء بيانات المحامى'},
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
            {sessionStorage.getItem('lang')==='en'? 'Are you sure you want to procees': 'هل انت متاكد من الاستمرار فى العمليه'},

            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
            {sessionStorage.getItem('lang')==='en'? 'Disagree': 'غير موافق'},
            </Button>
            <Button onClick={this.handleClose2}  color="primary">
            {sessionStorage.getItem('lang')==='en'? 'Agree': 'موافق '},
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default DeleteAdmin;