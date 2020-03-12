import React from 'react'
import Layout from '../components/Layout'
import Button from 'antd/lib/button'
import 'antd/lib/button/style/css'
import { Link } from "gatsby"

const IndexPage = () => {
  return (
    <Layout>
      <div>
        <div align="center">
        <br/>
          <p style={{color: "cornflowerblue", fontSize: 50, fontWeight: 'bold'}}>
            Visual Computing 2020-I
          </p>
          <h2>Cárdenas Gómez <span style={{color: "#EE7674"}}>Juan Camilo</span></h2>
          <h2>Guerrero Acevedo <span style={{color: "#EE7674"}}>Michael Estiven</span></h2>
          <h2>Lemus Moreno <span style={{color: "#EE7674"}}>Iván Andrés</span></h2>
          <br/>
          {/* <Link to="/docs/get-started/introduction">
            <Button type="primary" size="large" icon="right-circle" style={{marginRight: 10}}>Get Started</Button>
          </Link> */}
          <Button type="primary" size="large" icon="github" href="https://github.com/Vizuali">Github</Button>
        </div>
      </div>
    </Layout>
  )
}

export default IndexPage