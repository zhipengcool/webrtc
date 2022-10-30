/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */
//! 录制图像、声音和头像
const fs = require("fs");
const Vue = require("vue/dist/vue");
const { dialog, getCurrentWindow } = require("@electron/remote");
// console.log("dialog: ", dialog);

const PlayerCanvas = require("./playerCanvas");

const screenWidth = 1440;
const screenHeight = 900;

new Vue({
  el: "#app",
  data: {
    stream: null,
    _recoder: null,
    _playerCanvas: null
  },
  mounted () {
    this._playerCanvas = new PlayerCanvas(screenWidth, screenHeight);
    console.log('this._playerCanvas: ', this._playerCanvas)
  },
  methods: {
    // 录制屏幕
    startRecord () {
      this._recoder = new MediaRecorder(this.stream, {
        mimeType: "video/webm;codecs=h264",
      });
      console.log("this._recoder: ", this._recoder);
      this._recoder.ondataavailable = async (e) => {
        console.log("e --- end", e);
        let path = dialog.showSaveDialogSync(getCurrentWindow(), {
          title: "保存文件",
          defaultPath: "ScreenData.wbm",
        });
        console.log("path:", path);

        fs.writeFileSync(
          path,
          new Uint8Array(await e.data.arrayBuffer())
        );
      };
      // 开始录制
      this._recoder.start();
    },
    // 创建video元素
    createVideoElementStream (stream) {
      let video = document.createElement('video')
      video.autoplay = true
      video.srcObject = stream
      return video
    },

    async attachAudioStream () {
      this._audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      // 获取音频轨道并且给流添加一个新轨道
      this._audioStream
        .getAudioTracks()
        .forEach((v) => this.stream.addTrack(v));
    }
  },
  render(h) {
    return h("div", [
      h("video", {
        ref: "preview",
        domProps: {
          autoplay: true,
          controls: true,
          width: 500,
          height: 300,
        },
      }),
      h(
        "button",
        {
          on: {
            click: async () => {
              // 是一个媒体内容的流.。一个流包含几个轨道，比如视频和音频轨道
              this.stream = new MediaStream();
              // 音频
              await this.attachAudioStream(); 

              // 视频
              this._camerStream = await navigator.mediaDevices.getUserMedia({
                audio: false,
                video: true,
              });
              this._playerCanvas.setCameraVideo(this.createVideoElementStream(this._camerStream))

              // 视频轨道
              let screenStream = await navigator.mediaDevices.getUserMedia({
                audio: false,
                video: {
                  mandatory: {
                    chromeMediaSource: "desktop",
                    // chromeMediaSourceId: sourceId,
                    minWidth: screenWidth,
                    maxWidth: screenWidth,
                    minHeight: screenHeight,
                    maxHeight: screenHeight,
                  },
                },
              });
              this._playerCanvas.setScreenVideo(this.createVideoElementStream(screenStream))

              // 实时视频捕获的画布
              console.log('--->', this._playerCanvas)
              let playerCanvasStream = this._playerCanvas.canvas.captureStream()
              playerCanvasStream.getTracks().forEach(t => this.stream.addTrack(t))

              this.$refs.preview.srcObject = playerCanvasStream

              this.startRecord()
            },
          },
        },
        "录制"
      ),
      h(
        "button",
        {
          on: {
            click: () => {
              this._recoder.stop();
            },
          },
        },
        "停止"
      ),
    ]);
  },
});
