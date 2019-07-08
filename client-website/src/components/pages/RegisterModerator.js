import React, { Component } from 'react'
import RequiredValidation from '../layout/inputs/Required'
import NotRequiredValidation from '../layout/inputs/NotRequired'
import AlertDialogSlide from '../layout/Dialogs/SlideDialog'
import CssBaseline from '@material-ui/core/CssBaseline'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  },
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 700,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.primary.main
  }
})
class RegisterModerator extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      investor: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        mobileNumber: ''
      },

    }
    this.handleInput = this.handleInput.bind(this)

    this.handleRegister = this.handleRegister.bind(this)
  }

  async handleRegister (e) {
    e.preventDefault()
    let userData = this.state.investor
  

    
    console.log(sessionStorage.getItem('jwtToken'))
    fetch('https://carrentalserver.herokuapp.com/moderator/', {
      method: 'POST',
      body: JSON.stringify(userData),
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

        }
      })
    })
 
  }

  handleInput (e) {
    let value = e.target.value
    let name = e.target.name
    // console.log(this.state.investor)
    this.setState(prevState => {
      return {
        investor: {
          ...prevState.investor, [name]: value
        }
      }
    }, () => console.log(this.state.investor)
    )
  }
  render () {
    const { classes } = this.props

    return (

      <main className={classes.main}>
        <link rel='stylesheet' href='https://use.fontawesome.com/releases/v5.8.1/css/all.css' integrity='sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf' crossorigin='anonymous' />
        <CssBaseline />

        <Paper className={classes.paper} elevation={16}>

          <Avatar className={classes.avatar}>
            <i class='fas fa-user-plus' />
          </Avatar>
          <Typography component='h1' variant='h5'>
          Sign up Moderator
          </Typography>
          <RequiredValidation name='firstName' field={sessionStorage.getItem('lang') === 'en' ? 'First Name' : 'الاسم كامل '} type='text' callBack={this.handleInput}/>
          <RequiredValidation name='lastName' field={sessionStorage.getItem('lang') === 'en' ? 'Last Name' : 'الاسم كامل '} type='text' callBack={this.handleInput}/>
          <RequiredValidation name='email' field={sessionStorage.getItem('lang') === 'en' ? 'Email' : 'البريد '} type='email' callBack={this.handleInput}/>
          <RequiredValidation name='password' field={sessionStorage.getItem('lang') === 'en' ? 'Password' : 'الرقم السرى '} type='password' callBack={this.handleInput} />
          <RequiredValidation name='mobileNumber' field={sessionStorage.getItem('lang') === 'en' ? 'mobileNumber' : 'نوع المستثمر '} type='text' callBack={this.handleInput}/>
          <AlertDialogSlide handleRegister={this.handleRegister} />
        </Paper>
      </main>
    )
  }
}
export default withStyles(styles)(RegisterModerator)
