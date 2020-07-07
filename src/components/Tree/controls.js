import React from "react"

const Controls = ({
  isDoneLoading,
  imagesLoadedCounter,
  totalImages,
  showTree,
}) => (
  <div>
    <p>
      {!isDoneLoading &&
        `Loading images ${imagesLoadedCounter} / ${totalImages}`}
      {isDoneLoading && `All images loaded`}
    </p>
    {isDoneLoading && <button onClick={showTree}>Show Tree</button>}
  </div>
)

export default Controls
