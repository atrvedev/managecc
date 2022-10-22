import React, { useState } from 'react';
import { Container, Col, Row } from "reactstrap";
import { Input, Button, message } from "antd"
import { Link, useNavigate } from "react-router-dom";
import APIService from '../service/APIService'


const Login = () => {
  let navigate = useNavigate();
  const [user, setUser] = useState("089898989");
  const [pass, setPass] = useState("123321");

  async function login(username, password, customer) {
    try {
      const data = await APIService.login(username, password, 'customer_00001');
      if (data) {
        window.localStorage.setItem('token', data.token)
        window.localStorage.setItem('name', username)
        setTimeout(() => {
          navigate('/home');
        }, 300);
        
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Container
      style={{
        backgroundColor: "white",
        width: window.innerWidth,
        height: window.innerHeight,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
      fluid
    >
      <img src={require('./../icon.png')} width={150} style={{ marginBottom: 30 }} />
      <div
        style={{
          padding: 20,
          flexDirection: "column",
          display: "flex",
          borderRadius: 6,
          width: "350px",
          backgroundColor: "white",
          boxShadow: "0px 0px 8px #9E9E9E"
        }}
      >
        <p style={{ fontSize: 18, fontWeight: "bold", color: "#616469" }}>SIGN IN</p>
        <p style={{ fontSize: 16, padding: 0 }}>Login to your Admin account</p>
        <div style={{ marginTop: 10 }}>
          <p style={{ fontSize: 16, fontWeight: "bold" }}>Username</p>
          <Input size="small" value={user} style={{ fontSize: 14, height: 40, marginTop: 4 }} placeholder="Enter your Username" onChange={(e) => {
            setUser(e.target.value);
          }} />
        </div>
        <div style={{ marginTop: 10 }}>
          <p style={{ fontSize: 16, fontWeight: "bold" }}>Password</p>
          <Input.Password value={pass} size="small" style={{ fontSize: 14, height: 40, marginTop: 4 }} placeholder="Enter your Password" onChange={(e) => {
            setPass(e.target.value);
          }} />
        </div>

        <Button size="middle" style={{ fontSize: 16, fontWeight: "bold", marginTop: 10, backgroundColor: "#ff3301", borderWidth: 0, color: "white" }} onClick={() => {
          let domain = window.location.hostname
          let domainSlice = domain.slice(0, domain.indexOf('.'))
          login(user, pass, domainSlice)

        }}>Sign In</Button>

      </div>
    </Container>
  );

}

export default Login;
