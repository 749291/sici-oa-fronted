<template>
    <div class="app-container">

        <!-- 工具条 -->
        <div class="tools-div">
            <el-button class="btn-add" size="mini" @click="add">添 加</el-button>
            <el-button class="btn-add" size="mini" @click="syncMenu">同步菜单</el-button>
            <el-button class="btn-add" size="mini" @click="removeMenu">删除菜单</el-button>
        </div>

        <el-table :data="list" style="width: 100%;margin-bottom: 20px;" row-key="id" border default-expand-all
            :tree-props="{ children: 'children' }">

            <el-table-column label="名称" prop="name" width="350"></el-table-column>
            <el-table-column label="类型" width="100">
                <template slot-scope="scope">
                    {{ scope.row.type == 'view' ? '链接' : scope.row.type == 'click' ? '事件' : '' }}
                </template>
            </el-table-column>
            <el-table-column label="菜单URL" prop="url"></el-table-column>
            <el-table-column label="菜单KEY" prop="meunKey" width="130"></el-table-column>
            <el-table-column label="排序号" prop="sort" width="70"></el-table-column>
            <el-table-column label="操作" width="170" align="center">
                <template slot-scope="scope">
                    <el-button v-if="scope.row.parentId > 0" type="text" size="mini"
                        @click="edit(scope.row.id)">修改</el-button>
                    <el-button v-if="scope.row.parentId > 0" type="text" size="mini"
                        @click="removeDataById(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="添加/修改" :visible.sync="dialogVisible" width="40%">
            <el-form ref="flashPromotionForm" label-width="150px" size="small" style="padding-right: 40px;">

                <el-form-item label="选择一级菜单">
                    <el-select v-model="menu.parentId" placeholder="请选择">
                        <el-option v-for="item in list" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="菜单名称">
                    <el-input v-model="menu.name" />
                </el-form-item>
                <el-form-item label="菜单类型">
                    <el-radio-group v-model="menu.type">
                        <el-radio label="view">链接</el-radio>
                        <el-radio label="click">事件</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="menu.type == 'view'" label="链接">
                    <el-input v-model="menu.url" />
                </el-form-item>
                <el-form-item v-if="menu.type == 'click'" label="菜单KEY">
                    <el-input v-model="menu.meunKey" />
                </el-form-item>
                <el-form-item label="排序">
                    <el-input v-model="menu.sort" />
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false" size="small">取 消</el-button>
                <el-button type="primary" @click="saveOrUpdate()" size="small">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import menuApi from '@/api/wechat/menu'
const defaultForm = {
    id: null,
    parentId: 1,
    name: '',
    nameId: null,
    sort: 1,
    type: 'view',
    meunKey: '',
    url: ''
}
export default {

    // 定义数据
    data() {
        return {
            list: [],
            dialogVisible: false,
            menu: defaultForm,
            saveBtnDisabled: false
        }
    },

    // 当页面加载时获取数据
    created() {
        this.fetchData()
    },

    methods: {
        // 调用api层获取数据库中的数据
        fetchData() {
            console.log('加载列表')
            menuApi.findMenuInfo().then(response => {
                this.list = response.data
                console.log(this.list)
            })
        },

        // 根据id删除数据
        removeDataById(id) {
            // debugger
            this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => { // promise
                // 点击确定，远程调用ajax
                return menuApi.removeById(id)
            }).then((response) => {
                this.fetchData(this.page)
                this.$message.success(response.message || '删除成功')
            }).catch(() => {
                this.$message.info('取消删除')
            })
        },

        // -------------
        add() {
            this.dialogVisible = true
            this.menu = Object.assign({}, defaultForm)
        },

        edit(id) {
            this.dialogVisible = true
            this.fetchDataById(id)
        },

        fetchDataById(id) {
            menuApi.getById(id).then(response => {
                this.menu = response.data
            })
        },

        saveOrUpdate() {
            this.saveBtnDisabled = true // 防止表单重复提交

            if (!this.menu.id) {
                this.saveData()
            } else {
                this.updateData()
            }
        },

        // 新增
        saveData() {
            menuApi.save(this.menu).then(response => {
                this.$message.success(response.message || '操作成功')
                this.dialogVisible = false
                this.fetchData(this.page)
            })
        },

        // 根据id更新记录
        updateData() {
            menuApi.updateById(this.menu).then(response => {
                this.$message.success(response.message || '操作成功')
                this.dialogVisible = false
                this.fetchData(this.page)
            })
        },
        syncMenu() {
            this.$confirm('你确定上传菜单吗, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                return menuApi.syncMenu()
            }).then((response) => {
                this.$message.success(response.message)
            }).catch(error => {
                console.log('error', error)
                if (error === 'cancel') {
                    this.$message.info('取消上传')
                }
            })
        },
        removeMenu() {
            menuApi.removeMenu().then(response => {
                this.$message.success('菜单已删除')
            })
        }
    }
}
</script>