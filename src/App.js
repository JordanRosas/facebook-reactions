import React, { Component } from 'react';
import './App.css';
import Avatar from 'react-avatar-edit';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close'
import { DialogContent, DialogActions } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';

const styles = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)(props => {
  const { children, classes, onClose } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

class App extends Component{
  
    constructor(props) {
      super(props)
      this.state = {
        preview: null,
        setOpen:false,
        userCurrentImage:"",
      }
      this.onCrop = this.onCrop.bind(this)
      this.onClose = this.onClose.bind(this)
      this.onBeforeFileLoad = this.onBeforeFileLoad.bind(this)
    }

    componentDidMount(){
      this.getData()
    }
    getData(){
      fetch("http://localhost:5002/users?id=1",{
        method:"GET",
        headers:{
          "Accept": "application/json",
          "Content-Type":"application/json"
        }
      })
      .then(res => res.json())
      .then((responseJson) => {
        responseJson.map((item, key) => {
          this.setState({
            userCurrentImage: item.photoURL
          })
        })
      })
    }

    putNewImage(){
      fetch("http://localhost:5002/users/1",{
        method:"PUT",
        headers:{
          "Accept": "application/json",
          "Content-Type":"application/json"
        },
        body: JSON.stringify({
          photoURL: this.state.preview
        })
      })
      .then(res => res.json())
      .then(this.getData())
    }


    handleClickOpen = () => {
      this.setState({
        setOpen: true
      })
    };
    handleClose = () => {
      this.setState({
        setOpen: false
      })
      this.putNewImage()
    };

    onClose() {
      this.setState({setOpen: false})
    }
    
    onCrop(preview) {
      this.setState({preview})
    }
    
    onBeforeFileLoad(elem) {
      if(elem.target.files[0].size > 71680){
        alert("File is too big!");
        elem.target.value = "";
      };
    }
    renderUserImage(){
      if(this.state.userCurrentImage !== null){
        return(
          <img src={this.state.userCurrentImage} alt="Preview" />
        )
      }else{
        return(
          <p>
            Please upload a profile picture

          </p>
        )
      }
    }
    render () {
      return (
        <>
        <div className="wrapper">
          <div>
            {this.renderUserImage()}
          </div>
        <Dialog onClose={() => this.handleClose()} aria-labelledby="customized-dialog-title" open={this.state.setOpen}>
          <DialogTitle id="customized-dialog-title" onClose={this.handleClose}>
            Upload a profile image
          </DialogTitle>
          <DialogContent dividers>
            <div style={{textAlign:'center'}}>
            {this.state.preview === null ? (
              <p style={{textAlign:'center'}}>Please select an image</p>
            ):(
              <img src={this.state.preview} alt="Preview" />
            )}
            <Avatar
              width={390}
              height={295}
              onCrop={this.onCrop}
              onClose={this.onClose}
              onBeforeFileLoad={this.onBeforeFileLoad}
              src={this.state.src}
            />

          </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Save changes
            </Button>
          </DialogActions>
        </Dialog>
        <Button style={{height:60, width:10, borderRadius:'150%'}} variant="outlined" color="primary" onClick={() => this.handleClickOpen()} >
          <EditIcon  />
        </Button>
        </div>
      </>
      )
    }
  }
export default App;
