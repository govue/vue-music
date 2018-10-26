import {mapGetters, mapActions, mapMutations} from 'vuex'
import {playMode} from 'common/js/config' // 引入播放模式常量
import {shuffle} from 'common/js/util' // 引入数组随机打乱函数

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

/**
 * 播放器与播放列表mixin
 * @type {{}}
 */
export const playerMixin = {
  computed: {
    // 计算播放模式图标
    iconMode() {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    ...mapGetters([
      'sequenceList',
      'currentSong',
      'playlist',
      'mode',
      'favoriteList'
    ])
  },
  methods: {
    /**
     * 切换播放模式
     */
    changeMode() {
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode) // 修改vuex里面mode的值
      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList) // 根据vuex中顺序的歌曲列表来生成一个随机列表
        this.resetCurrentIndex(list) // 在打乱后的数组中打开当前播放的歌曲所在的位置
      } else {
        list = this.sequenceList
      }
      this.setPlaylist(list)
    },
    /**
     * 当随机打乱播放列表后，当前播放的歌曲index对应到随机打乱后的list时就不是当前正在播放的歌曲，这里在打乱后的数组中去找到当前播放歌曲所在的位置
     */
    resetCurrentIndex(list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index) // 将当前播放歌的索引重新设置成打乱后list中对应的索引
    },
    /**
     * 获取喜爱歌曲图标
     */
    getFavoriteIcon(song) {
      if (this.isFavorite(song)) {
        return 'icon-favorite'
      }
      return 'icon-not-favorite'
    },
    /**
     * 喜爱、不喜爱歌曲切换
     */
    toggleFavorite(song) {
      if (this.isFavorite(song)) {
        this.deleteFavoriteList(song)
      } else {
        this.saveFavoriteList(song)
      }
    },
    /**
     * 判断song是否在favoriteList里面
     */
    isFavorite(song) {
      const index = this.favoriteList.findIndex((item) => {
        return item.id === song.id
      })
      return index > -1
    },
    ...mapMutations({
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlaylist: 'SET_PLAYLIST'
    }),
    ...mapActions([
      'saveFavoriteList',
      'deleteFavoriteList'
    ])
  }
}

/**
 * 搜索相关mixin
 * @type {{}}
 */
export const searchMixin = {
  data() {
    return {
      query: '',
      refreshDelay: 100
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    /**
     * 点击hotKey标签时
     * @param query
     */
    addQuery(query) {
      this.$refs.searchBox.setQuery(query)
    },
    /**
     * 监听select事件，保存搜索历史
     */
    saveSearch() {
      this.saveSearchHistory(this.query)
    },
    /**
     * 监听到有scroll滚动事件，则收起输入法键盘（移动端）
     */
    blurInput() {
      this.$refs.searchBox.blur()
    },
    /**
     * 当搜索组件search-box中的query值有变化时，从子组件派发query事件，这里监听到执行，并将变化后的query值传给suggest组件中去查询，结果显示在suggest组件中
     * @param query
     */
    onQueryChange(query) {
      this.query = query
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory'
    ])
  }
}
