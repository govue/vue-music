import {mapGetters} from 'vuex'

export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playlist'
    ])
  },
  watch: {
    playlist(newVal) {
      this.handlePlaylist(newVal)
    }
  },
  mounted() {
    this.handlePlaylist(this.playlist)
  },
  // 当keep-alive组件切过来的时候会执行
  activated() {
    this.handlePlaylist(this.playlist)
  },
  methods: {
    handlePlaylist() {
      throw new Error('component must implement handlePlaylist method')
    }
  }
}
