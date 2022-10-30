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
      //! getDisplayMedia: 提示用户选择显示器或显示器的一部分（例如窗口）以捕获为MediaStream 以便共享或记录。
      this.stream = await navigator.mediaDevices.getDisplayMedia();

      this.$refs.videoPrivew.srcObject = this.stream
      //! MediaRecorder: 提供的用来进行媒体轻松录制的接口
      this.recoder = new MediaRecorder(this.stream, { mimeType: 'video/webm;codecs=h264' });
      //! 调用它用来处理 dataavailable 事件，该事件可用于获取录制的媒体资源 (在事件的 data 属性中会提供一个可用的 Blob 对象.)
      this.recoder.ondataavailable = this.ondataavailable.bind(this)
    },
    ondataavailable (e) {
      this.chunk = e.data
    },
    doStart () {
      this.recoder.start()
      console.log(this.recoder);
    },
    doPause () {
      this.recoder.pause()
    },
    doResume () {
      this.recoder.resume()
    },
    doStop () {
      if(this.recoder.state!="inactive"){
        this.recoder.stop();
      }
    },
    doPlay () {
      console.log('url:', URL.createObjectURL(this.chunk))
      this.$refs.video.src = URL.createObjectURL(this.chunk)
    }
  },
})