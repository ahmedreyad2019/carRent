
import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: '100%'
  },
  dense: {
    marginTop: 16
  },
  menu: {
    width: 300
  }
})

class Required extends React.Component {
  render () {
    const { classes } = this.props
    return (
      <React.Fragment>
        <TextField
          required
          id='outlined-required'
          name={this.props.name}
          label={this.props.field}
          className={classes.textField}
          margin='normal'
          variant='outlined'
          type={this.props.type}
          onChange={this.props.callBack}

        />
        <br />
      </React.Fragment>
    )
  }
}
Required.propTypes = {
  classes: PropTypes.object.isRequired
}
export default withStyles(styles)(Required)
