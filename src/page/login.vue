<template>
  <div class="login">
    <div id="particles-background" class="background-canvas"></div>
    <div class="content">
      <div class="title">管理登录</div>
      <el-form :model="form" ref="form">
        <el-form-item
          prop="name"
          :rules="[
            { required: true, message: '用户名', trigger: 'blur' },
            { min: 5, message: '用户名至少6位', trigger: 'blur' }
          ]">
          <el-input placeholder="账号" v-model="form.name" :maxlength="40"></el-input>
        </el-form-item>
        <el-form-item
          prop="password"
          :rules="[
            { required: true, message: '密码', trigger: 'blur' },
            { min: 6, message: '密码至少6位', trigger: 'blur' }
          ]">
          <el-input 
            placeholder="密码" 
            v-model="form.password" 
            :maxlength="40" 
            type="password"
            @keyup.enter.native="submit('form')"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            @click.native="submit('form')" 
            :disabled="logining">{{ logining ? 'login...' : 'Submit'}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>

  import {mapActions, mapState, mapMutations, mapGetters} from "vuex";

export default {
  data() {
    return {
      form: {
        name: '',
        password: ''
      },
      logining: false
    }
  },

  computed: {
    ...mapState({
      isLogin: state => state.isLogin,
    }),
  },


  methods: {
    ...
        mapActions({
          login: "login"
        }),
    submit() {
      this.$refs.form.validate(async (valid) => {
        console.log('valid',valid)
      if (valid) {
        const data = await this.login({ ...this.form })
        if (data.code !== 0) return false
        this.$router.push(this.$route.query.redirect || '/home')
        return true
      } else {
        return false
      }
    })
    }
  }

}
</script>


<style lang="scss">

@import '../assets/scss/variable.scss';

.login {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: $mobile-bg;

  >.background-canvas {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }

  >.content {
    position: absolute;
    width: 300px;
    height: 500px;
    z-index: 999;

    >.title {
      font-size: $font-size-logo * 1.5;
      text-align: center;
    }

    >.el-form {
      margin-top: 16px;

      .el-input__inner {
        height: $xlg-pad;
      }

      .el-button {
        display: block;
        height: $xlg-pad;
        width: 100%;
      }
    }
  }
}
</style>
