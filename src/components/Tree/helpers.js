export const getImageSizeByIndex = (baseImageSize, index, totalImages) => {
  return baseImageSize - baseImageSize * (index / totalImages)
}

export const getBaseImageSize = ref => {
  if (ref) {
    const wrapperHeight = ref?.current?.offsetHeight
    const wrapperWidth = ref?.current?.offsetWidth
    return Math.min(wrapperHeight, wrapperWidth) || 0
  }
  return 0
}
