/*
 * UserFollowBtn - Component
 * Handles with follow / unfollow actions to an user
 *
 * Example:
 * m.component(c.UserFollowBtn, {follow_id: 10, following: false})
 */

import m from 'mithril';
import { catarse } from '../api';
import h from '../h';
import models from '../models';

const UserFollowBtn = {
    controller: function(args) {
        const following = m.prop((args.following || false)),
            followVM = catarse.filtersVM({ follow_id: 'eq' }),
            loading = m.prop(false),
            hover = m.prop(false),
            userFollowInsert = models.userFollow.postOptions({
                follow_id: args.follow_id }),
            userFollowDelete = (() => {
                followVM.follow_id(args.follow_id);

                return models.userFollow.deleteOptions(
                      followVM.parameters());
            })(),
            follow = () => {
                const l = catarse.loaderWithToken(userFollowInsert);
                loading(true);

                l.load().then(() => {
                    following(true);
                    loading(false);
                });
            },
            unfollow = () => {
                const l = catarse.loaderWithToken(userFollowDelete);
                loading(true);

                l.load().then(() => {
                    following(false);
                    loading(false);
                });
            };

        return {
            following,
            follow,
            unfollow,
            loading,
            hover
        };
    },
    view: function(ctrl, args) {
        if (h.userSignedIn() && h.getUserID() != args.follow_id) {
            let disableClass = args.disabledClass || '.w-button.btn.btn-medium.btn-terciary.u-margintop-20',
                enabledClass = args.enabledClass || '.w-button.btn.btn-medium.u-margintop-20';
            if (ctrl.loading()) { return h.loader(); }
            if (ctrl.following()) {
                return m(`a${enabledClass}`,
                    {
                        onclick: ctrl.unfollow,
                        onmouseover: () => ctrl.hover(true),
                        onmouseout: () => ctrl.hover(false)
                    },
                         (ctrl.hover() ? 'Stop following' : 'Following'));
            }
            return m(`a${disableClass}`,
                         { onclick: ctrl.follow },
                         'Follow');
        }
        return m('');
    }
};

export default UserFollowBtn;
