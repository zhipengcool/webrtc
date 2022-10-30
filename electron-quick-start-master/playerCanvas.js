//! 绘制canvas，添加到内存中，

class PlayerCanvas {
  constructor (width, height) {
    this._canvas = document.createElement('canvas');
    this._canvas.width = width
    this._canvas.height = height

    this._canvasWidth = width
    this._canvasHeight = height
    //! 图像的宽高
    this._CAMERA_VIDEO_WIDTH = 200
    this._CAMERA_VIDEO_HEIGHT = 150

    this._context2d = this._canvas.getContext('2d')

    requestAnimationFrame(this.animationFrameHandler.bind(this))
  }
  /**
   *
   * @return videoHTMLELement
   */
  setScreenVideo (video) {
    this._screenVideo = video
  }
  //! 头像流
  setCameraVideo (video) {
    this._cameraVideo = video
  }

  animationFrameHandler () {
    //! 绘制视频
    if (this._screenVideo) {
      this._context2d.drawImage(this._screenVideo, 0, 0, this._canvasWidth, this._canvasHeight)
    }
    //! 绘制头像在右下角
    if (this._cameraVideo) {
      this._context2d.drawImage(
        this._cameraVideo,
        this._canvasWidth - this._CAMERA_VIDEO_WIDTH,
        this._canvasHeight - this._CAMERA_VIDEO_HEIGHT,
        this._CAMERA_VIDEO_WIDTH,
        this._CAMERA_VIDEO_HEIGHT)
    }
    console.log('====>')
    requestAnimationFrame(this.animationFrameHandler.bind(this))
  }

  get canvas () {
    return this._canvas
  }

}

module.exports = PlayerCanvas;