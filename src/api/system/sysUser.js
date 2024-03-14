/*
用户管理相关的API请求函数
*/
import request from '@/utils/request'

const api_name = '/admin/system/sysUser'

export default {

    /*
    获取角色分页列表(带搜索)
    */
    getPageList(page, limit, searchObj) {
        return request({
            url: `${api_name}/${page}/${limit}`,
            method: 'get',
            params: searchObj
        })
    },
    removeById(id) {
        return request({
            url: `${api_name}/remove/${id}`,
            method: 'delete'
        })
    },

    // batch Remove user
    batchRemove(idList) {
        return request({
            url: `${api_name}/batchRemove`,
            method: 'delete',
            data: idList
        })
    },
    // add user
    save(user) {
        return request({
            url: `${api_name}/save`,
            method: 'post',
            data: user
        })
    },
    // update user by id
    updateById(user) {
        return request({
            url: `${api_name}/update`,
            method: 'put',
            data: user
        })
    },
    // get user info by id
    getById(id) {
        return request({
            url: `${api_name}/get/${id}`,
            method: 'get'
        })
    },
    updateStatus(id, status) {
        return request({
            url: `${api_name}/updateStatus/${id}/${status}`,
            method: 'get'
        })
    }
}