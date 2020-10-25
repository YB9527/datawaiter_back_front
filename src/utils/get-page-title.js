import defaultSettings from '@/settings'

const title = defaultSettings.title || '数据服务'

export default function getPageTitle(pageTitle) {
 /* if (pageTitle) {
    return `${pageTitle} - ${title}`
  }*/
  return `${title}`
}
