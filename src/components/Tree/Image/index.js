import React from "react"
import { ImageBorder, ImageWrapper, Image, ImageOverlay } from "./styles"

const TreeImage = ({
  index,
  selectedImageIndex,
  id,
  imageURL,
  size,
  isInitialAnimationDone,
  onImageSelected,
  onImageLoad,
}) => {
  const handleImageSelected = () => {
    onImageSelected(index)
  }

  return (
    <div>
      <ImageBorder
        index={index}
        size={size}
        isSelected={selectedImageIndex === index}
        isUnderSelectedImage={
          selectedImageIndex >= 0 && selectedImageIndex <= index
        }
        isInitialAnimationDone={isInitialAnimationDone}
      />
      <ImageWrapper
        onClick={handleImageSelected}
        size={size}
        key={id}
        isSelected={selectedImageIndex === index}
        index={index}
        isInitialAnimationDone={isInitialAnimationDone}
      >
        <ImageOverlay
          index={index}
          isSelected={selectedImageIndex === index}
          isInitialAnimationDone={isInitialAnimationDone}
        />
        <Image src={imageURL} onLoad={onImageLoad} />
      </ImageWrapper>
    </div>
  )
}

export default TreeImage
