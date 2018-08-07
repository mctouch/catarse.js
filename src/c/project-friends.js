import m from 'mithril';
import _ from 'underscore';
import models from '../models';
import { catarse } from '../api';

const projectFriends = {
    controller: function(args) {
        const project = args.project,
            friendsSample = m.prop([]),
            listVM = catarse.paginationVM(models.contributor, 'user_id.desc', {
                Prefer: 'count=exact'
            }),
            filterVM = catarse.filtersVM({
                project_id: 'eq',
                is_follow: 'eq'
            }).project_id(project.project_id).is_follow(true);

        if (!listVM.collection().length) {
            listVM.firstPage(filterVM.parameters()).then(() => {
                friendsSample(_.sample(listVM.collection(), 2));
            });
        }
        return {
            project,
            listVM,
            friendsSample
        };
    },
    view: function(ctrl, args) {
        const project = ctrl.project,
            friendsCount = ctrl.listVM.collection().length,
            wrapper = args.wrapper || '.friend-backed-card';

        return m(wrapper, [
            m('.friend-facepile', [
                _.map(ctrl.friendsSample(), (user) => {
                    const profile_img = _.isEmpty(user.data.profile_img_thumbnail) ? '/assets/catarse_bootstrap/user.jpg' : user.data.profile_img_thumbnail;
                    return m(`img.user-avatar[src='${profile_img}']`);
                })
            ]),
            m('p.fontsize-smallest.friend-namepile.lineheight-tighter', [
                m('span.fontweight-semibold',
                    _.map(ctrl.friendsSample(), user => user.data.name.split(' ')[0]).join(friendsCount > 2 ? ', ' : ' e ')
                ),
                (friendsCount > 2 ? [
                    ' e ',
                    m('span.fontweight-semibold',
                        `more ${friendsCount - ctrl.friendsSample().length}`
                    )
                ] : ''),
                (friendsCount > 1 ?
                    ' supported' : ' supported')
            ])
        ]);
    }
};

export default projectFriends;
