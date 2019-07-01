
import React, { Component } from 'react'
// import SimpleCard from '../cards/SimpleCard3'
import ViewLawyersByAdminCard from '../cards/AdminCards'
import LinearDeterminate from "../layout/loading/CustomizedProgress"
class ViewAdmins extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      lawyersOnSystem: [],
      isLoaded:false

    }
  }

  componentDidMount () {
    // insert the method by replacing the below one
    
      fetch('http://localhost:3000/admin/', {
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
          token={this.props.token}
          id={item._id}
          firstName={item.firstName}
          middleName={item.middleName}
          lastName={item.lastName}
          email={item.email}
          salary={item.salary}
          mobileNumber={item.mobileNumber}
          birthDate={item.birthDate}
          yearsOfExperience={item.yearsOfExperience}

        />
        <br />
      </div>)
    )

    return (
      <div>
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous"></link>
       <br/>
          <h1 class="display-3" align="center">Admins</h1>
        {listItems}
        <br />

      </div>

    )
  }
}

export default ViewAdmins