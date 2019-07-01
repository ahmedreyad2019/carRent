
import React, { Component } from 'react'
// import SimpleCard from '../cards/SimpleCard3'
import ViewLawyersByAdminCard from '../cards/ModeratorCards'
import LinearDeterminate from "../layout/loading/CustomizedProgress"
class ViewModerators extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      lawyersOnSystem: [],
      isLoaded:false

    }
  }

  componentDidMount () {
    // insert the method by replacing the below one
    
      fetch('http://localhost:3000/moderator/', {
        headers: new Headers({
          'x-access-token': this.props.token
        })
      })

        .then(res => res.json())
        .then(json => {
          this.setState({ isLoaded:true,
            lawyersOnSystem: json.data
          })
        })
    
  }

  render () {

if(!this.state.isLoaded){return <LinearDeterminate/>}
    const listItems = this.state.lawyersOnSystem.map((item, i) => (
      <div>
        <ViewLawyersByAdminCard key={i}
          id={item._id}
          firstName={item.firstName}
          lastName={item.lastName}
          email={item.email}
          mobileNumber={item.mobileNumber}
        />
        <br />
      </div>)
    )

    return (
      <div>
          <br/>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous"></link>
          <h1 class="display-3" align="center">Moderators</h1>
        {listItems}
        <br />

      </div>

    )
  }
}

export default ViewModerators