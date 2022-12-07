// 家人相关接口Api
import request from "@/plugins/axios"
const familyAPI = {
  getFamilyList: async (params?: Record<string, any>) => {
    return request({
      method: 'GET',
      url: '/app-rest/v2/app/patient/merge/auth/relation/list',
      params
    });
  }
}

export default familyAPI;