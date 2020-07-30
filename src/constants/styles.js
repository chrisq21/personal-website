import styled, { keyframes } from "styled-components"

import { gray } from "./colors"
// global
export const siteBackgroundColor = gray
export const mobileBreakpoint = 768 //px
export const fadeIn = keyframes`
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
`

// hero
export const taglineHeight = 40 //px

// food selection
export const foodAnimationMaxWidth = 750 //px
