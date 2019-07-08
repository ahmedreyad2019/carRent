import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography'
import CardActionArea from '@material-ui/core/CardActionArea';
var dateFormat = require('dateformat');

const styles = {
  card: {
    minWidth: 275,
    width:500,
    margin:8,
    borderRadius: 3,
    border: 0,
    padding: '0 30px',
    boxShadow: '0 3px 5px 2px rgba(21, 33, 99, .3)',
    
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)'
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  }
}

class LicenseCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      comment: null,
      response:null
    }
    this.acceptHandler = this.acceptHandler.bind(this)
    this.rejectHandler = this.rejectHandler.bind(this)
 
  }

  rejectHandler(){
    fetch('https://carrentalserver.herokuapp.com/moderator/view/drivingLicenseRequests/'+this.props.id+'/respond', {
        method: 'PUT',
        body: JSON.stringify({"response":"Rejected"}),
        headers: {
          'Content-Type': 'application/json',
          'x-access-token':sessionStorage.getItem('jwtToken')
        }
      }).then(response => {
        response.json().then(data => {
          if (data.error) {
            alert(data.error)
          } else {
            console.log('Successful' + data + data.auth)
            alert("License Rejected")
            document.location.href="/profile"
          }
        })
      })
}
  acceptHandler(){
    fetch('https://carrentalserver.herokuapp.com/moderator/view/drivingLicenseRequests/'+this.props.id+'/respond', {
        method: 'PUT',
        body: JSON.stringify({"response":"Accepted"}),
        headers: {
          'Content-Type': 'application/json',
          'x-access-token':sessionStorage.getItem('jwtToken')
        }
      }).then(response => {
        response.json().then(data => {
          if (data.error) {
            alert(data.error)
          } else {
            console.log('Successful' + data + "Accepted")
            alert("License Accepted")
            document.location.href="/profile"
          }
        })
      })
}

  render() {
    const { classes } = this.props
    console.log("Proooops: "+this.props.pic)
    return (
        <div>
      <Card className={classes.card}>
       <CardActionArea>
        <CardMedia
        square
        style = {{ height: 0, paddingTop: '40%'}}
          className={classes.media}
          image={this.props.pic}
          title="Driver Licenses"
          onClick={()=>{ window.open(this.props.pic, "_blank")}}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {this.props.name}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
           {"License Expiry Date:"+dateFormat(this.props.expiryDate,"yyyy-mm-dd")}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
           {"Date Submitted:"+dateFormat(this.props.date)}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActionArea>
        <Button name="a" id="a" size="small" color="primary" onClick={()=>{this.acceptHandler()}}>
          Accept
        </Button>
        <Button name ="b" id = "b"size="small" color="primary" onClick={()=>{this.rejectHandler()}}>
          Reject
        </Button>
        </CardActionArea>
      </Card>
<br/>
      </div>
    )
  }
}

LicenseCard.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(LicenseCard)
