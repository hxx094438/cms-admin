<template>
<!-- v-loading="fetch" -->
  <div class="release" >
    <el-form
      :model="form"
      label-width="100px"
      label-position="left"
      ref="form">
      <el-col :span="16">
        <el-form-item
          label="文章标题"
          prop="title"
          :rules="[
            { required: true, message: '请输入文章标题', trigger: 'blur' }
          ]">
          <el-input v-model="form.title" :maxlength="40" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item
          label="文章关键字"
          prop="keyword"
          :rules="[
            { required: true, message: '请输入文章关键字', trigger: 'blur' }
          ]">
          <el-input v-model="form.keyword" :maxlength="20" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item
          label="文章标签"
          v-if="Array.isArray(form.tags)"
          prop="tags"
          :rules="[
            { required: true, type: 'array', message: '请选择文章标签', trigger: '' }
          ]">
          <el-checkbox-group v-model="form.tags" fill="#324057" text-color="white">
            <el-checkbox-button
              v-for="item in tags"
              :label="item"
              :key="item">{{ item }}
            </el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item
          label="文章描述"
          prop="descript">
          <el-input
            v-model="form.descript"
            :maxlength="200"
            type="textarea"
            :rows="4"></el-input>
        </el-form-item>
        <el-form-item
          label="文章内容"
          prop="content"
          :rules="[
            { required: true, message: '请输入文章内容', trigger: 'blur, change' }
          ]"
          class="markdown">
          <vue-simplemde
            v-model="form.content"
            ref="markdownEditor"
            :id="form.aid"
            :configs="configs"
            :highlight="true"
            preview-class="markdown-body">
            </vue-simplemde>
        </el-form-item>
        <el-form-item style="margin-bottom: 0">
          <el-button
            @click="submitForm('form')"
            :disabled="posting">{{
            posting
              ? '提交中'
              : id
              ? '修改'
              : '发布'
            }}
          </el-button>
        </el-form-item>

      </el-col>

      <el-col :span="8" class="right">
        <div class="right-form">
          <el-form-item label="文章分类" label-width="90px" style="margin-bottom: 10px;"
          :rules="[
            { required: true, type: 'number', message: '请选择文章分类'}
          ]"
          prop="type"
          >
            <el-radio-group v-model="form.type">
              <el-radio :label=1>码农</el-radio>
              <el-radio :label=2>读书</el-radio>
              <el-radio :label=3>民谣</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="文章状态" label-width="90px" style="margin-bottom: 10px;"
          :rules="[
            { required: true, type: 'number', message: '请选择文章状态'}
          ]"
          prop="state"
          >
            <el-radio-group v-model="form.state">
              <el-radio :label=1>发布</el-radio>
              <el-radio :label=2>草稿</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="文章公开" 
          label-width="90px" 
          style="margin-bottom: 10px;"
          prop="isPublish"
          :rules="[
            { required: true, type: 'boolean', message: '请选择是否公开文章'}
          ]">
            <el-radio-group v-model="form.isPublish">
              <el-radio :label="true">公开</el-radio>
              <el-radio :label="false">私密</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>

        <div class="right-form" style="margin-top: 24px;">
          <el-form-item
            label="缩略图"
            label-width="90px"
            class="img-item"
            prop="thumb">
            <el-upload
              class="avatar-uploader"
              :action="upload_qiniu_url"
              :data="qn"
              :drag="true"
              :show-file-list="false"
              :on-success="handleSuccess"
              :before-upload="beforeUpload"
              :on-progress="handlePro"
              :on-error="handleError">
              <img v-if="form.thumb" :src="form.thumb" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <el-input v-model="form.thumb" size="small" class="link"></el-input>
            <el-progress :percentage="percent" v-if="percent !== 0 && percent !== 100"></el-progress>
          </el-form-item>
        </div>
      </el-col>
    </el-form>
  </div>
</template>

