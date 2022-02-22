/**
 * 监控视频区块
 * 通过参数拿id
 */
const moduleVideoExp = {
    props: {
        // 每项数据
        option: {
            type: Object,
            default: {}
        }
    },
    data() {
        return {
            currentRows: [],
            baseUrl: "https://video.zjtpyun.com/dispose/play/index?&autoPlay=1&devId=",
            currentUrl: "",
            showVideo: false,
            novideo: false,
            activeVideo: "",
            isShowIframe: true
        }
    },
    computed: {
    },
    watch: {
    },
    template: `<div class="video-content">
                    <div class="video-select-t">
                        <el-select size="small" ref="device_id" class="video_select" @visible-change="selectVisibleChange" v-model="activeVideo" @change="deviceChange" placeholder="请选择">
                            <el-option v-for="item in currentRows" :key="item.device_id" :label="item.name" :value="item.device_id">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="no-data-t" v-show="novideo">暂无视频</div>
                    <iframe style="width: 100%;height: 100%;object-fit: fill" v-show="isShowIframe" scrolling="no" id="playIframe" :src="currentUrl" allowfullscreen="true"></iframe>
                </div>
    `,
    mounted() {
        this.currentRows = this.option.queryParam?.camera_list || [];
        if (this.option.queryParam?.isTyn) {
            this.baseUrl = "https://video.topyn.cn/dispose/play/index?&autoPlay=1&devId=";
        }
        if (this.currentRows && this.currentRows.length > 0) {
            this.currentUrl = this.baseUrl + this.currentRows[0].device_id;
            this.activeVideo = this.currentRows[0].device_id;
        }
    },
    methods: {
        selectVisibleChange(val) {
            this.isShowIframe = !val
        },
        deviceChange(id) {
            this.currentUrl = this.baseUrl + id;
        }
    }
};
Vue.component("module_video_exp", moduleVideoExp);
