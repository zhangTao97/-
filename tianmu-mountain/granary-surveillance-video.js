/**
 * 监控视频
 */
const oPlugin = {
    iWidth: '100%',			// plugin width
    iHeight: '100%'			// plugin height
};
const granarySurveillanceVideo = {
    props: {
        // 每项数据
        option: {
            type: Object,
            default: {}
        }
    },
    template: `
            <div class="video-content">
                <div class="video-select-t">
                    <el-select ref="device_id" @change="deviceChange" class="video_select" size="mini" v-model="activeVideo" placeholder="请选择">
                        <el-option v-for="item in rows" :key="item.deviceId" :label="item.deviceName" :value="item.deviceId">
                        </el-option>
                    </el-select>
                </div>
                <div class="no-data-t" v-show="novideo">暂无视频</div>
                <div v-show="showVideo1" id="divPlugin" :class="currClass"></div>
                <video-components ref="videoChild" v-show="showVideo2 && !novideo" :params="params"></video-components>
            </div>
    `,
    data() {
        return {
            cameraConn: "",
            rows: [],
            activeVideo: "",
            Video: "",
            videoForm: {
                deviceId: ""
            },
            novideo: true,
            showVideo1: true,//9800
            showVideo2: false,//直连
            currClass: "un_videoPlugin",
            defParam: {},
            addParam: { camera_type: 1 },
            autoLoad: false,         //是否created时自动请求配置的接口
            params: {
                tokenUrl: "action=com.top.regulate.video.VideoCenter.getToken"
            }
        }
    },
    methods: {
        /**
         * 加载数据
         * @param extParam
         */
        loadData(extParam = {}, callback) {
            this.defParam = extParam;
            //检查apiurl属性值
            if (this.option.apiurl) {
                //合并API接口参数
                let param = {};
                Object.assign(param, this.addParam);
                Object.assign(param, extParam);
                //发起API接口请求
                tpHttp.post(null, this.option.apiurl, { param: JSON.stringify(param) }, (data, code, message) => {
                    if (data.length > 0) {
                        //请求应答回调处理
                        callback.apply(this, [data, code, message]);
                    } else {
                        if (param.camera_type == 1) {
                            this.addParam.camera_type = 2;
                            this.loadData(this.defParam, callback);
                        } else {
                            this.rows = [];
                            this.activeVideo = "";
                            this.currClass = "un_videoPlugin";
                            this.novideo = true;
                        }
                    }
                });
            }
        },
        /* 数据加载回调 */
        loadedDataCallback(data, code, message) {
            this.novideo = false;
            this.rows = data;
            this.activeVideo = this.rows[0].deviceId;
            this.$refs['device_id'].$emit("change", this.rows[0].deviceId);
            if (this.addParam.camera_type == 1) {//直连
                this.currClass = "videoPlugin";
                this.showVideo2 = false;
            } else { //9800
                // this.currClass = "un_videoPlugin";
                this.showVideo2 = true;
                var tokenParameter = { "camera_type": "2", "key_id": data[0].hkAppkeyId }
                // this.Video = "../../resources/player/player.html?video_src=" + this.rows[0].hlsUrl;
                // this.$refs.videoChild.getVideoStart(data[0],tokenParameter)
            }
        },
        /*  下拉框change时的事 */
        deviceChange(val) {
            let matchItems = this.rows.filter(item => item.deviceId == val);
            let [device] = matchItems;
            if (this.addParam.camera_type == 1) {//直连
                let oLiveViewObj = {
                    iProtocol: 1,			// protocol 1：http, 2:https
                    szIP: device.streamUrl,	// protocol ip
                    szPort: device.httpPort,			// protocol port
                    szUsername: device.username,	// device username
                    szPassword: this.decrypt(device.pwd, device.secret),	// device password
                    iStreamType: device.streamType,			// stream 1：main stream  2：sub-stream  3：third stream  4：transcode stream
                    iChannelID: parseInt(device.channel),			// channel no
                    bZeroChannel: false		// zero channel
                };
                this.videoChange(oLiveViewObj);
            } else { //9800  
                // this.Video = "../../resources/player/player.html?video_src=" + device.hlsUrl
                var tokenParameter = { "camera_type": "2", "key_id": matchItems[0].hkAppkeyId }
                this.$refs.videoChild.getVideoStart(matchItems[0], tokenParameter)
            }
        },
        videoChange(oLiveViewObj) {
            const oLiveView = oLiveViewObj;
            this.clickStartRealPlay(oLiveView.szIP, oLiveView.szPort, oLiveView.szUsername, oLiveView.szPassword, oLiveView.iStreamType, oLiveView.iChannelID, oLiveView.bZeroChannel);
        },
        // AES解密
        decrypt(str, secret) {
            return CryptoJS.AES.decrypt(str, CryptoJS.enc.Utf8.parse(secret), { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 }).toString(CryptoJS.enc.Utf8);
        },
        /* 初始化视频播放插件 */
        initVideo() {
            // 检查插件是否已经安装过
            var iRet = WebVideoCtrl.I_CheckPluginInstall();
            if (-1 == iRet) {
                alert("您还未安装过插件，双击开发包目录里的WebComponentsKit.exe安装！");
                return;
            }
            // 初始化插件参数及插入插件
            WebVideoCtrl.I_InitPlugin(oPlugin.iWidth, oPlugin.iHeight, {
                bWndFull: true,//是否支持单窗口双击全屏，默认支持 true:支持 false:不支持
                iWndowType: 1,
                cbSelWnd: function (xmlDoc) {
                    // alert(xmlDoc);
                }
            });
            WebVideoCtrl.I_InsertOBJECTPlugin("divPlugin");
            // 检查插件是否最新
            if (-1 == WebVideoCtrl.I_CheckPluginVersion()) {
                alert("检测到新的插件版本，双击开发包目录里的WebComponentsKit.exe升级！");
                return;
            }
        },
        // 登录
        checkLogin(szIP, szPort, szUsername, szPassword, callback) {
            var cc = this.cameraConn;
            var flag = true;
            if (cc != (szIP + "_" + szPort)) {
                // if (cc) {
                //     WebVideoCtrl.I_Logout(cc.split("_")[0]);
                //     this.cameraConn = "";
                // }
                var that = this;
                var iRet = WebVideoCtrl.I_Login(szIP, 1, szPort, szUsername, szPassword, {
                    success: function (xmlDoc) {
                        that.cameraConn = szIP + "_" + szPort;
                        flag = true;
                        callback();
                    },
                    error: function () {
                        WebVideoCtrl.I_Stop(0);
                        that.$message.success("播放失败！");
                        flag = false;
                    }
                });
            } else {
                callback();
            }
            return flag;
        },
        // 开始预览
        clickStartRealPlay(szIP, szPort, szUsername, szPassword, iStreamType, iChannelID, bZeroChannel) {
            if ("" == szIP || "" == szPort) {
                return;
            }
            this.checkLogin(szIP, szPort, szUsername, szPassword, () => {
                var oWndInfo = WebVideoCtrl.I_GetWindowStatus(0);
                if (oWndInfo != null) {
                    var iRet = WebVideoCtrl.I_Stop(0);
                }
                var iRet = WebVideoCtrl.I_StartRealPlay(szIP, {
                    iStreamType: iStreamType,
                    iChannelID: iChannelID,
                    bZeroChannel: bZeroChannel,
                    iWndIndex: 0
                });
                if (0 == iRet) {
                } else {
                    this.$message.error("视频查看失败");
                }
            });
        }
    },
    mounted() {
        this.initVideo();
        this.loadData({}, this.loadedDataCallback);
    }
}
Vue.component("granary-surveillance-video",granarySurveillanceVideo)