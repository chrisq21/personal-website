import { useEffect } from "react"
import debounce from "lodash/debounce"
/**
 * @param { func } callback
 * @param { array } dependencies
 * @param { bool } shouldDebounce
 * @param { debounceWait } number
 * @param { object } debounceOptions
 * @param { bool } shouldTriggerOnMount
 * @description Custom react hook that adds a resize event listener to the window object on mount.
 *  The callback param is executed when the resize event fires.
 */
export default (
  callback,
  dependencies,
  shouldTriggerOnMount = true,
  shouldDebounce = true,
  debounceWait = 150,
  debounceOptions = {}
) => {
  useEffect(() => {
    if (shouldTriggerOnMount) {
      callback()
    }
    const resizeCallback = shouldDebounce
      ? debounce(callback, debounceWait, debounceOptions)
      : callback
    if (window) window.addEventListener("resize", resizeCallback)
    return () => {
      if (window) window.removeEventListener("resize", resizeCallback)
    }
  }, [
    dependencies,
    callback,
    shouldDebounce,
    debounceWait,
    debounceOptions,
    shouldTriggerOnMount,
  ])
}
