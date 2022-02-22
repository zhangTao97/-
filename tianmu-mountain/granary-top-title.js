/**
 * 头部组件
 */
const granaryTopTitle = {
    props: {
        // 区县code
        areaCode: {
            type: String,
            default: ""
        },
        // 头部标题
        headTitle: {
            type: String,
            default: "“天目粮仓”数智大田"
        }
    },
    template: `
            <div class="granary-top-title">
                <!-- 左侧动态日期 -->
                <div class="title-left">
                    <span>{{DATE}}</span>
                </div>
                <!-- 中间标题 -->
                <div class="title-middle">
                    <span>{{headTitle}}</span>
                </div>
                <!-- 右侧天气 -->
                <div class="title-right">
                    <div class="weather-img" v-show="weatherDataCode">
                        <img :src="'https://cdn.img.zjtpyun.com/weather/img/' + weatherDataCode + '.png'" alt="">
                    </div>
                    <span style="margin-left:10px;" v-show="weatherData.condition && weatherData.temp">{{weatherData.condition || "- -"}}<span style="margin-left:10px;"> {{weatherData.temp || "- -"}}℃ </span></span>

                </div>
            </div>
    `,
    data() {
        return {
            // 星期索引
            WEEKINDEX: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
            // 左上角日期详情
            DATE: "",
            // 当天天气数据
            weatherData: {}
        }
    },
    computed: {
        // 天气图片 code  处理
        weatherDataCode() {
            let code
            if (this.weatherData?.icon) {
                code = this.weatherData.icon.toString().padStart(2, 0)
            } else {
                code = false
            }
            return code
        }
    },
    methods: {
        /**
         * 左上动态日期
         */
        dynamicDate() {
            let date = new Date().getFullYear() + "-" + (new Date().getMonth() + 1).toString().padStart(2, 0) + "-" + new Date().getDate().toString().padStart(2, 0)
            let time = new Date().getHours().toString().padStart(2, 0) + ":" + new Date().getMinutes().toString().padStart(2, 0) + ":" + new Date().getSeconds().toString().padStart(2, 0)
            let week = this.WEEKINDEX[new Date().getDay()]
            return date + "\u00a0\u00a0" + time + "\u00a0\u00a0" + week
        },
        /**
         * 获取天气数据
         */
        getWeatherData() {
            let params = { region_code: this.areaCode }
            
            tpHttp.post(this, "action=com.top.regulate.bi.weather.condition", { param: JSON.stringify(params) }, (data, code, message) => {
                if (code == 0 && data && JSON.stringify(data) != "{}" && data.condition ) {
                    this.weatherData = data.condition;
                } else {
                    this.weatherData = {}
                }
            })
        }
    },
    mounted() {
        // 获取天气数据
        this.getWeatherData();
        // 左上动态日期赋值
        setInterval(() => {
            setTimeout(() => {
                this.DATE = this.dynamicDate();
            })
        },1000)
    }
}
Vue.component("granary-top-title",granaryTopTitle)