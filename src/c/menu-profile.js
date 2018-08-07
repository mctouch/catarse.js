import m from 'mithril';
import _ from 'underscore';
import userVM from '../vms/user-vm';
import h from '../h';
import models from '../models';
import { catarse } from '../api';

const menuProfile = {
    controller: function(args) {
        const contributedProjects = m.prop(),
            latestProjects = m.prop([]),
            userDetails = m.prop({}),
            user_id = args.user.user_id,
            userBalance = m.prop(0),
            userIdVM = catarse.filtersVM({ user_id: 'eq' });

        const userName = () => {
            const name = userVM.displayName(userDetails());
            if (name && !_.isEmpty(name)) {
                return _.first(name.split(' '));
            }

            return '';
        };

        userVM.fetchUser(user_id, true, userDetails);

        userIdVM.user_id(user_id);
        models.balance.getRowWithToken(userIdVM.parameters()).then((result) => {
            const data = _.first(result) || { amount: 0, user_id };
            userBalance(data.amount);
        });

        return {
            contributedProjects,
            latestProjects,
            userDetails,
            userName,
            toggleMenu: h.toggleProp(false, true),
            userBalance
        };
    },
    view: function(ctrl, args) {
        const user = ctrl.userDetails();

        return m('.w-dropdown.user-profile',
            [
                m('.w-dropdown-toggle.dropdown-toggle.w-clearfix[id=\'user-menu\']',
                    {
                        onclick: ctrl.toggleMenu.toggle
                    },
                    [
                        m('.user-name-menu', [
                            m('.fontsize-smaller.lineheight-tightest.text-align-right', ctrl.userName()),
                            (ctrl.userBalance() > 0 ? m('.fontsize-smallest.fontweight-semibold.text-success', `R$ ${h.formatNumber(ctrl.userBalance(), 2, 3)}`) : '')

                        ]),
                        m(`img.user-avatar[alt='Thumbnail - ${user.name}'][height='40'][src='${h.useAvatarOrDefault(user.profile_img_thumbnail)}'][width='40']`)
                    ]
                ),
                ctrl.toggleMenu() ? m('nav.w-dropdown-list.dropdown-list.user-menu.w--open[id=\'user-menu-dropdown\']', { style: 'display:block;' },
                    [
                        m('.w-row',
                            [
                                m('.w-col.w-col-12',
                                    [
                                        m('.fontweight-semibold.fontsize-smaller.u-marginbottom-10',
                                            'My history'
                                        ),
                                        m('ul.w-list-unstyled.u-marginbottom-20',
                                            [
                                                m('li.lineheight-looser',
                                                  m(`a.alt-link.fontsize-smaller[href='/pt/users/${user.id}/edit#balance']`,
                                                    m('span', [
                                                        'Balance ',
                                                        (ctrl.userBalance() > 0 ? m('span.fontcolor-secondary',
                                                          `R$ ${h.formatNumber(ctrl.userBalance(), 2, 3)}`) : ''),
                                                    ])
                                                   )
                                                 ),
                                                m('li.lineheight-looser',
                                                    m(`a.alt-link.fontsize-smaller[href='/pt/users/${user.id}/edit#contributions']`,
                                                        'Support history'
                                                    )
                                                ),
                                                m('li.lineheight-looser',
                                                  m(`a.alt-link.fontsize-smaller[href='/pt/users/${user.id}/edit#projects']`,
                                                    'Projects Created'
                                                   )
                                                 ),
                                                m('li.w-hidden-main.w-hidden-medium.lineheight-looser',
                                                    m(`a.alt-link.fontsize-smaller[href='/pt/users/${user.id}/edit#projects']`,
                                                        'Projects Created'
                                                    )
                                                 )
                                            ]
                                        ),
                                        m('.fontweight-semibold.fontsize-smaller.u-marginbottom-10',
                                            'settings'
                                        ),
                                        m('ul.w-list-unstyled.u-marginbottom-20',
                                            [
                                                m('li.lineheight-looser',
                                                  m('a.alt-link.fontsize-smaller[href=\'/connect-facebook/\']',
                                                    'Find friends'
                                                   ),
                                                 ),
                                                m('li.lineheight-looser',
                                                    m(`a.alt-link.fontsize-smaller[href='/pt/users/${user.id}/edit#about_me']`,
                                                        'Public profile'
                                                    )
                                                ),
                                                m('li.lineheight-looser',
                                                    m(`a.alt-link.fontsize-smaller[href='/pt/users/${user.id}/edit#notifications']`,
                                                        'Notifications'
                                                    )
                                                ),
                                                m('li.lineheight-looser',
                                                    m(`a.alt-link.fontsize-smaller[href='/pt/users/${user.id}/edit#settings']`,
                                                        'Registration data'
                                                    )
                                                )
                                            ]
                                        ),
                                        m('.divider.u-marginbottom-20'),
                                        args.user.is_admin_role ? m('.fontweight-semibold.fontsize-smaller.u-marginbottom-10',
                                            'Admin'
                                        ) : '',
                                        args.user.is_admin_role ? m('ul.w-list-unstyled.u-marginbottom-20',
                                            [
                                                m('li.lineheight-looser',
                                                    m('a.alt-link.fontsize-smaller[href=\'/pt/new-admin#/users\']',
                                                        'Users'
                                                    )
                                                ),
                                                m('li.lineheight-looser',
                                                    m('a.alt-link.fontsize-smaller[href=\'/pt/new-admin\']',
                                                        'Support'
                                                    )
                                                ),
                                                m('li.lineheight-looser',
                                                  m('a.alt-link.fontsize-smaller[href=\'/pt/new-admin#/balance-transfers\']',
                                                    'Withdrawals'
                                                   )
                                                 ),
                                                m('li.lineheight-looser',
                                                    m('a.alt-link.fontsize-smaller[href=\'/pt/admin/financials\']',
                                                        'Financial Relation'
                                                    )
                                                ),
                                                m('li.lineheight-looser',
                                                    m('a.alt-link.fontsize-smaller[href=\'/pt/new-admin#/projects\']',
                                                        'Admin projects'
                                                    )
                                                ),
                                                m('li.lineheight-looser',
                                                  m('a.alt-link.fontsize-smaller[href=\'/pt/new-admin#/subscriptions\']',
                                                    'Admin signatures'
                                                   )
                                                 ),
                                                m('li.lineheight-looser',
                                                  m('a.alt-link.fontsize-smaller[href=\'/pt/new-admin#/notifications\']',
                                                    'Admin notifications'
                                                   )
                                                ),
                                                m('li.lineheight-looser',
                                                    m('a.alt-link.fontsize-smaller[href=\'/pt/dbhero\']',
                                                        'Dataclips'
                                                    )
                                                )
                                            ]
                                        ) : '',
                                        m('.fontsize-mini', 'Your registration email is: '),
                                        m('.fontsize-smallest.u-marginbottom-20', [
                                            m('span.fontweight-semibold', `${user.email} `),
                                            m(`a.alt-link[href='/pt/users/${user.id}/edit#about_me']`, 'Change e-mail')
                                        ]),
                                        m('.divider.u-marginbottom-20'),
                                        m('a.alt-link[href=\'/pt/logout\']',
                                            'Get out'
                                        )
                                    ]
                                ),
                                // m(`.w-col.w-col-4.w-hidden-small.w-hidden-tiny`,
                                //    [
                                //        m(`.fontweight-semibold.fontsize-smaller.u-marginbottom-10`,
                                //            `Support projects`
                                //        ),
                                //        m(`ul.w-list-unstyled.u-marginbottom-20`, ctrl.contributedProjects() ?
                                //            _.isEmpty(ctrl.contributedProjects) ? 'No project.' :
                                //            m.component(quickProjectList, {
                                //                projects: m.prop(_.map(ctrl.contributedProjects(), (contribution) => {
                                //                    return {
                                //                        project_id: contribution.project_id,
                                //                        project_user_id: contribution.project_user_id,
                                //                        thumb_image: contribution.project_img,
                                //                        video_cover_image: contribution.project_img,
                                //                        permalink: contribution.permalink,
                                //                        name: contribution.project_name
                                //                    };
                                //                })),
                                //                loadMoreHref: '/pt/users/${user.id}/edit#contributions',
                                //                ref: 'user_menu_my_contributions'
                                //            }) : 'Loading...'
                                //        )
                                //    ]
                                // ),
                                // m(`.w-col.w-col-4.w-hidden-small.w-hidden-tiny`,
                                //    [
                                //        m(`.fontweight-semibold.fontsize-smaller.u-marginbottom-10`,
                                //            `Projects Created`
                                //        ),
                                //        m(`ul.w-list-unstyled.u-marginbottom-20`, ctrl.latestProjects() ?
                                //            _.isEmpty(ctrl.latestProjects) ? 'No project.' :
                                //            m.component(quickProjectList, {
                                //                projects: ctrl.latestProjects,
                                //                loadMoreHref: '/pt/users/${user.id}/edit#contributions',
                                //                ref: 'user_menu_my_projects'
                                //            }) : 'Loading...'
                                //        )
                                //    ]
                                // )
                            ]
                        )
                    ]
                ) : ''
            ]
        );
    }
};

export default menuProfile;
