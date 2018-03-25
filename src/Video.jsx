import PT from 'prop-types'
import React from 'react'


class Video extends React.Component {

  static defaultProps = {
    autoPlay: false,
    defaultMuted: false,
    defaultPlaybackRate: 1,
    muted: false,
    playbackRate: 1,
    playbackState: 'ended',
    srcObject: null,
    volume: null,
  }

  static propTypes = {
    // Required:
    autoPlay: PT.bool.isRequired,
    defaultPlaybackRate: PT.number.isRequired,
    playbackRate: PT.number.isRequired,
    // Optional:
    controller: PT.object, // : MediaController
    currentTime: PT.number,
    defaultMuted: PT.bool,
    sources: PT.arrayOf(PT.object),
    srcObject: PT.object, // : MediaProvider (MediaStream | MediaSource | Blob)
    tracks: PT.arrayOf(PT.object),
    volume: PT.number,
  }

  videoEl = null

  addTextTrack(...args) {
    return this.videoEl.addTextTrack(...args)
  }

  canPlayType(...args) {
    return this.videoEl.canPlayType(...args)
  }

  captureStream(...args) {
    return this.videoEl.captureStream(...args)
  }

  fastSeek(...args) {
    return this.videoEl.fastSeek(...args)
  }

  load(...args) {
    return this.videoEl.load(...args)
  }

  pause(...args) {
    return this.videoEl.pause(...args)
  }

  play(...args) {
    return this.videoEl.play(...args)
  }

  seekToNextFrame(...args) {
    return this.videoEl.seekToNextFrame(...args)
  }

  setMediaKeys(...args) {
    return this.videoEl.setMediaKeys(...args)
  }

  setSinkId(...args) {
    return this.videoEl.setSinkId(...args)
  }

  render() {
    const props = this.props
    const {
      children,
      currentTime,
      defaultMuted,
      defaultPlaybackRate,
      playbackRate,
      playbackState,
      sources,
      src,
      srcObject,
      tracks,
      volume,
      ...videoProps
    } = props

    return (
      <video {...videoProps} ref={(videoEl) => { this.videoEl = videoEl }}>
        {
          sources && sources.map((sourceProps) => {
            return <source {...sourceProps}/>
          })
        }
        { children }
        {
          tracks && tracks.map((trackProps) => {
            return <track {...trackProps}/>
          })
        }
      </video>
    )
  }

  componentDidMount() {
    this._syncVideoProperties()
  }

  componentDidUpdate() {
    this._syncVideoProperties()
  }

  _syncVideoProperties() {
    this._setController()
    this._setCurrentTime()
    this._setDefaultMuted()
    this._setDefaultPlaybackRate()
    this._setPlaybackRate()
    this._setSrc()
    this._setSrcObject()
    this._setVolume()
  }

  _setController() {
    // The following is probably needed to prevent flicker but no browsers
    // currently implement a MediaController.
    if (this.videoEl.controller !== this.props.controller) {
      this.videoEl.controller = this.props.controller
    }
  }

  _setCurrentTime() {
    if (typeof this.props.currentTime === 'number' && Number.isFinite(this.props.currentTime)) {
      this.videoEl.currentTime = this.props.currentTime
    }
  }

  _setDefaultMuted() {
    if (typeof this.props.defaultMuted === 'boolean') {
      if (this.videoEl.defaultMuted !== this.props.defaultMuted) {
        this.videoEl.defaultMuted = this.props.defaultMuted
      }
    }
  }

  _setDefaultPlaybackRate() {
    // Note: Edge will throw an InvalidStateError when trying to change the
    // defaultPlaybackRate of a webcam.  It also throws it even if you try to set it to
    // 1.
    if (this.videoEl.defaultPlaybackRate !== this.props.defaultPlaybackRate) {
      this.videoEl.defaultPlaybackRate = this.props.defaultPlaybackRate
    }
  }

  _setPlaybackRate() {
    // Note: Edge will throw an InvalidStateError when trying to change the
    // playbackRate of a webcam.  It also throws it even if you try to set it to 1.
    if (this.videoEl.playbackRate !== this.props.playbackRate) {
      // Without the setTimeout, Edge won't set the playbackRate to the value specified
      // when the video element is first created.  However, it sets the playbackRate
      // correctly without using setTimeout after the component's props changes.
      setTimeout(() => {
        this.videoEl.playbackRate = this.props.playbackRate
      }, 1)
    }
  }

  _setSrc() {
    // Without the following check, the video element flickers and/or restarts the video.
    if (this.videoEl.src !== this.props.src) {
      this.videoEl.src = this.props.src
    }
  }

  _setSrcObject() {
    // Without the following check, the video element flickers and/or restarts the video.
    if (this.videoEl.srcObject !== this.props.srcObject) {
      this.videoEl.srcObject = this.props.srcObject
    }
  }

  _setVolume() {
    if (typeof this.props.volume === 'number' && this.props.volume === this.props.volume) {
      this.videoEl.volume = this.props.volume
    }
  }

}

export default Video
