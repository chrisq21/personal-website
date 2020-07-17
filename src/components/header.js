import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import styled from "styled-components"
import { headerHeight } from "../constants/styles"

const Wrapper = styled.header`
  height: ${headerHeight};

  border: 1px solid red;
`

const Header = ({ siteTitle }) => (
  <Wrapper>
    <div>
      <h1 style={{ margin: 0 }}>
        <Link to="/">{siteTitle}</Link>
      </h1>
    </div>
  </Wrapper>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
