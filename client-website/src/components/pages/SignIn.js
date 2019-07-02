import React, { Component } from "react";


class SignIn extends React.Component {
    constructor (props) {
      super(props)
      this.state = {
        email: '',
        password: '',
      }
    }

handleRegister (e) {
    e.preventDefault()
    let Admindata = this.state
    fetch('http://localhost:3000/admin/login', {
      method: 'POST',
      body: JSON.stringify(Admindata),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      response.json().then(data => {
       
        sessionStorage.setItem('jwtToken', data.token)
        sessionStorage.setItem('id', data.id)
        if (data.auth) {
          sessionStorage.setItem('type', 'a')
          sessionStorage.setItem('auth', true)
          document.location.href = '/profile'
        } else {
          fetch('http://localhost:3000/moderator/login', {
            method: 'POST',
            body: JSON.stringify(Admindata),
            headers: {
              'Content-Type': 'application/json'
            }
          }).then(response => {
            response.json().then(data => {
             
              sessionStorage.setItem('jwtToken', data.token)
              sessionStorage.setItem('id', data.id)
              if (data.auth) {
                sessionStorage.setItem('type', 'm')
                sessionStorage.setItem('auth', true)
                document.location.href = '/profile'
              }
            })})
        }
      })
    })
  }

  handleInput (e) {
    let value = e.target.value
    let name = e.target.name
    this.setState(prevState => {
      return {
        
          ...prevState.admin, [name]: value
        
      }
    }, () => console.log(this.state)
    )
  }

  render () {

    

    return(
        <div align="center" style={{verticalAlign:"center",paddingTop:"10%"}}>
        <div class="card" style={{width: "35%", padding:50}} align="center">
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous"></link>
        <form>
  <div class="form-group">
       
          <h1 class="display-4" align="center">Sign In</h1>
          <br/>
    <label for="exampleInputEmail1">Email address</label>
    <div class="input-group mb-3">
    <div class="input-group-prepend">
    <span class="input-group-text" id="basic-addon1">@</span>
  </div>
    <input name="email" type="email" aria-describedby="basic-addon1" style={{width:"50%"}}class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" onChange={(e)=>{this.handleInput(e)}}/>
    </div>
    <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
  </div>
  <div class="form-group">
    <label for="exampleInputPassword1">Password</label>
    <input name="password" type="password" style={{width:"90%"}} class="form-control" id="exampleInputPassword1" placeholder="Password" onChange={(e)=>{this.handleInput(e)}}/>
  </div>
  <button type="submit" class="btn btn-primary" onClick={(e)=>{this.handleRegister(e)}}>Submit</button>
</form>
</div>
</div>
    )

  }




}
export default SignIn
