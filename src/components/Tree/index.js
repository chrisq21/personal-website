import React, { useEffect, useState, useRef } from "react"
import styled from "styled-components"
import { getBaseImageSize, getImageSizeByIndex } from "./helpers"
import TreeImage from "./Image"
import Controls from "./controls"
import { ANIMATION_SPEED_MS } from "./constants"

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
  const [shouldShowTree, setShouldShowTree] = useState(false)
  const [imagesLoadedCounter, setImagesLoadedCounter] = useState(0)
  const [selectedImageIndex, setSelectedImageIndex] = useState(-1)
  const [isInitialAnimationDone, setIsInitialAnimationDone] = useState(false)
  const wrapperRef = useRef(null)

  useEffect(() => {
    if (shouldShowTree) {
      setTimeout(() => {
        setIsInitialAnimationDone(true)
      }, images.length * ANIMATION_SPEED_MS)
    }
  }, [shouldShowTree])

  const onClickShowTree = () => {
    setShouldShowTree(true)
  }

  const onImageLoad = () => {
    setImagesLoadedCounter(imagesLoadedCounter + 1)
  }

  const onImageSelected = index => {
    setSelectedImageIndex(index)
  }

  const isDoneLoading = imagesLoadedCounter === images.length
  const baseImageSize = getBaseImageSize(wrapperRef)

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
                isInitialAnimationDone={isInitialAnimationDone}
              />
            )
          })}
        </InnerWrapper>
      </OuterWrapper>
    </div>
  )
}

export default TreeWrapper
