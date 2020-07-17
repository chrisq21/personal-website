/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { siteBackgroundColor } from "../constants/styles"

import Header from "./header"
import "./layout.css"
import styled from "styled-components"

const LayoutWrapper = styled.div`
  background-image: linear-gradient(to right, rgb(52, 49, 60), rgb(30, 30, 30));
`

const Layout = ({ children }) => (
  <LayoutWrapper>
    <div
      id="container"
      style={{
        margin: `0 auto`,
        maxWidth: 960,
      }}
    >
      <main>{children}</main>
      <footer></footer>
    </div>
  </LayoutWrapper>
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
