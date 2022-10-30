/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */
//! 录制屏幕和声音
const fs = require("fs");
const Vue = require("vue/dist/vue");
const { dialog, getCurrentWindow } = require("@electron/remote");
// console.log("dialog: ", dialog);

new Vue({
  el: "#app",
  data: {
    stream: null,
    _recoder: null
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
              // 音频轨道
              this.stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: false,
              });
              console.log("stream: ", this.stream);
              // 视频轨道
              let screenStream = await navigator.mediaDevices.getUserMedia({
                audio: false,
                video: {
                  mandatory: {
                    chromeMediaSource: "desktop",
                    // chromeMediaSourceId: sourceId,
                    minWidth: 1440,
                    maxWidth: 1440,
                    minHeight: 900,
                    maxHeight: 900,
                  },
                },
              });
              // 获取视频轨道并且给流添加一个新轨道, 将视频轨道添加到音频轨道中
              screenStream
                .getVideoTracks()
                .forEach((v) => this.stream.addTrack(v));
              console.log("s:", screenStream.getVideoTracks());
              this.$refs.preview.srcObject = screenStream;

              // 录制屏幕
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