<script>
  import {error} from '../../utils/resp'
  import VueSimplemde from 'vue-simplemde'
  import {mapActions, mapState, mapMutations, mapGetters} from "vuex";

  export default {
    components: { VueSimplemde },
    data() {
      return {
        content: `**this is test**
          * vue
          * element
          1. markdown
          2. editor
          ## Simplemde
          [link](https://www.baidu.com) 
          ![图片](https://i.imgur.com/sZlktY7.png)`,
        html: '',
        configs: {
          autosave: {
            enabled: true,
            uniqueId: 'MyUniqueID',
            delay: 1000
          },
          status: false,
          indentWithTabs: false,
          spellChecker: false
        },
        form: {
          title: '',
          keyword:'',
          descript:'',
          tag:[],
          content:'',
          isPublish: true,
          state:1,
          type:1,
          thumb:''
        },
        qn: {
          token: '',
          key:''
        },
        upload_qiniu_url:'http://upload-z2.qiniup.com',
        upload_qiniu_addr: "http://pxan221gl.bkt.clouddn.com/",
        percent: 0,
        // id:'',
      }
    },

    computed: {

      ...mapState({
        posting: state => state.articles.posting,
        detail: state => state.articles.detail,
        QNtoken: state => state.QNtoken
//        list: state => state.tag.list
      }),
      id () {
        return this.$route.query.id
      },
      tags() {
         return this.detail.tags || []
      },
    },


    async created() {
      await Promise.all([
        this.getTags({}),        // 标签列表
        this.getArticle(this.id),
        this.getQiniu()
      ])
      this.qn.token = this.QNtoken
    },

    methods: {

      ...
        mapActions({
          getTags: 'tag/GET_TAGS',
          getArticle: "articles/GET_ARTICLE",
          saveArticle: 'articles/SAVE_ARTICLE',
          patchArticle: 'articles/PATCH_ARTICLE',
          getQiniu: 'GET_QINIU'
        }),


      fetch() {
        return this.$store.state.article.fetch
      },

      handleSuccess(res) {
        this.$set(this.form,'thumb',this.upload_qiniu_addr + res.key)
        console.log('this.form.thumb',this.form.thumb)
      },

      handlePro(e) {
        this.percent = Math.ceil(e.percent)
      },

      handleError(res) {
        error(res.message)
      },

      beforeUpload(file) {
        this.qn.key = file.name
        const isAlowFormat = file.type === 'image/jpeg' || file.type === 'image/png'
        const isLt10M = file.size / 1024 / 1024 < 10

        if (!isAlowFormat) {
          error('上传头像图片只能是 JPG/PNG 格式!')
        }
        if (!isLt10M) {
          error('上传头像图片大小不能超过 10MB!')
        }
        return isAlowFormat && isLt10M
      },

      submitForm(formName) {
        (this.$refs[formName] ).validate(async (valid) => {
          if (valid) {
            console.log('thisadasd',this.form.content)
            let res
            if (!this.id) {
              res = await this.saveArticle({...this.form})
            } 
            else {
              console.log('patch')
               res = await this.patchArticle({...this.form})
            }
            if (res.code === 0) this.$router.push('/article/index')
            return true
          } else {
            return false
          }
        })
      },


    },

    beforeRouteUpdate(to, form, next) {
      this.id = ''
      // this.form = {
      //   title: '',
      //   keyword: '',
      //   descript: '',
      //   tags: [],
      //   content: '',
      //   publish: 1,
      //   state: 1,
      //   type: 1,
      //   thumb: ''
      // }
      next()
    },

    watch: {
      detail(val) {
        this.form = {
          ...val
        }
      }
    }
  }



</script>

