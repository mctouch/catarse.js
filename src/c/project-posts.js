import m from 'mithril';
import {
    catarse
} from '../api';
import _ from 'underscore';
import models from '../models';
import h from '../h';

const I18nScope = _.partial(h.i18nScope, 'projects.posts');

const projectPosts = {
    controller: function(args) {
        const listVM = catarse.paginationVM(models.projectPostDetail),
            filterVM = catarse.filtersVM({
                project_id: 'eq',
                id: 'eq'
            });
        const scrollTo = (el, isInit) => {
            if (!isInit) {
                h.animateScrollTo(el);
            }
        };

        filterVM.project_id(args.project().project_id);

        if (_.isNumber(args.post_id)) {
            filterVM.id(args.post_id);
        }

        if (!listVM.collection().length) {
            listVM.firstPage(filterVM.parameters());
        }

        return {
            listVM,
            filterVM,
            scrollTo
        };
    },
    view: function(ctrl, args) {
        const list = ctrl.listVM,
            project = args.project() || {};

        return m('#posts.project-posts.w-section', {
            config: ctrl.scrollTo
        }, [
            m('.w-container.u-margintop-20', [
                (project.is_owner_or_admin ? [
                    (!list.isLoading()) ?
                    (_.isEmpty(list.collection()) ? m('.w-hidden-small.w-hidden-tiny', [
                        m('.fontsize-base.u-marginbottom-30.u-margintop-20', 'All news published in Trend Notion is sent directly to the email of those who have already supported your project and is also available for viewing on the site. You can choose to leave it public, or visible only to your supporters here on this tab.')
                    ]) : '') : '',
                    m('.w-row.u-marginbottom-20', [
                        m('.w-col.w-col-4.w-col-push-4', [
                            m(`a.btn.btn-edit.btn-small[href='/pt/projects/${project.project_id}/posts']`, 'Writing novelty')
                        ])
                    ])
                ] : ''), (_.map(list.collection(), post => m('.w-row', [
                    _.isEmpty(post.comment_html) ? [
                        m('.fontsize-small.fontcolor-secondary.u-text-center', h.momentify(post.created_at)),
                        m('p.fontweight-semibold.fontsize-larger.u-text-center.u-marginbottom-30', [
                            m(`a.link-hidden[href="/projects/${post.project_id}/posts/${post.id}#posts"]`, post.title)
                        ]),
                        m('.card.card-message.u-radius.card-big.u-text-center.u-marginbottom-60', [
                            m('.fa.fa-lock.fa-3x.fontcolor-secondary',
                                ''
                            ),
                            project.mode === 'sub' ? [
                                m('.fontsize-base.fontweight-semibold.u-marginbottom-20',
                                    `Exclusive post for subscribers${post.reward_id ? ` of the reward of R$${post.minimum_value}` : ''}`
                                ),
                                m(`a.btn.btn-medium.btn-inline.w-button[href="/projects/${post.project_id}/subscriptions/start${post.reward_id ? `?reward_id=${post.reward_id}` : ''}"]`,
                                    'Access this post'
                                )
                            ] : [
                                m('.fontsize-base.fontweight-semibold.u-marginbottom-20',
                                    `Exclusive post for supporters${post.reward_id ? ` of the reward of R $${post.minimum_value}` : ''}`
                                ),
                                m(`a.btn.btn-medium.btn-inline.w-button[href="/projects/${post.project_id}/contributions/new${post.reward_id ? `?reward_id=${post.reward_id}` : ''}"]`,
                                    'Access this post'
                                )
                            ]

                        ])
                    ] : [m('.w-col.w-col-1'),
                        m('.w-col.w-col-10', [
                            m('.post', [
                                m('.u-marginbottom-60 .w-clearfix', [
                                    m('.fontsize-small.fontcolor-secondary.u-text-center', h.momentify(post.created_at)),
                                    m('p.fontweight-semibold.fontsize-larger.u-text-center.u-marginbottom-30', [
                                        m(`a.link-hidden[href="/projects/${post.project_id}/posts/${post.id}#posts"]`, post.title)
                                    ]),
                                    (m('.fontsize-base', m.trust(post.comment_html)))
                                ]),
                                m('.divider.u-marginbottom-60')
                            ])
                        ]),
                        m('.w-col.w-col-1')
                    ]
                ]))),
                m('.w-row', [
                    (!_.isUndefined(args.post_id) ? '' :
                        (!list.isLoading() ?
                            (list.collection().length === 0 && args.projectContributions().length === 0) ?
                            !project.is_owner_or_admin ? m('.w-col.w-col-10.w-col-push-1',
                                m('p.fontsize-base',
                                    m.trust(
                                        window.I18n.t('empty',
                                            I18nScope({
                                                project_user_name: args.userDetails().name,
                                                project_id: project.project_id
                                            })
                                        )
                                    )
                                )
                            ) : '' :
                            m('.w-col.w-col-2.w-col-push-5',
                                (list.isLastPage() ?
                                    list.collection().length === 0 ? 'No news.' : '' :
                                    m('button#load-more.btn.btn-medium.btn-terciary', {
                                        onclick: list.nextPage
                                    }, 'Load more'))
                            ) :
                            m('.w-col.w-col-2.w-col-push-5', h.loader())
                        ))

                ])
            ]),
        ]);
    }
};

export default projectPosts;
