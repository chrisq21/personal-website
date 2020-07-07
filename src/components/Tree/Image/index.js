import React from "react"
import { ImageBorder, ImageWrapper, Image, ImageOverlay } from "./styles"

const TreeImage = ({
  index,
  selectedImageIndex,
  id,
  imageURL,
  size,
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
      />
      <ImageWrapper
        onClick={handleImageSelected}
        size={size}
        key={id}
        isSelected={selectedImageIndex === index}
        index={index}
      >
        <ImageOverlay isSelected={selectedImageIndex === index} index={index} />
        <Image src={imageURL} onLoad={onImageLoad} />
      </ImageWrapper>
    </div>
  )
}

export default TreeImage
