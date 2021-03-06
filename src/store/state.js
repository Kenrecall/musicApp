import {isPlayMode} from 'common/js/config';
import {loadFavorite} from 'common/js/cache';

/**
 * 状态管理
 */
const state = {
    /**
     * 主页 选择的的歌曲列表
     * @type {Object}
     */
    homeSonglist: {},
    /**
     * 设置遮罩层显示隐藏
     * @type {Boolean}
     */
    maskLayer: false,
    /**
     * 歌曲列表接口一次请求的页数 一次 +15
     * @type {Number}
     */
    songBegin: 0,
    /**
     * 歌曲列表信息
     * @type {Object}
     */
    songListMessage: {},
    /**
     * 歌曲列表
     * @type {Array}
     */
    songList: [],
    /*
    * 新歌速递模块点击内容标题
    * @type {String}
    * */
    newSongListTitle: null,
    /** *****************滚动组件状态****************** **/
    /**
     * 滚动的状态
     * 当 probeType 为 1 的时候，会非实时（屏幕滑动超过一定时间后）派发scroll 事件；
     * 当 probeType 为 2 的时候，会在屏幕滑动的过程中实时的派发 scroll 事件；
     * 当 probeType 为 3 的时候，不仅在屏幕滑动的过程中，而且在 momentum 滚动动画运行过程中实时派发 scroll 事件。
     * @type {Number}
     */
    probeType: 1,
    /**
     * 分发点击事件
     * @type {Boolean}
     */
    click: true,
    /**
     * 外部传入的数据
     * @type {Array}
     */
    data: null,
    /**
     * scroll 要不要监听滚动事件
     * @type {Boolean}
     */
    listenScroll: false,
    /**
     * 是否开启滚动到到底部刷新
     * @type {Boolean}
     */
    pullup: false,
    /**
     * 开始滚动
     * @type {Boolean}
     */
    beforeScroll: false,
    /**
     * 刷新延迟
     * @type {Number}
     */
    refreshDelay: 20,
    /**
     * 是否开启回弹效果
     * @type {Boolean}
     */
    bounce: true,
    /**
     * 回弹时间
     * @type {Number}
     */
    bounceTime: 300,
    /*********************************************/
    /** *****************播放组件状态************************** **/
    /**
     * 歌曲播放模式
     * @type {String}
     */
    playMode: isPlayMode.sequence,
    /*
     * 控制播发器放大缩小
     * @type {Boolean}
     * */
    fullScreen: false,
    /**
     * 控制歌曲播放
     * @type {Boolean}
     */
    playing: false,
    /**
     * 播放列表
     * @type {Array}
     */
    playList: [],
    /**
     * 顺序播放列表
     * @type {Array}
     */
    sequenceList: [],
    /**
     * 当前播放索引
     * @type {Number}
     */
    currentIndex: -1,
    /**
     * 获取当前收藏列表
     * @type {Array}
     */
    favoriteList: loadFavorite()
    /****************************************/
};

export default state;
