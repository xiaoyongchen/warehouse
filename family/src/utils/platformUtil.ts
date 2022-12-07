export const PlatformUtil = {

    // 返回页面运行的操作系统的名字
    osName(): string {
        const userAgent = navigator.userAgent
        if (userAgent.indexOf('Android') !== -1) {
            return 'android'
        }
        if (userAgent.indexOf('iPhone') !== -1 || userAgent.indexOf('iPad') !== -1) {
            return 'ios'
        }
        return 'h5'
    },

    // 是否运行在jiahui app中
    isInJiahuiApp(): boolean {
        return navigator.userAgent.indexOf('App/Jiahui') != -1
    }
}