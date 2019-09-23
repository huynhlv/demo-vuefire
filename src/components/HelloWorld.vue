<template>
  <div class="hello">
    <div class="container">
      <h3>Movies to watch</h3>
      <div class="row">
        <div class="col-lg-6 col-lg-offset-3">
          <div class="row">
            <input
              placeholder="Name movie"
              type="text"
              v-model="movie"
              class="form-control"
            />
          </div>
          <div class="row py-3p p-relative">
            <button class="col-lg-2 btn btn-default btn-sm" @click="onPickFile">Choose Image</button>
            <div class="col-lg-12 show-img">
              <img v-if="image" :src="image" height="100"/>
            </div>
          </div>
          <button class="btn btn-primary btn-sm" style="margin-top: 105px" @click="addMovie">Save</button>
          <input type="file" @change="onFilePicked($event, true)" style="display: none;" ref="fileInput" accept="image/*">
          <ul>
            <input type="file" @change="onFilePicked($event, false)" style="display: none;" ref="fileInputEdit" accept="image/*">
            <li v-for="(movie,key) in fireData" :key="key">
              <div>
                <h2>{{movie.name}}</h2>
                <img :src="movie.image" height="100" class="img-center"/>
                <div v-if="editFormMode.includes(key)">
                  <button class="col-lg-3 btn btn-default btn-sm my-3p" @click="onPickFileEdit">Choose Image</button>
                  <input
                    type="text"
                    v-model="editingMovie[key]"
                    @keyup.enter="editMovie(key)"
                    class="form-control"
                  />
                </div>
                <button class="btn btn-xs btn-primary" @click="editFormMode.push(key);">Edit</button>
                <button class="btn btn-xs btn-danger" @click="deleteMovie(key);">Delete</button>
                <br />
                <br />
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  data() {
    return {
      movie: null,
      fileImage: null,
      image: null,
      imgData: null,
      fireData: null,
      editingMovie: [],
      editingImageUrl: [],
      editFormMode: []
    };
  },
  methods: {
    onPickFile() {
      this.$refs.fileInput.click();
    },
    onPickFileEdit() {
      this.$refs.fileInputEdit.click();
    },
    onFilePicked(event, newImage) {
      const files = event.target.files
      this.imgData = files[0]
      if(newImage) this.image = URL.createObjectURL(files[0])
      let filename = files[0].name
      if(filename.lastIndexOf('.') <= 0) {
        return alert('Please add a vaild file!')
      }
      const fileReader = new FileReader()
      fileReader.addEventListener('load', () => {
        this.fileImage = fileReader.result
      })
      fileReader.readAsDataURL(files[0])
    },
    addMovie() {
      this.$loading(true)
      let key
      let imageUrl
      firebase
        .database()
        .ref("movies")
        .push({
          name: this.movie
        })
        .then((data => {
          key = data.key
          return key
        }))
        .then(key => {
          const filename = this.imgData.name
          const ext = filename.slice(filename.lastIndexOf('.'))
          return firebase.storage().ref('movies/' + key + ext).put(this.imgData)
        })
        .then(fileData => {
          fileData.ref.getDownloadURL().then(imageUrl => {
            return firebase.database().ref('movies').child(key).update({image: imageUrl})
          })
        })
        .then(data => {
          this.movie = null
          this.image = null
          this.imgData = null
          this.$loading(false)
        })
    },

    editMovie(key) {
      this.$loading(true)
      if(!this.imgData) {
        return firebase.database().ref("movies").child(key).update({
          name: this.editingMovie[key]
        }).then(data => {
          this.editingMovie[key] = null
          this.editFormMode = []
          this.$loading(false)
        })
      }else{
        let imageUrl
        const filename = this.imgData.name
        const ext = filename.slice(filename.lastIndexOf('.'))
        firebase.storage().ref('/movies/' + key + ext).put(this.imgData)
        .then(fileData => {
          fileData.ref.getDownloadURL().then(imageUrl => {
            return firebase.database().ref("movies").child(key).update({
              name: this.editingMovie[key],
              image: imageUrl
            })
          })
          .then(data => {
            this.editingMovie[key] = null
            this.editFormMode = []
            this.imgData = null
            this.$loading(false)
          })
        })
      }
    },

    deleteMovie(key) {
      firebase
        .database()
        .ref("movies/" + key)
        .remove();
    },

    fetchFirebaseData() {
      firebase
        .database()
        .ref("movies")
        .on("value", snapshot => {
          this.fireData = snapshot.val();
        });
    }
  },

  created() {
    this.fetchFirebaseData();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
