import React, { useEffect, useState, useRef, useLayoutEffect } from "react"
import styled from "styled-components"
import { getBaseImageSize, getImageSizeByIndex } from "./helpers"
import TreeImage from "./Image"
import { ANIMATION_SPEED_MS } from "./constants"

const OuterWrapper = styled.div`
  position: relative;
  width: 100%;
  min-height: 75vh;
`

const InnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  
  transition: 500ms opacity ease;
  cursor: pointer;
  border-radius: 50%;
  border: 1px solid #d56c01;
  background: black;

  ${({ shouldShowTree }) =>
    !shouldShowTree
      ? `
      opacity: 0.9;
        &:hover {
        opacity: 0.5;
      }
      `
      : `opacity: 1;`}

  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
`

const StartText = styled.span`
  font-size: 2rem;
  font-weight: bold;
  color: white;
`

const TreeWrapper = styled.div`
  display: ${({ shouldDisplay }) => (shouldDisplay ? "block" : "none")};
  width: 100%;
  height: 100%;
`

const Tree = () => {
  const [images, setImages] = useState(null)
  const [imagesLoadedCounter, setImagesLoadedCounter] = useState(0)
  const [shouldShowTree, setShouldShowTree] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(-1)
  const [isInitialAnimationDone, setIsInitialAnimationDone] = useState(false)
  const [baseImageSize, setBaseImageSize] = useState(0)
  const wrapperRef = useRef(null)

  /* Once all images are loaded, show the tree */
  useEffect(() => {
    if (images && imagesLoadedCounter === images.length) {
      setShouldShowTree(true)
    }
  }, [imagesLoadedCounter, images])

  /* Start a timer to determine when the loading animation time is complete */
  useEffect(() => {
    if (shouldShowTree) {
      setTimeout(() => {
        setIsInitialAnimationDone(true)
      }, images.length * ANIMATION_SPEED_MS)
    }
  }, [shouldShowTree])

  useLayoutEffect(() => {
    setBaseImageSize(getBaseImageSize(wrapperRef))
  }, [wrapperRef])

  // TODO move to services file
  const fetchImages = async () => {
    const res = await fetch(
      `https://graph.instagram.com/me/media?fields=media_url,media_type,id,timestamp&access_token=${process.env.GATSBY_LONG_LIVED_ACCESS_TOKEN}`
    )
    const instagramData = await res.json()
    setImages(instagramData.data.filter(image => image.media_type !== "VIDEO"))
  }

  const onClickLoadTree = () => {
    if (!images) fetchImages()
  }

  const onImageLoad = () => {
    setImagesLoadedCounter(imagesLoadedCounter + 1)
  }

  const onImageSelected = index => {
    setSelectedImageIndex(index)
  }

  const displayText = images
    ? `Loading ${imagesLoadedCounter}/${images.length}`
    : `Start!`

  return (
    <div>
      <OuterWrapper ref={wrapperRef}>
        <InnerWrapper
          size={baseImageSize}
          shouldShowTree={shouldShowTree}
          onClick={onClickLoadTree}
        >
          {!shouldShowTree && <StartText>{displayText}</StartText>}
          <TreeWrapper shouldDisplay={shouldShowTree}>
            {images &&
              images.map(({ media_url, id }, index) => {
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
          </TreeWrapper>
        </InnerWrapper>
      </OuterWrapper>
    </div>
  )
}

export default Tree
