import React from "react"
import styled from "styled-components"
import { getBaseImageSize, getImageSizeByIndex } from "./helpers"
import TreeImage from "./Image"
import Controls from "./controls"

const OuterWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 80vh;
`

const InnerWrapper = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;

  display: ${({ shouldDisplay }) => (shouldDisplay ? "block" : "none")};
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
`

const TreeWrapper = ({ images }) => {
  const onClickShowTree = () => {
    setShouldShowTree(true)
  }

  const onImageLoad = () => {
    setImagesLoadedCounter(imagesLoadedCounter + 1)
  }

  const onImageSelected = index => {
    setSelectedImageIndex(index)
  }

  const [imagesLoadedCounter, setImagesLoadedCounter] = React.useState(0)
  const [shouldShowTree, setShouldShowTree] = React.useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(-1)
  const wrapperRef = React.useRef(null)

  const isDoneLoading = imagesLoadedCounter === images.length
  const baseImageSize = getBaseImageSize(wrapperRef)

  /* TODO 
    Calculate if animation is done with JS instead of all the styled components hacks.
    use animationSpeed * images.length for total animation time
    Once shouldShowTree is true, set a timeout for the animation time. 
    When the timeout complete, remove the transition, etc
  */

  return (
    <div>
      <Controls
        isDoneLoading={isDoneLoading}
        imagesLoadedCounter={imagesLoadedCounter}
        totalImages={images.length}
        showTree={onClickShowTree}
      />
      <OuterWrapper ref={wrapperRef}>
        <InnerWrapper size={baseImageSize} shouldDisplay={shouldShowTree}>
          {images.map(({ media_url, id }, index) => {
            const sizeByIndex = getImageSizeByIndex(
              baseImageSize,
              index,
              images.length
            )
            return (
              <TreeImage
                key={id}
                size={sizeByIndex}
                imageURL={media_url}
                index={index}
                selectedImageIndex={selectedImageIndex}
                onImageLoad={onImageLoad}
                onImageSelected={onImageSelected}
              />
            )
          })}
        </InnerWrapper>
      </OuterWrapper>
    </div>
  )
}

export default TreeWrapper
