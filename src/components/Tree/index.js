import React from "react"
import styled from "styled-components"

// TODO move styles to styles file
const OuterWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 80vh;
`

const CenteringWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`
const InnerWrapper = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  overflow: hidden;
  border-radius: 10000px;

  width: ${({ imageSize }) => imageSize}px;
  height: ${({ imageSize }) => imageSize}px;
`

const FadeInAnimationWrapper = styled.div`
  transition-duration: ${({ animationSpeed }) => animationSpeed}ms;
  transition-timing-function: ease-in;
  transition-delay: ${({ index, animationSpeed }) => index * animationSpeed}ms;

  transition-property: ${({ selectedImageIndex, initialSelectionIndex }) =>
    selectedImageIndex === initialSelectionIndex ? "opacity" : "none"};
  opacity: ${({ canShowTree }) => (canShowTree ? "1" : "0")};
`

const InnerImageWrapper = styled(FadeInAnimationWrapper)`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 1000px;
  cursor: pointer;

  height: ${({ imageSize }) => imageSize}px;
  width: ${({ imageSize }) => imageSize}px;
  z-index: ${({ selectedImageIndex, index }) =>
    selectedImageIndex === index ? "2" : "1"};
  pointer-events: ${({ selectedImageIndex, index }) =>
    selectedImageIndex === index ? "none" : "auto"};
`

const ImageBorder = styled(FadeInAnimationWrapper)`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 1000px;
  z-index: 100000;
  pointer-events: none;

  height: ${({ imageSize }) => imageSize}px;
  width: ${({ imageSize }) => imageSize}px;
  border: ${({ selectedImageIndex, index }) =>
      selectedImageIndex <= index ? "1" : "4"}px
    solid #834200;

  // TODO Look into better prettier formatting for styled components
  ${({ selectedImageIndex, index, canShowTree }) => `
    ${
      selectedImageIndex <= index &&
      canShowTree &&
      `
        transition-property: none;
      opacity: ${selectedImageIndex <= index ? "0.3" : "1"}; `
    }

    ${!canShowTree && ` opacity: 0;`}
  `}
`

const Image = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 1000px;
`

const ImageOverlay = styled(FadeInAnimationWrapper)`
  opacity: 0;
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 10000px;
  background: #d56c01;

  &:hover {
    opacity: 0;
  }

  transition-delay: ${({ index, animationSpeed }) =>
    (index + 1) * animationSpeed}ms;

  opacity: ${({ canShowTree }) => (canShowTree ? "0.75" : "0")};

  ${({ selectedImageIndex, initialSelectionIndex, canShowTree, index }) => `
    ${
      selectedImageIndex !== initialSelectionIndex &&
      canShowTree &&
      `
        opacity: ${selectedImageIndex === index ? "0" : "0.75"};
      `
    }
  `}
`

const TreeWrapper = ({ images }) => {
  const initialSelectionIndex = 10000
  const animationSpeed = 300
  const [imagesLoadedCounter, setImagesLoadedCounter] = React.useState(0)
  const [shouldShowTree, setShouldShowTree] = React.useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(
    initialSelectionIndex
  )
  const wrapperEl = React.useRef(null)

  const showTree = () => {
    setShouldShowTree(true)
  }
  const onImageLoad = e => {
    setImagesLoadedCounter(imagesLoadedCounter + 1)
  }
  const onImageSelected = index => {
    setSelectedImageIndex(index)
  }

  /* TODO 
    Calculate if animation is done with JS instead of all the styled components hacks.
    use animationSpeed * images.length for total animation time
    Once canShowTree is true, set a timeout for the animation time. 
    When the timeout complete, remove the transition, etc
  */

  const isDoneLoading = imagesLoadedCounter === images.length
  const wrapperHeight = wrapperEl?.current?.offsetHeight
  const wrapperWidth = wrapperEl?.current?.offsetWidth
  const baseImageSize = Math.min(wrapperHeight, wrapperWidth)
  const canShowTree = shouldShowTree && baseImageSize > 0 && isDoneLoading

  // TODO move to helper file
  const getImageSizeByIndex = (baseImageSize, index, total) => {
    return baseImageSize - baseImageSize * (index / total)
  }

  // TODO Move button controls to page container or seperate component.
  // Control visibility state via parent container
  return (
    <>
      <p>
        {!isDoneLoading &&
          `Loading images ${imagesLoadedCounter} / ${images.length}`}
        {canShowTree && `All images loaded`}
      </p>
      {true && <button onClick={showTree}>Show Tree</button>}
      <OuterWrapper canShowTree={canShowTree} ref={wrapperEl}>
        <CenteringWrapper>
          <InnerWrapper canShowTree={canShowTree} imageSize={baseImageSize}>
            {images.map(({ media_url, id }, index) => {
              // TODO Move to seperate component
              const newImageSize = getImageSizeByIndex(
                baseImageSize,
                index,
                images.length
              )
              return (
                <div>
                  <ImageBorder
                    animationSpeed={animationSpeed}
                    initialSelectionIndex={initialSelectionIndex}
                    canShowTree={canShowTree}
                    index={index}
                    selectedImageIndex={selectedImageIndex}
                    key={`${id}-border`}
                    imageSize={newImageSize}
                  />
                  <InnerImageWrapper
                    animationSpeed={animationSpeed}
                    initialSelectionIndex={initialSelectionIndex}
                    canShowTree={canShowTree}
                    onClick={onImageSelected.bind(null, index)}
                    imageSize={newImageSize}
                    key={id}
                    selectedImageIndex={selectedImageIndex}
                    index={index}
                  >
                    <Image src={media_url} onLoad={onImageLoad} />
                    <ImageOverlay
                      animationSpeed={animationSpeed}
                      canShowTree={canShowTree}
                      initialSelectionIndex={initialSelectionIndex}
                      selectedImageIndex={selectedImageIndex}
                      index={index}
                    />
                  </InnerImageWrapper>
                </div>
              )
            })}
          </InnerWrapper>
        </CenteringWrapper>
      </OuterWrapper>
    </>
  )
}

export default TreeWrapper
