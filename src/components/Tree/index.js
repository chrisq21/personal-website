import React from "react"
import styled from "styled-components"

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

  width: ${({ canShowTree, imageDimensions }) =>
    canShowTree ? imageDimensions : "0"}px;
  height: ${({ canShowTree, imageDimensions }) =>
    canShowTree ? imageDimensions : "0"}px;

  transition: width 5s ease, height 5s ease;

  overflow: hidden;
  border-radius: 10000px;
`

const ImageWrapper = styled.div`
  cursor: pointer;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  height: ${({ imageDimensions }) => imageDimensions}px;
  width: ${({ imageDimensions }) => imageDimensions}px;
  border-radius: 1000px;

  z-index: ${({ selectedImageIndex, index }) =>
    selectedImageIndex === index ? "2" : "1"};
  pointer-events: ${({ selectedImageIndex, index }) =>
    selectedImageIndex === index ? "none" : "auto"};
`

const ImageBorder = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);  
  height: ${({ imageDimensions }) => imageDimensions}px;
  width: ${({ imageDimensions }) => imageDimensions}px;

  border: ${({ selectedImageIndex, index }) =>
    selectedImageIndex <= index ? "1" : "4"}px solid #834200;
  border-radius:  1000px;

  z-index: 100000;
  pointer-events: none;
}`

const Image = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 1000px;
`

const ImageOverlay = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 10000px;
  background: #d56c01;

  opacity: ${({ selectedImageIndex, index }) =>
    selectedImageIndex === index ? "0" : "0.75"};

  &:hover {
    opacity: 0;
  }
`

const TreeWrapper = ({ images }) => {
  const [imagesLoadedCounter, setImagesLoadedCounter] = React.useState(0)
  const [shouldShowTree, setShouldShowTree] = React.useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(
    images.length - 1
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

  const isDoneLoading = imagesLoadedCounter === images.length
  const wrapperHeight = wrapperEl?.current?.offsetHeight
  const wrapperWidth = wrapperEl?.current?.offsetWidth
  const imageDimensions = Math.min(wrapperHeight, wrapperWidth)
  const canShowTree = shouldShowTree && imageDimensions > 0 && isDoneLoading

  const getImageDimensionByIndex = (imageDimensions, index, total) => {
    return imageDimensions - imageDimensions * (index / total)
  }

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
          <InnerWrapper
            canShowTree={canShowTree}
            imageDimensions={imageDimensions}
          >
            {images.map(({ media_url, id }, index) => (
              <>
                <ImageBorder
                  index={index}
                  selectedImageIndex={selectedImageIndex}
                  key={`${id}-border`}
                  imageDimensions={() =>
                    getImageDimensionByIndex(
                      imageDimensions,
                      index,
                      images.length
                    )
                  }
                />
                <ImageWrapper
                  onClick={onImageSelected.bind(null, index)}
                  imageDimensions={() =>
                    getImageDimensionByIndex(
                      imageDimensions,
                      index,
                      images.length
                    )
                  }
                  key={id}
                  selectedImageIndex={selectedImageIndex}
                  index={index}
                >
                  <Image src={media_url} onLoad={onImageLoad} />
                  <ImageOverlay
                    selectedImageIndex={selectedImageIndex}
                    index={index}
                  />
                </ImageWrapper>
              </>
            ))}
          </InnerWrapper>
        </CenteringWrapper>
      </OuterWrapper>
    </>
  )
}

export default TreeWrapper
