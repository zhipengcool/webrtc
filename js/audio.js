new Vue({
  el: '#app',
  data: {
    chunk: null
  },
  mounted() {
    this.init()
  },
  methods: {
    async init () {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });

      this.recoder = new MediaRecorder(this.stream, { mimeType: 'video/webm;codecs=h264' });
      // 用于获取录制的媒体资源
      this.recoder.ondataavailable = this.ondataavailable.bind(this)
    },
    ondataavailable (e) {
      console.log('e: ', e)
      this.chunk = e.data
    },
    doStart () {
      this.recoder.start()
    },
    doPause () {
      this.recoder.pause()
    },
    doResume () {
      this.recoder.resume()
    },
    doStop () {
      this.recoder.stop()
    },
    doPlay () {
      console.log('url:', URL.createObjectURL(this.chunk))
      this.$refs.audio.src = URL.createObjectURL(this.chunk)
    }
  },
})