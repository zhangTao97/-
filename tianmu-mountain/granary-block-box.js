/**
 * 两边块级盒子
 */
const granaryBlockBox = {
    props: {
        title: {
            type: String,
            default: ""
        }  
    },
    template: `
                <div class="granary-block-box">
                    <div class="granary-block-box-title">
                        {{title}}
                    </div>
                    <div class="granary-block-content">
                        <slot></slot>
                    </div>
                </div>
    
    `
}
Vue.component("granary-block-box",granaryBlockBox)