/**
 * @file router
 * @author jianzhongmin(282126990@qq.com)
 */

import Vue from 'vue';
import Router from 'vue-router';
import * as types from './store/mutation-types';
// 歌曲列表模块
// import SongList from '@/components/song-list/song-List.vue';
// 数字专辑音乐列表
// import DigitalAlbumMusicList from '@/components/digital-album-music-list/digital-album-music-list.vue';
// 新歌速递
// import NewSongSpeed from '@/components/new-song-speed/new-song-speed.vue';


// 定义切割点，异步加载路由组件
let Home = () => import('@/pages/Home/Home.vue');
// 歌曲列表模块
let SongList = () => import('@/components/song-list/song-List.vue');
// 热门推荐模块
let HotRecommend = () => import('@/components/hot-recommend/hot-recommend.vue');
// 发现模块
let Find = () => import('@/pages/Find/Find.vue');
// 我的模块
let My = () => import('@/pages/My/My.vue');
// 没有找到页面时显示的模块
let NotFound = () => import('@/pages/NotFound.vue');
// 数字专辑音乐列表
let DigitalAlbumMusicList = () => import('@/components/digital-album-music-list/digital-album-music-list.vue');
// 新歌速递模块
let NewSongSpeed = () => import('@/components/new-song-speed/new-song-speed.vue');

Vue.use(Router);

export function createRouter () {
    let router = new Router({
        // history 模式，需要服务器后端配合做路由代理，将所有的前端路由同步代理到 /
        mode: 'history',
        routes: [
            {
                path: '/',
                redirect: '/home'
            },
            {
                path: '/home',
                name: 'home',
                component: Home
            },
            // 热门推荐模块   /热门推荐
            {
                path: '/hotRecommend',
                name: 'hotRecommend',
                component: HotRecommend
            },
            // 新歌速递模块
            {
                path: '/newSongSpeed',
                name: 'newSongSpeed',
                component: NewSongSpeed
            },
            {
                path: '/digitalAlbumMusicList',
                name: 'digitalAlbumMusicList',
                component: DigitalAlbumMusicList,
                alias: '/newSongSpeed/digitalAlbumMusicList/:id'
            },
            // 歌曲列表
            {
                path: '/songlist/:id',
                name: 'SongList',
                component: SongList,
                alias: '/home/:id'
            },
            {
                path: '/find',
                name: 'find',
                component: Find
            },
            {
                path: '/my',
                name: 'my',
                component: My
            },
            {
                path: '*',
                name: 'notFound',
                component: NotFound
            }
        ]
    });

    /**
     * 切换动画名称
     *
     * @type {string}
     * @const
     */
    const SLIDE_LEFT = 'slide-left';

    /**
     * 切换动画名称
     *
     * @type {string}
     * @const
     */
    const SLIDE_RIGHT = 'slide-right';

    router.beforeEach((to, from, next) => {
        if (router.app.$store) {
            // 如果不需要切换动画，直接返回
            if (router.app.$store.state.appShell.needPageTransition) {

                // 判断当前是前进还是后退，添加不同的动画效果
                let pageTransitionName = isForward(to, from) ? SLIDE_LEFT : SLIDE_RIGHT;

                router.app.$store.commit(`appShell/${types.SET_PAGE_TRANSITION_NAME}`, {pageTransitionName});

            }
        }

        next();
    });

    return router;
}

/**
 * to 如果在这个列表中，始终采用从左到右的滑动效果，首页比较适合用这种方式
 *
 * @type {Array.<string>}
 * @const
 */
const ALWAYS_BACK_PAGE = ['my', 'HotRecommend'];


/**
 * to 如果在这个列表中，始终采用从右到左的滑动效果
 *
 * @type {Array.<string>}
 * @const
 */
const ALWAYS_FORWARD_PAGE = ['find', 'SongList'];

/**
 * 历史记录，记录访问过的页面的 fullPath
 *
 * @type {Array.<string>}
 * @const
 */
const HISTORY_STACK = ['/home', '/home/hotRecommend'];

/**
 * 判断当前是否是前进，true 表示是前进，否则是回退
 *
 * @param {Object} to 目标 route
 * @param {Object} from 源 route
 * @return {boolean} 是否表示返回
 */
function isForward (to, from) {

    // to 如果在这个列表中，始终认为是后退
    if (to.name && ALWAYS_BACK_PAGE.indexOf(to.name) !== -1) {

        // 清空历史
        HISTORY_STACK.length = 0;
        return false;
    }
    if (from.name && ALWAYS_BACK_PAGE.indexOf(from.name) !== -1) {

        // 如果是从 ALWAYS_BACK_PAGE 过来的，那么永远都是前进
        HISTORY_STACK.push(to.fullPath);
        return true;
    }

    if (to.name && ALWAYS_FORWARD_PAGE.indexOf(to.name) !== -1) {

        // to 如果在这个列表中，始终认为是前进
        HISTORY_STACK.push(to.fullPath);
        return true;
    }

    // 根据 fullPath 判断当前页面是否访问过，如果访问过，则属于返回
    let index = HISTORY_STACK.indexOf(to.fullPath);
    if (index !== -1) {
        HISTORY_STACK.length = index + 1;
        return false;
    }

    // 将 to.fullPath 加到栈顶
    HISTORY_STACK.push(to.fullPath);
    return true;
}
