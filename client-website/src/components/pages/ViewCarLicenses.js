import React, { Component } from 'react'
import LinearDeterminate from "../layout/loading/CustomizedProgress"
import LicenseCard from '../cards/LicenseCard';
import CarLicenseCards from '../cards/CarLicenseCards';

class ViewCarLicenses extends Component {
  constructor (props) {
    super(props)
    this.state =  { // id : this.params.id,
          licenses: [],
          isLoadied: false

        }
   
  }

  componentDidMount () {
    fetch(`http://localhost:3000/moderator/view/carLicenseRequests`, {
      headers: new Headers({
        'x-access-token': sessionStorage.getItem("jwtToken")
      }) })
      .then(response => response.json())
      .then(json => {
        this.setState({ isLoadied: true,
          licenses: json.data.reverse() })
          console.log(json)
      })
  }

 
  render () {
    var { isLoadied } = this.state
    if (!isLoadied) { return <LinearDeterminate/>} else {
        if(!this.state.licenses){
            return (<div><link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous"></link>
            <br/>
               <h1 class="display-4" align="center">There is no Pending Requests</h1></div>)
        }
        else{
      const listItems =
      this.state.licenses.map((element, i) => (
        <div align="center">
          <CarLicenseCards key={i} title={'helo'} 
          name={element.firstName+" "+element.lastName}
           licensePic={element.car.licenseLink}
           date={element.car.dateAdded}
            id={element.car._id}
            expiryDate={element.car.licenseExpiryDate}
            plateNumber={element.car.plateNumber}
            carPhotos={element.car.photosLink}
            make={element.car.make}
            model={element.car.model}
            year={element.car.year}
          />
          <br />
        </div>
      ))

      return (

        <div>
            <br/>
             <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous"></link>
          <h1 class="display-4" align="center">Car Licenses</h1>
         
<br/>
                {listItems}

        </div>

      )
    }
  }
}
}
export default ViewCarLicenses
