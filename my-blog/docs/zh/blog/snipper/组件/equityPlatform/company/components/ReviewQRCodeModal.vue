<template>
  <el-dialog
   title="查看二维码"
   :visible="visible"
   width="400px"
   destroy-on-close
   :close-on-press-escape="false"
   center
   @close="cancel"
 >
   <div class="content">
    <img
      alt='二维码图片'
      :src="src"
      class="content"
      width="240"
      height="240"
    />
   </div>
   <div slot="footer" class="bottom-view">
     <el-button  size="small" @click="cancel" class="button">取消</el-button>
     <el-button type="primary" size="small" @click="downloadPicture(src)" class="button">下载</el-button>
   </div>
 </el-dialog>
</template>

<script>
import { defineComponent, watch, reactive, toRefs } from '@vue/composition-api'
import { CompanyApi } from '../../../../api/equityPlatform'

const Props = {
  visible: Boolean,
  modalType: String,
  data: [Object, String, Number],
  // 小程序地址
  page: String
}
export default defineComponent({
  name: 'MemberModal',
  props: Props,
  setup (props, { emit }) {
    const state = reactive({
      src: ''
    })
    watch(() => [props.data, props.page], (val) => {
      const [first, page] = val || []
      if (first && page) {
        requestQrcode({ page, scene: first })
      }
    })
    const requestQrcode = async (item = {}) => {
      try {
        const params = {
          ...item,
          width: 240,
          isHyaline: true,
          envVersion: process.env.VUE_APP_ENVVERSION
        }
        const res = await CompanyApi.qrcode(params)
        if (res.code === 0 && res.data) {
          state.src = res.data
        }
      } catch (error) {

      }
    }
    const downloadPicture = async (url = '') => {
      if (url) {
        try {
          const base64 = await getUrlBase64(url)
          const link = document.createElement('a')
          link.href = base64
          link.download = 'qrCode.png'
          link.click()
        } catch (error) {
          console.log(error)
        }
      }
    }
    const getUrlBase64 = (url) => {
      return new Promise(resolve => {
        let canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const img = new Image()
        img.crossOrigin = 'Anonymous' // 允许跨域
        img.src = url
        img.onload = function () {
          canvas.height = 240
          canvas.width = 240
          ctx.drawImage(img, 0, 0, 240, 240)
          const dataURL = canvas.toDataURL('image/png')
          canvas = null
          resolve(dataURL)
        }
      })
    }

    const cancel = () => {
      emit('cancel')
    }

    return {
      ...toRefs(state),
      cancel,
      downloadPicture
    }
  }
})
</script>

<style lang="scss" scoped>
  .content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
 .bottom-view {
   display: flex;
   flex-direction: row;
   justify-content: center;
   align-items: center;
   .button {
     width: 64px;
   }
 }
</style>
