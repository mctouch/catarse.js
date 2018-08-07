import m from 'mithril';
import _ from 'underscore';
import moment from 'moment';
import h from '../h';

const I18nScope = _.partial(h.i18nScope, 'projects.dashboard_posts');

const postsPreview = {
    controller: function(args) {
        const togglePreview = () => {
                h.scrollTop();
                args.showPreview(false);
            },
            sendNotification = (e) => {
                e.preventDefault();

                const notificationData = {
                    title: args.title(),
                    comment_html: args.comment_html(),
                    reward_id: args.reward_id >= 1 ? args.reward_id : null,
                    recipients: args.reward_id >= 1 ? 'reward' : args.reward_id == '-1' ? 'public' : 'backers'
                };

                return m.request({
                    method: 'POST',
                    url: `/projects/${args.project_id}/posts.json`,
                    data: {
                        project_post: notificationData,
                        project: args.project_id
                    },
                    config: h.setCsrfToken
                }).then(() => {
                    args.showSuccess(true);
                    args.comment_html('');
                    args.title('');
                    togglePreview();
                    m.redraw();
                }).catch((err) => {
                    args.errors('Error sending message.'),
                    args.showError(true);
                    m.redraw();
                });
            };
        return {
            sendNotification,
            togglePreview
        };
    },
    view: function(ctrl, args) {
        const comment_html = args.comment_html(),
            title = args.title(),
            recipientsText = args.reward_id > 1 ?
            m('.fontsize-small.u-marginbottom-30', [
                'The above news will be sent by email to ',
                m('span.fontweight-semibold',
                    args.rewardText
                ),
                ' and will stay ',
                m('span.fontweight-semibold',
                window.I18n.t(`backers_only_${args.mode}`, I18nScope())
                )
            ]) :
            args.reward_id === '-1' ?
            m('.fontsize-small.u-marginbottom-30', [
                'The novelty above will be  ',
                m('span.fontweight-semibold',
                    'sent by email to everyone'
                ),
                window.I18n.t(`all_backers_${args.mode}`, I18nScope()),
                m('span.fontweight-semibold',
                    'publicly visible '
                ),
                'on the platform.'
            ]) :
            m('.fontsize-small.u-marginbottom-30', [
                m('span', ' The novelty above will be '),
                m('span.fontweight-semibold', window.I18n.t(`email_backers_${args.mode}`, I18nScope())),
                m('span', ' and will stay '),
                m('span.fontweight-semibold', 'visible only to those on the platform.')
            ]);

        return m('div', [
            m('.dashboard-header.u-text-center',
                m('.w-container',
                    m('.w-row', [
                        m('.w-col.w-col-3'),
                        m('.w-col.w-col-6',
                            m('.fontsize-larger.fontweight-semibold.lineheight-tight',
                                'Review your news before submitting!'
                            )
                        ),
                        m('.w-col.w-col-3')
                    ])
                )
            ),
            m('.section', [
                m('.w-container',
                    m('.card.u-marginbottom-60.u-radius.w-row', [
                        m('.w-col.w-col-1'),
                        m('.u-marginbottom-30.u-margintop-30.w-col.w-col-10.w-hidden-small.w-hidden-tiny', [
                            m('.fontcolor-secondary.fontsize-small.u-text-center',
                                moment().format('DD/MM/YYYY')
                            ),
                            m('.fontsize-larger.fontweight-semibold.u-marginbottom-30.u-text-center',
                                title
                            ),
                            m('.fontsize-base', m.trust(comment_html))
                        ]),
                        m('.w-col.w-col-1')
                    ])
                ),
                m('.w-row', [
                    m('.w-col.w-col-3'),
                    m('.w-col.w-col-6',
                        recipientsText
                    ),
                    m('.w-col.w-col-3')
                ]),
                m('.u-marginbottom-20.w-row', [
                    m('.w-col.w-col-3'),
                    m('.w-sub-col.w-col.w-col-4',
                        m('button.btn.btn-large', {
                            onclick: ctrl.sendNotification
                        }, [
                            m('span.fa.fa-paper-plane',
                                ''
                            ),
                            ' ',
                            m.trust('&nbsp;'),
                            'Submit'
                        ])
                    ),
                    m('.w-col.w-col-2',
                        m('button.btn.btn-large.btn-tertiary', {
                            onclick: ctrl.togglePreview
                        },
                            'Edit'
                        )
                    ),
                    m('.w-col.w-col-3')
                ])
            ])
        ]);
    }
};

export default postsPreview;