<style lang="scss">

  @import '../../assets/scss/variable.scss';

  .release {
    margin-bottom: $lg-pad;

    > .el-form {
      display: flex;
      justify-content: space-between;

      > .el-col:first-child {
        background: $white;
        padding: $lg-pad;

        > .btn {
          text-align: right;
        }
      }

      .right {
        margin-left: 24px;

        .right-form {
          padding: $lg-pad;
          background: $white;

          &::first-child {
            .el-form-item {
              display: flex;
              align-items: center;

              label {
                flex-shrink: 0;
              }

              .el-form-item__content {
                margin: 0 !important;
              }
            }
          }

          .img-item {
            display: flex;
            flex-wrap: wrap;

            > .el-form-item__content {
              margin: $normal-pad 0 0 0 !important;
              width: 100%;
              text-align: center;
            }

            .link {
              width: 60%;
              margin: auto;
            }
          }
        }
      }

      .markdown {

        .el-form-item__content {
          line-height: 1.4;
        }

        .markdown-editor .CodeMirror {
          height: 400px;
        }
      }
    }

    .markdown-body {
      color: $black;
      word-wrap: break-word;

      a {
        font-weight: bold;
        margin: 0 .1rem;

        &.image-link {
          margin: 0;
        }

        &:hover {
          text-decoration: underline;
        }
      }

      .image-package {
        text-align: center;
        width: 92%;
        margin: 0 auto 1rem auto;

        .img-caption {
          min-width: 10%;
          max-width: 80%;
          min-height: 22px;
          display: inline-block;
          padding: 6px;
          margin: 0 auto;
          border-bottom: 1px solid #d9d9d9;
          font-size: 14px;
          color: #969696;
          line-height: 1.2;

          &:empty {
            display: none;
          }
        }
      }

      img {
        max-width: 100%;
        margin: .5rem auto;
        display: block;
        text-align: center;
        border-radius: $radius;
        transition: all .25s;
        opacity: .9;

        &.img-pop {
          cursor: zoom-in;
        }
      }

      p {
        line-height: 1.8rem;
        margin-bottom: 1rem;

        &.text-center {
          text-align: center;
        }

        &.text-right {
          text-align: right;
        }
      }

      iframe {
        margin-bottom: 1rem;
        background: #000;
      }

      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        margin: 1.5rem 0;
        padding-left: 0;
        line-height: 1.8rem;
        font-weight: 700;
        text-indent: 0;

        &:target {
          padding-top: 4.5rem;
        }
      }

      hr {
        height: 0.1rem;
        background: #e1e4e8;
        border: 0;
      }

      blockquote {

        padding: 0 1rem;
        margin-bottom: 1rem;
        color: #6a737d;
        border-left: 0.25rem solid #dfe2e5;

        p {
          text-indent: 0rem;

          &:first-child {
            margin-top: 0;
          }
          &:last-child {
            margin-bottom: 0;
          }
        }
      }

      ul {
        list-style-type: square;
      }

      ul,
      ol {
        padding-left: 2rem;
        margin-bottom: 1rem;

        > li {
          line-height: 1.8rem;
          padding: .5rem;
          list-style-type: disc;

          > p {
            text-indent: 0;
          }

          > ul {

            li {
              list-style-type: circle;
            }

            &:last-child {
              margin-bottom: 0;
            }
          }
        }
      }

      ul {
        list-style: disc;
      }

      table {
        font-size: .8rem;
        max-width: 100%;
        overflow: auto;
        border: 1px solid $border-color;
        border-collapse: collapse;
        border-spacing: 0;

        thead {
          background: $module-bg;
          text-align: left;
        }

        th, td {
          padding: .8rem .5rem;
          line-height: 1.5rem;
        }

        tr:nth-child(2n) {
          background: $module-bg;
        }

        td {
          min-width: 7.5rem;
        }
      }

      code {
        padding: .2rem .4rem;
        margin: 0;
        font-size: 85%;
        border-radius: $radius;
        background-color: $module-hover-bg;
      }

      pre {
        overflow: auto;
        font-size: 85%;
        line-height: 1.45;
        background-color: rgba(0, 0, 0, .8);
        border-radius: 3px;
        margin-bottom: 1rem;
        word-wrap: normal;

        > .code-lines {
          position: absolute;
          left: 0;
          top: 2.8rem;
          margin: 0;
          padding: 1rem 0;
          width: 2.5rem;
          height: calc(100% - 2.8rem);
          text-align: center;
          background-color: rgba(0, 0, 0, 0.2);

          > .code-line-number {
            padding: 0;
            position: relative;
            list-style-type: none;
            line-height: 1.6rem;
            transition: background-color .05s;

            &:hover {
              &:before {
                display: block;
                opacity: 1;
                visibility: visible;
              }
            }

            &:before {
              content: '';
              height: 1.6rem;
              position: absolute;
              top: 0;
              left: 2.5rem;
              width: 66rem;
              background-color: rgba(154, 154, 154, 0.2);
              display: none;
              visibility: hidden;
              opacity: 0;
            }
          }
        }

        > code {
          margin: 0;
          padding: 1rem;
          float: left;
          width: 100%;
          height: 100%;
          display: block;
          line-height: 1.6rem;
          color: rgba(255, 255, 255, 0.87);
          background-color: transparent;
        }
      }
    }
  }
</style>
