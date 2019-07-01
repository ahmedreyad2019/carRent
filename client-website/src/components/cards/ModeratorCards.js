import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import DeleteLawyerButton from '../buttons/DeleteModerator'
import Typography from '@material-ui/core/Typography'
// import Button2 from '../buttons/Button2'
const styles = {
  card: {
    minWidth: 20,
    backgroundColor: 'linear-gradient(to top, #000000, #DCDCDC)'
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

function ModeratorCards(props) {
  const { classes, backgroundColor } = props
  const bull = <span className={classes.bullet}>•</span>

  return (
    <Card className={classes.card} style={{ backgroundColor }}>
      <CardContent>
        <Typography
          className={classes.title}
          color="textSecondary"
          gutterBottom
        >
          {/* status: {props.status} */}
          {/* Birth Date: {props.birthDate} */}
        </Typography>
        <Typography variant="h5" component="h2">
          {/* {props.nameInEnglish} */}
          {props.firstName}
          <br />
          {props.lastName}
        </Typography>
        <Typography className={classes.pos} >
          {/* {props.addressHQ} */}
          {sessionStorage.getItem('lang') === 'en' ? 'Email ' : 'البريد'}:
          {props.email}
          <br />
          {sessionStorage.getItem('lang') === 'en'
            ? 'Phone Number'
            : 'رقم الهاتف'}
          :{props.mobileNumber}
        </Typography>

      </CardContent>
      <CardActions>
        <DeleteLawyerButton token={props.token} id={props.id} />
      </CardActions>
    </Card>
  )
}

ModeratorCards.propTypes = {
  classes: PropTypes.object.isRequired
}
export default withStyles(styles)(ModeratorCards)
