/**
 * 气象数据
 */
const granaryMetData = {
    props: {
        // 区县code
        areaCode: {
            type: String,
            default: ""
        },
        // 每项数据
        option: {
            type: Object,
            default: {}
        }
    },
    template: `
            <div class="met-data-content">
                <div class="met-data-date" v-show="dateArr.length">
                    <i class="el-icon-arrow-left" @click="carouselPrev" v-show="dateArr.length > 1"></i>
                    <el-carousel ref="carouselt" @change="carouselChange" height="2vw" indicator-position="none" arrow="never" :autoplay="false">
                        <el-carousel-item v-for="item in dateArr" :key="item">
                            <h3>{{ item }}</h3>
                        </el-carousel-item>
                    </el-carousel>
                    <i class="el-icon-arrow-right" @click="carouselNext" v-show="dateArr.length > 1"></i>
                </div>
                <div class="met-data-content-box">
                    <div class="met-top-t">
                        <div>
                            <span>{{curTemp}}℃</span>
                            <br>
                            <span>{{curTempInfo}}</span>
                        </div>
                    </div>
                    <div class="met-bottom-t">
                        温度提醒
                    </div>
                </div>
                <div class="met-data-content-box">
                    <div class="met-top-t">
                        <div>
                            <span>{{curRain}}mm</span>
                            <br>
                            <span>{{curRainInfo}}</span>
                        </div>
                    </div>
                    <div class="met-bottom-t">
                        降雨播报
                    </div>
                </div>
                <div class="met-data-content-box">
                    <div class="met-top-t">
                        <div>
                            <span>{{curUvi}}</span>
                            <br>
                            <span>{{curUviInfo}}</span>
                        </div>
                    </div>
                    <div class="met-bottom-t">
                        UVI提醒
                    </div>
                </div>
                <div class="met-data-content-box">
                    <div class="met-top-t">
                        <div>
                            <span>{{curWindLevel}}级</span>
                            <br>
                            <span>{{curWindInfo}}</span>
                        </div>
                    </div>
                    <div class="met-bottom-t">
                        风速告警
                    </div>
                </div>
            </div>
    `,
    data() {
        return {
            // 日期存储数组
            dateArr: [],
            // 选中日期
            checkDate: "",
            // 气象数据存储
            metDataObj: {}
        }
    },
    computed: {
        /**
         * @returns 当前数据
         */
        activeDateWeather() {
            if(this.checkDate){
                return this.metDataObj[this.checkDate];
            }
            return {};
        },
        /**
         * @returns 白天温度
         */
        curDayTemp() {
            return this.activeDateWeather.temp_day || "";
        },
        /**
         * @returns 晚上温度
         */
        curNightTemp() {
            return this.activeDateWeather.temp_night || "";
        },
        /**
         * 温度提醒温度值
         */
        curTemp() {
            if(this.curDayTemp!="" && this.curNightTemp!=""){
                let dayTemp = parseFloat(this.curDayTemp);
                let nightTemp = parseFloat(this.curNightTemp);
                return ((dayTemp+nightTemp)/2).toFixed(1);
            }
            return "--";
        },
        /**
         * 是否温度告警
         * @returns {boolean}
         */
        curTempAlarmState() {
            if(this.curDayTemp!="" && this.curNightTemp!=""){
                let dayTemp = parseFloat(this.curDayTemp);
                let nightTemp = parseFloat(this.curNightTemp);
                let min = Math.min(dayTemp, nightTemp);
                let max = Math.max(dayTemp, nightTemp);
                if(min<0 || max>=35){
                    return true;
                }
            }
            return false;
        },
        /**
         * 温度告警信息
         * @returns {string}
         */
        curTempInfo() {
            if(this.curDayTemp!="" && this.curNightTemp!=""){
                let dayTemp = parseFloat(this.curDayTemp);
                let nightTemp = parseFloat(this.curNightTemp);
                let min = Math.min(dayTemp, nightTemp);
                let max = Math.max(dayTemp, nightTemp);
                if(min<0){
                    return "霜冻";
                }else if(max>=35){
                    return "高温";
                }
            }
            return "无告警";
        },
        /**
         * @returns 降雨量
         */
        curRain() {
            return this.activeDateWeather.qpf || "--";
        },
        /**
         * @returns 降雨量信息
         */
        curRainInfo() {
            let qpf = parseFloat(this.activeDateWeather.qpf || 0);
            if(qpf>=250){
                return "特大暴雨";
            }else if(qpf>=100){
                return "大暴雨";
            }else if(qpf>=50){
                return "暴雨";
            }else if(qpf>=25){
                return "大雨";
            }else if(qpf>=10){
                return "大雨";
            }else if(qpf>=0.1){
                return "小雨";
            }else if(qpf>0){
                return "毛毛雨";
            }else{
                return "无降水";
            }
        },
        /**
         * 是否降雨告警
         * @returns {boolean}
         */
        curRainAlarmState() {
            let qpf = parseFloat(this.activeDateWeather.qpf || 0);
            return qpf>=25;
        },
        /**
         * @returns uvi 值
         */
        curUvi() {
            return parseInt(this.activeDateWeather.uvi || 0)
        },
        /**
         * @returns uvi 描述
         */
        curUviInfo() {
            if(this.curUvi>9){
                return "避免外出";
            }else if(this.curUvi>7){
                return "重度防护";
            }else if(this.curUvi>4){
                return "注意防护";
            }else{
                return "无警告";
            }
        },
        /**
         * 是否Uvi告警
         * @returns {boolean}
         */
        curUVIAlarmState() {
            return this.curUvi>4;
        },
        /**
         * @returns 风速
         */
        curWindLevel() {
            let level = 0;
            let dayLevel = this.activeDateWeather.wind_level_day || "";
            if(dayLevel){
                let dayArr = dayLevel.split("-");
                level = parseInt(dayArr[0]);
                if(level==0){
                    if(dayArr.length>1){
                        level = parseInt(dayArr[1]);
                    }
                }
            }
            if(level==0){
                let nightLevel = this.activeDateWeather.wind_level_night || "";
                if(nightLevel){
                    let nightArr = nightLevel.split("-");
                    level = parseInt(nightArr[0]);
                    if(level==0){
                        if(nightArr.length>1){
                            level = parseInt(nightArr[1]);
                        }
                    }
                }
            }
            return level;
        },
        /**
         * @returns 风速描述
         */
        curWindInfo() {
            let windLevelArr = ["无风","软风","轻风","微风","和风","清风","强风","劲风","大风","烈风","狂风","暴风","台风","台风","强台风","强台风","超强台风","超强台风"];
            return windLevelArr[this.curWindLevel] || "--"
        },
        /**
         * 是否风速告警
         * @returns {boolean}
         */
        curWindAlarmState() {
            return this.curWindLevel>=6;
        }
    },
    methods: {
        /**
         * 获取气象数据
         */
        getMetData() {
            let params = { region_code: this.areaCode }
            if (this.option.queryParam && JSON.stringify(this.option.queryParam) != "{}") {
                Object.keys(this.option.queryParam).forEach(item => {
                    params[item] = this.option.queryParam[item]
                })
            }
            tpHttp.post(this, this.option.apiurl, { param: JSON.stringify(params) }, (data, code, message) => {
                if (code == 0 && data && JSON.stringify(data) != "{}" && data.forecast && data.forecast.length) {
                    this.checkDate = data.forecast[0].predict_date
                    let dateArr = [], metDataObj = {}
                    data.forecast.forEach(item => {
                        dateArr.push(item.predict_date)
                        metDataObj[item.predict_date] = item;
                    })
                    this.dateArr = dateArr;
                    this.metDataObj = metDataObj;
                } else {
                    this.checkDate = "";
                    this.dateArr = [];
                    this.metDataObj = {};
                }
            })
        },
        /**
         * 时间切换 上一位点击
         */
        carouselPrev() { 
            this.$refs.carouselt.prev()
        },
        /**
         * 时间切换 下一位点击
         */
        carouselNext() { 
            this.$refs.carouselt.next()
        },
        /**
         * 日期切换事件
         */
        carouselChange(data) {
            this.checkDate = this.dateArr[data]
        }
    },
    mounted() {
        // 获取气象数据
        this.getMetData();
    }
}
Vue.component("granary-met-data",granaryMetData)