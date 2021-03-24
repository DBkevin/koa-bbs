exports = module.exports = {
    async index(ctx, next) {
        $topicsViewConfig = {
            title: '帖子列表',
            pagename: '../topics/index',
            routerName: 'topics-index',
        }
        await ctx.render('layouts/index', $topicsViewConfig);
    },
}