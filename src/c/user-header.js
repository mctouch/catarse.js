import m from 'mithril';
import h from '../h';
import userVM from '../vms/user-vm';
import UserFollowBtn from './user-follow-btn';

const userHeader = {
    view: function(ctrl, args) {
        const user = args.user,
            hideDetails = args.hideDetails,
            profileImage = userVM.displayImage(user),
            coverImage = userVM.displayCover(user);

        return !user.id ? m('') : m(`.hero-${hideDetails ? 'small' : 'half'}`, [
            m('.w-container.content-hero-profile',
              m('.w-row.u-text-center',
                m('.w-col.w-col-8.w-col-push-2',
                    [
                      (hideDetails ? '' :
                       m('.u-marginbottom-20',
                         m('.avatar_wrapper',
                           m(`img.thumb.big.u-round[alt='User'][src='${profileImage}']`)
                          )
                        )),
                        m('.fontsize-larger.fontweight-semibold.u-marginbottom-20',
                        userVM.displayName(user)
                       ),
                      (hideDetails ? '' :
                      [m('.w-hidden-small.w-hidden-tiny.u-marginbottom-40.fontsize-base',
                          [
                              `Arrived together at ${h.momentify(user.created_at, 'MMMM [de] YYYY')}`,
                              m('br'),
                             (user.total_contributed_projects === 0 ? 'Has not yet supported projects' :
                              `Supported ${h.pluralize(user.total_contributed_projects, ' project', ' home')}`),
                             (user.total_published_projects > 0 ?
                              ` and already created ${h.pluralize(user.total_published_projects, ' project', ' home')}` : '')
                          ]
                        ),
                          m('.w-row',
                              [
                                  m('.w-col.w-col-4'),
                                  m('.w-col.w-col-4',
                                  m.component(UserFollowBtn, {
                                      disabledClass: '.btn.btn-medium.btn-secondary-dark.w-button',
                                      following: user.following_this_user,
                                      follow_id: user.id })
                                  ),
                                  m('.w-col.w-col-4')
                              ]
)
                      ])
                    ]
                 )
               )
             ),
            m('.hero-profile', { style: `background-image:url('${coverImage}');` })
        ]
                );
    }
};

export default userHeader;
