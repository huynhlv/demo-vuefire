<template>
  <div id="app">

    <div class="navbar">
      <ul class="nav navbar-nav">
        <li v-if="!authUser">
          <router-link to="/sign-in">SignIn</router-link>
        </li>

        <li v-if="!authUser">
          <router-link to="/sign-up">SignUp</router-link>
        </li>

        <li v-if="authUser">
          <a @click="logout"> Logout</a>

       </li>
      </ul>


    </div>

    <img src="https://images.g2crowd.com/uploads/product/image/large_detail/large_detail_0016c93c710cf35990b999cba3a59bae/firebase.png" style="width: 6%;">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  data(){
    return {
      authUser:null
    }
  },
  methods:{
    setAuthUser(){
      this.authUser=firebase.auth().currentUser;
    },
    logout(){
      firebase.auth().signOut()
        .then(()=>{
          this.$router.replace('/sign-in')
        })
        .catch((e)=>{
          alert(e.message)
        })
    }
  },
  created(){
    this.setAuthUser();
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.img-center {
  display: block;
  margin: auto;
  padding: 5px;
}
.py-3p {
  padding: 3px 0;
}
.my-3p {
  margin: 3px 0;
}
.show-img {
  position: absolute;
  z-index: -1;
}
.p-relative {
  position: relative;
}
</style>
