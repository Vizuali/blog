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
          <p style={{color: "pink", fontSize: 50, fontWeight: 'bold'}}>
            Visual Computing  2020
          </p>
          <h2>Juan Camilo Cárdenas Gómez</h2>
          <h2>Iván Andrés Lemus Moreno</h2>
          <h2>Michael Guerrero</h2>
          <br/>
          <Link to="/blog">
            <Button type="primary" size="large" icon="file" style={{marginRight: 10, background: "pink", border: "pink"}}>Blog</Button>
          </Link>
          <Button type="primary" size="large" icon="github" href="https://github.com/vizuali/">Github</Button>
        </div>
      </div>
    </Layout>
  )
}

export default IndexPage