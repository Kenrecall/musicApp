import {mapActions, mapGetters} from 'vuex';

// 获取控制歌曲播放模式
import {isPlayMode} from 'common/js/config';
// 设置随机播放列表数据
import {shuffle} from 'common/js/util';
// 对list数据做处理
import {normalizeSongs} from 'common/js/song';
// 歌曲播放接口
import {crackedPlayingAjax} from 'common/js/cracked_ajax';
// 获取歌曲播放MP4地址方法
import {getSongPlayingUrl} from 'api/songPlayingUrl';
import {ERR_OK} from 'api/config';

// 播放器mixin
export const playerMixin = {
    computed: {
        // 切换播放模式
        iconMode () {
            return this.playMode === isPlayMode.sequence ? 'icon-shunxubofang' : this.playMode === isPlayMode.loop ? 'icon-danquxunhuan' : 'icon-suijibofang';
        },
        ...mapGetters('appStore', [
            /**
             * 播放列表
             * @type {Array}
             */
            'playList',
            /**
             * 顺序播放列表
             * @type {Array}
             */
            'sequenceList',
            /**
             * 获取歌曲收藏列表
             * @type {Array}
             */
            'favoriteList',
            /**
             * 当前播放的歌曲信息
             * @type {Object}
             */
            'currentSong',
            /**
             * 控制歌曲播放模式
             * @type {Boolean}
             */
            'playMode'
        ])
    },
    methods: {
        // 切换歌曲播放模式
        changeMode () {
            const playMode = (this.playMode + 1) % 3;
            this.setPlayMode(playMode);
            // 设置播放列表
            let list = null;
            // 根据不同的模式设置不同的播放列表
            if (playMode === isPlayMode.random) {
                list = shuffle(this.sequenceList);
            }
            else {
                list = this.sequenceList;
            }

            // 重新设置当前播放歌曲
            this.resetCurrentIndex(list);
            // 重新设置播放列表
            this.setPlayList(list);
        },
        // 重置当前播放歌曲
        resetCurrentIndex(list) {
            // 获取当前歌曲索引
            let index = list.findIndex((item) => {
                return item.id === this.currentSong.id;
            });

            // 设置当前播放歌曲索引
            this.setCurrentIndex(index);
        },
        // 切换收藏图标
        getFavoriteIcon(currentSong) {
            if (this.isFavorite(currentSong)) {
                return 'favorite';
            }
            return 'favorite_border';
        },
        // 点击收藏歌曲方法
        toggleFavorite (currentSong) {
            // 如果当前收藏歌曲列表中有当前的歌曲就删除该歌词
            if (this.isFavorite(currentSong)) {
                this.setDeleteFavoriteList(currentSong);
            }
            // 否则收藏该歌曲
            else {
                this.setSaveFavoriteList(currentSong);
            }
        },
        // 寻找当前收藏歌曲列表时否有这首歌曲
        isFavorite (currentSong) {
            const index = this.favoriteList.findIndex((item) => {
                return item.id === currentSong.id;
            });
            return index > -1;
        },
        ...mapActions('appStore', {
            /**
             * 控制歌曲播放
             * @type {Boolean}
             */
            setPlaying: 'playing',
            /**
             * 设置播放列表数据
             * @type {Boolean}
             */
            setPlayList: 'playList',
            /**
             * 控制歌曲播放模式
             * @type {Boolean}
             */
            setPlayMode: 'playMode',
            /**
             * 设置当前播放歌曲索引
             * @type {Boolean}
             */
            setCurrentIndex: 'currentIndex',
            /**
             * 收藏当前歌曲
             * @type {Array}
             */
            setSaveFavoriteList: 'saveFavoriteList',
            /**
             * 取消收藏歌曲
             * @type {Array}
             */
            setDeleteFavoriteList: 'deleteFavoriteList'
        })
    }
};

export const createdSongList = {
    methods: {
        /**
         * 歌曲播放接口传入的data参数
         * @type {Object}  list
         */
        _Song_Playing_Mp4_Url(list) {
            let strMediaMid = [];
            let songtype = [];
            list.forEach((data) => {
                if (data) {
                    strMediaMid.push(`${data.strMediaMid}`);
                    songtype.push(0);
                }
            });
            return crackedPlayingAjax(strMediaMid, songtype);
        },
        /**
         * 歌曲播放mp4 地址
         */
        getSongPlayingUrl(data) {
            // 对数据进行转换
            getSongPlayingUrl(this._Song_Playing_Mp4_Url(data)).then((res) => {
                if (res.code === ERR_OK) {
                    this.songPlayingUrl = res.url_mid.data;

                    // 歌曲数据
                    this.songs = normalizeSongs(data, this.songPlayingUrl);

                    // 把歌曲列表存入vuex
                    this.setSongList(this.songs);
                }
            });
        },
        ...mapActions('appShell/appHeader', [
            /*
             * 隐藏主页导航
             * @type {Boolean}
             * */
            'setAppHeader'
        ]),
        ...mapActions('appStore', {
            /**
             * 设置歌曲列表
             * @type {Array}
             */
            setSongList: 'songList'
        })
    }
};
