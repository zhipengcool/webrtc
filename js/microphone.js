(async function () {
  new Vue({
    el: '#app',
    data: {
      audioInputDevice: [],
      selectAudioIndex: 0
    },
    mounted () {
      this.initMedia()
    },
    methods: {
      async initMedia () {
        //! 请求一个可用的媒体输入和输出设备的列表，例如麦克风，摄像机，耳机设备等
        let devices = await navigator.mediaDevices.enumerateDevices()
        let audioInputDevice = devices.filter(v => v.kind === 'audioinput')
        console.log('audioInputDevice: ', audioInputDevice)
        this.audioInputDevice.length = 0
        this.audioInputDevice.push(...audioInputDevice)

        this.showSelectDevice()
      },

      async showSelectDevice () {
        let deviceInfo = this.audioInputDevice[this.selectAudioIndex]
        console.log('deviceInfo: ', deviceInfo)
        //! 媒体输入会产生一个MediaStream，里面包含了请求的媒体类型的轨道。
        let stream = await navigator.mediaDevices.getUserMedia({video: false, audio: deviceInfo});
        this.$refs.audio.srcObject = stream;
      }
    },

    watch: {
      selectAudioIndex () {
        this.showSelectDevice()
      }
    }
  })
})();