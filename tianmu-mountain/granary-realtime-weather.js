/**
 * 实时气象
 */
const granaryRealtimeWeather = {
    props: {
        // 每项数据
        option: {
            type: Object,
            default: {}
        }
    },
    template: `
            <div class="real-time-content">
                <div class="realtime-tiele" v-show="weatherTitleArr.length">
                    <div class="realtime-prev" @click="carouselPrev" v-show="weatherTitleArr.length > 1"></div>
                    <el-carousel ref="carouselw" @change="carouselChange" height="4vh" indicator-position="none" arrow="never" :autoplay="false">
                        <el-carousel-item v-for="item in weatherTitleArr" :key="item">
                            <h3>{{ item.terminalName }}</h3>
                        </el-carousel-item>
                    </el-carousel>
                    <div class="realtime-next" @click="carouselNext" v-show="weatherTitleArr.length > 1"></div>
                </div>
                <div class="realtime-t-box" v-show="listData.length">
                    <div class="realtime-block-box" v-for="(item,index) in listData" :key="index + 'real'">
                        <p>{{item.deviceName}}</p>
                        <span>{{item.value}}</span><span>{{item.unit}}</span>
                    </div>
                </div>
                <div class="realtime-t-box" style="display:block" v-show="!listData.length">
                    <div class="no-data-t">
                        暂无数据
                    <div>
                </div>
            </div>
    `,
    data() {
        return {
            // 获取实时气象数据参数
            terminalTypes: "20",    //该参数可通过后台配置queryParam.terminalTypes指定终端类型
            // 实时气象数据
            realTimeWeatherData: [],
            // 气象标题数组
            weatherTitleArr: [],
            // 选中终端id
            terminalId: ""
        }
    },
    computed: {
        /**
         *  列表数据
         */  
        listData() {
            let obj = this.realTimeWeatherData.filter(item => {
                return item.terminalId == this.terminalId
            })
            return obj[0]?.sensorList || []
        }
    },
    methods: {
        /**
         * 获取实时气象数据
         */   
        getRealTimeWeatherData() {
            let params = { terminalTypes: this.terminalTypes }
            if (this.option.queryParam && JSON.stringify(this.option.queryParam) != "{}") {
                Object.keys(this.option.queryParam).forEach(item => {
                    params[item] = this.option.queryParam[item]
                })
            }
            tpHttp.post(this, this.option.apiurl, { param: JSON.stringify(params) }, (data, code, message) => {
                if (code == 0 && data && data.length) {
                    let weatherTitleArr = []
                    this.realTimeWeatherData = data;
                    this.terminalId = data[0].terminalId;
                    data.forEach(item => {
                        let obj = {
                            terminalName:item.terminalName,
                            terminalId:item.terminalId
                        }
                        weatherTitleArr.push(obj)
                    })
                    this.weatherTitleArr = weatherTitleArr;
                } else {
                    this.realTimeWeatherData = [];
                    this.terminalId = "";
                }
            })
        },
        /**
         * 标题切换 上一位点击
         */
        carouselPrev() { 
            this.$refs.carouselw.prev()
        },
        /**
         * 标题切换 下一位点击
         */
        carouselNext() { 
            this.$refs.carouselw.next()
        },
        /**
         * 标题切换事件
         */
        carouselChange(data) {
            this.terminalId = this.weatherTitleArr[data]?.terminalId
        }
    },
    mounted() {
        // 获取实时气象数据
        this.getRealTimeWeatherData();
    }
}
Vue.component("granary-realtime-weather",granaryRealtimeWeather)