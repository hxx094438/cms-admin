<template>
  <div class="article">
    <card :type="type" @toggle="changeType($event)" :width="width">
      <div class="item" style="margin-top: 10px;">
        <span class="text" style="line-height: 38px;" :style="{ 'width': width }">搜索：</span>
        <div class="el-radio-group">
          <el-input
            v-model="keyword"
            placeholder="标题，描述"
            @keyup.enter.native="getData"
            size="small"
          ></el-input>
          <el-button type="primary" @click.native="getData" size="small">查询</el-button>
        </div>
      </div>
    </card>

    <div class="table">
      <el-table :data="list" style="width: 100%" v-loading="fetch">
        <el-table-column type="expand" label-class-name="head">
          <template slot-scope="props">
            <el-form label-position="left" class="table-expand">
              <el-form-item label="标签">
                <span
                  v-for="item in props.row.tag"
                  :key="item._id"
                  style="margin-right: 10px;"
                >{{ item.name }}</span>
              </el-form-item>
              <el-form-item label="关键字">
                <span>{{ props.row.keyword }}</span>
              </el-form-item>
              <el-form-item label="描述">
                <span>{{ props.row.descript }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="文章id" label-class-name="head" :width="100"></el-table-column>
        <el-table-column
          prop="title"
          label="文章标题"
          :width="280"
          label-class-name="head"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <a
              :href="`https://jkchao.cn/article/${scope.row._id}`"
              class="article-link"
              target="_blank"
            >{{ scope.row.title }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="发布日期" width="180" label-class-name="head">
          <template slot-scope="scope">{{ scope.row.create_at | format('yyyy-MM-dd hh.mm')}}</template>
        </el-table-column>
        <el-table-column label="分类" label-class-name="head">
          <template slot-scope="scope">
            {{
            scope.row.type === 1
            ? 'Code'
            : scope.row.type === 2
            ? 'Think'
            : 'Music'
            }}
          </template>
        </el-table-column>
        <el-table-column label="公开" label-class-name="head">
          <template slot-scope="scope">
            {{
            scope.row.publish === 1
            ? '公开'
            : '私密'
            }}
          </template>
        </el-table-column>
        <el-table-column label="状态" label-class-name="head">
          <template slot-scope="scope">
            {{
            scope.row.state === 1
            ? '发布'
            : '草稿'
            }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300" label-class-name="head" fixed="right">
          <template slot-scope="scope">
            <transition-group name="btn" tag="div">
              <el-button type="info" size="small" key="1" @click="edit(scope.row)">修改</el-button>
              <el-button
                type="danger"
                size="small"
                key="2"
                v-if="scope.row.publish === 1"
                @click="changeState(scope.row, 'publish', 2)"
              >私密</el-button>
              <el-button
                type="success"
                size="small"
                key="3"
                v-else
                @click="changeState(scope.row, 'publish', 1)"
              >公开</el-button>
              <el-button
                type="success"
                size="small"
                key="4"
                v-if="scope.row.state === 2"
                @click="changeState(scope.row, 'state', 1)"
              >发布</el-button>
              <el-button
                type="danger"
                size="small"
                key="5"
                v-else
                @click="changeState(scope.row, 'state', 2)"
              >草稿</el-button>
              <el-button
                type="danger"
                size="small"
                key="6"
                v-if="scope.row.state === 2"
                :disabled="scope.row.deleteing"
                @click="dele(scope.row)"
              >{{ scope.row.deleteing ? '删除中' : '删 除' }}</el-button>
            </transition-group>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          :current-page="currentPage"
          layout="total, prev, pager, next"
          :page-size="10"
          @current-change="pageChange"
          :total="total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import Card from "../../components/Card.vue";
export default {
  data() {
    return {
      Item: {},
      IList: [
        {
          name: "标签",
          typeName: "tag",
          list: [
            { name: "全部", id: "" },
            { name: "Javascript", id: 1 },
            { name: "Vue", id: 2 },
            { name: "Http", id: 3 }
          ],
          default: ""
        },
        {
          name: "分类",
          typeName: "type",
          list: [
            { name: "全部", id: "" },
            { name: "Code", id: 1 },
            { name: "Think", id: 2 },
            { name: "Music", id: 3 }
          ],
          default: ""
        },
        {
          name: "公开",
          typeName: "publish",
          list: [
            { name: "全部", id: "" },
            { name: "公开", id: 1 },
            { name: "私密", id: 2 }
          ],
          default: ""
        },
        {
          name: "状态",
          typeName: "state",
          list: [
            { name: "全部", id: "" },
            { name: "已发布", id: 1 },
            { name: "草稿", id: 2 }
          ],
          default: ""
        }
      ],
      IPara: {
        tag: "",
        type: "",
        publish: "",
        state: ""
      },
      keyword:'',
      currentPage:''
    };
  },

  component: ["Card"],

  computed:{
    list() {
      return []
    },

    total() {
      return 1
    },

    tag() {
      return []
    }
  },


  methods: {
    fetch(){

    },

    pageChange() {

    },

    changeType() {

    },
    edit() {

    },
    changeState() {

    },

    dele() {

    },
    getData() {

    },
  }


};
</script>

<style lang="scss" >
@import "../../assets/scss/variable.scss";

.article {
  height: 100%;

  > .el-card {
    margin-bottom: $normal-pad;
  }

  .table-expand {
    font-size: 0;
  }

  .table-expand label {
    width: 70px;
    color: #99a9bf;
  }

  .table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
  }

  .article-link {
    text-decoration: underline;
  }
}
</style>
