import styled from "styled-components"

export const TaglineWrapper = styled.div`
  display: flex;
  align-items: center;

  font-size: 20px;
  height: 40px;
  overflow: hidden;
`

export const StaticText = styled.span`
  height: 40px;
  display: flex;
  align-items: center;
`

export const OptionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-self: start;
  margin-left: 5px;

  animation: 15s cubic-bezier(1, -0.86, 0, 1)
    ${({ taglineKeyframes }) => taglineKeyframes} infinite;
`

export const Option = styled.span`
  height: 40px;
  display: flex;
  align-items: center;
  font-weight: bold;
  transform-origin: 50% 100%;
`
