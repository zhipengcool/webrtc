new Vue({
  el: '#app',
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.previewCanvas = this.$refs.preview.getContext('2d');
      this.resultCanvas = this.$refs.resultCanvas.getContext('2d');

      this.previewCanvasWidth = this.$refs.preview.width
      this.previewCanvasHeight = this.$refs.preview.height

      this.video = document.createElement('video');
      this.video.src = '../lib/sea.mp4'

      requestAnimationFrame(this.animateFrame.bind(this))
    },
    animateFrame () {
      this.previewCanvas.drawImage(this.video, 0, 0, this.previewCanvasWidth, this.previewCanvasHeight)
      // 用来描述 canvas 区域隐含的像素数据
      let srcImageData = this.previewCanvas.getImageData(0, 0, this.previewCanvasWidth, this.previewCanvasHeight)
      let destImageData = this.resultCanvas.createImageData(srcImageData.width, srcImageData.height)

      let len = srcImageData.data.byteLength;
      let rawData = srcImageData.data;
      for (let i = 0; i < len; i += 4) {
        let c = Math.floor((rawData[i] + rawData[i + 1] + rawData[i + 2]) / 3);
        destImageData.data[i] = c;
        destImageData.data[i + 1] = c;
        destImageData.data[i + 2] = c;
        destImageData.data[i + 3] = 255;
      }

      this.resultCanvas.putImageData(destImageData , 0, 0)
      requestAnimationFrame(this.animateFrame.bind(this))
    },
    playVideo () {
      this.video.play()
    }
  },
})