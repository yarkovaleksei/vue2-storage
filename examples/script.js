new window.Vue({
  data () {
    return {
      data: [],
      form: {
        key: '',
        value: '',
        ttl: 60
      }
    }
  },
  methods: {
    addItem () {
      const index = this.data.findIndex(el => el.key === this.form.key)
      if (index === -1) {
        this.data.push(this.form)
      } else {
        this.$set(this.data, index, {
          key: this.form.key,
          value: this.form.value
        })
      }
      this.$storage.set(
        this.form.key,
        this.form.value,
        {
          ttl: Number(this.form.ttl) * 1000
        }
      )
      this.form = {
        key: '',
        value: '',
        ttl: 60
      }
    },
    getFromStorage (key) {
      const value = this.$storage.get(key)
      const index = this.data.findIndex(el => el.key === key)
      console.log(index, value)
      if (value) {
        if (index > -1) {
          this.$set(this.data, index, { key, value })
        }
      } else {
        this.data.splice(index, 1)
      }
    },
    removeFromStorage (key) {
      this.$storage.remove(key)
      this.getFromStorage(key)
    },
    clearStorage () {
      this.$storage.clear()
      this.data = []
    }
  }
}).$mount('#app')
