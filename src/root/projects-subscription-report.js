import m from 'mithril';
import _ from 'underscore';
import {
    catarse,
    commonPayment
} from '../api';
import models from '../models';
import h from '../h';
import loadMoreBtn from '../c/load-more-btn';
import filterMain from '../c/filter-main';
import FilterDropdown from '../c/filter-dropdown';
import projectDashboardMenu from '../c/project-dashboard-menu';
import dashboardSubscriptionCard from '../c/dashboard-subscription-card';
import projectsSubscriptionReportVM from '../vms/projects-subscription-report-vm';
import projectsContributionReportVM from '../vms/projects-contribution-report-vm';

const statusCustomFilter = {
    view: () => m('span', [
        'Subscription Status ',
        m('a.fontsize-smallest.tooltip-wrapper.fa.fa-question-circle.fontcolor-secondary', {
            href: 'https://suporte.catarse.me/hc/pt-br/articles/115005632746-Catarse-Assinaturas-FAQ-Realizadores#status',
            target: '_blank'
        })
    ])
};

const projectSubscriptionReport = {
    controller: function(args) {
        const filterVM = projectsSubscriptionReportVM,
            catarseVM = projectsContributionReportVM,
            error = m.prop(false),
            loader = m.prop(true),
            rewards = m.prop([]),
            subscriptions = commonPayment.paginationVM(models.userSubscription, 'created_at.desc', {
                Prefer: 'count=exact'
            }),
            submit = () => {
                if (filterVM.reward_external_id() === 'null') {
                    subscriptions.firstPage(filterVM.withNullParameters()).then(null);
                } else {
                    subscriptions.firstPage(filterVM.parameters()).then(null);
                }

                return false;
            },
            filterBuilder = [{
                component: filterMain,
                label: 'text_filter',
                data: {
                    label: 'Search',
                    vm: filterVM.search_index,
                    onchange: submit,
                    wrapper_class: '.w-sub-col.w-col.w-col-5.u-margintop-20',
                    inputWrapperClass: '.w-input.text-field.positive',
                    btnClass: '.btn.btn-medium.u-marginbottom-10',
                    placeholder: 'Search by name or email of subscriber ...'
                }
            },
            {
                label: 'reward_filter',
                component: FilterDropdown,
                data: {
                    label: 'Reward',
                    onchange: submit,
                    name: 'reward_external_id',
                    vm: filterVM.reward_external_id,
                    wrapper_class: '.w-sub-col.w-col.w-col-2',
                    options: []
                }
            },
            {
                label: 'status_filter',
                component: FilterDropdown,
                data: {
                    custom_label: [
                        statusCustomFilter,
                        null
                    ],
                    onchange: submit,
                    name: 'status',
                    vm: filterVM.status,
                    wrapper_class: '.w-sub-col.w-col.w-col-3',
                    options: [{
                        value: '',
                        option: 'Everybody'
                    },
                    {
                        value: 'active',
                        option: 'Active'
                    },
                    {
                        value: 'started',
                        option: 'Started'
                    },
                    {
                        value: 'canceling',
                        option: 'Cancellation requested'
                    },
                    {
                        value: 'canceled',
                        option: 'Canceled'
                    },
                    {
                        value: 'inactive',
                        option: 'Inactive'
                    }
                    ]
                }
            },
            {
                label: 'payment_filter',
                component: FilterDropdown,
                data: {
                    label: 'Means of payment',
                    onchange: submit,
                    name: 'payment_method',
                    vm: filterVM.payment_method,
                    wrapper_class: '.w-sub-col.w-col.w-col-2',
                    options: [{
                        value: '',
                        option: 'Everybody'
                    },
                    {
                        value: 'credit_card',
                        option: 'Credit card'
                    },
                    {
                        value: 'ticket',
                        option: 'Ticket'
                    }
                    ]
                }
            }

            ],
            handleError = () => {
                error(true);
                loader(false);
                m.redraw();
            },
            project = m.prop([{}]);

        catarseVM.project_id(args.project_id);

        const lReward = catarse.loaderWithToken(models.rewardDetail.getPageOptions({
            project_id: `eq.${catarseVM.project_id()}`
        }));

        lReward.load().then(rewards);
        const mapRewardsToOptions = () => {
            let options = [];
            if (!lReward()) {
                options = _.map(rewards(), r => ({
                    value: r.id,
                    option: `R$ ${h.formatNumber(r.minimum_value, 2, 3)} - ${(r.title ? r.title : r.description).substring(0, 20)}`
                }));
            }

            options.unshift({
                value: null,
                option: 'No reward'
            });

            options.unshift({
                value: '',
                option: 'All'
            });

            return options;
        };

        const lProject = catarse.loaderWithToken(models.projectDetail.getPageOptions({
            project_id: `eq.${catarseVM.project_id()}`
        }));

        lProject.load().then((data) => {
            filterVM.project_id(_.first(data).common_id);
            subscriptions.firstPage(filterVM.parameters()).then(() => {
                loader(false);
            }).catch(handleError);
            project(data);
        });

        return {
            filterVM,
            mapRewardsToOptions,
            filterBuilder,
            submit,
            subscriptions,
            lProject,
            project
        };
    },
    view: function(ctrl, args) {
        const subsCollection = ctrl.subscriptions.collection(),
            filterBuilder = ctrl.filterBuilder,
            statusFilter = _.findWhere(filterBuilder, {
                label: 'status_filter'
            }),
            textFilter = _.findWhere(filterBuilder, {
                label: 'text_filter'
            }),
            rewardFilter = _.findWhere(filterBuilder, {
                label: 'reward_filter'
            }),
            paymentFilter = _.findWhere(filterBuilder, {
                label: 'payment_filter'
            });
        rewardFilter.data.options = ctrl.mapRewardsToOptions();
        if (!ctrl.lProject()) {
            return m('div', [
                m.component(projectDashboardMenu, {
                    project: m.prop(_.first(ctrl.project()))
                }),
                m('.dashboard-header',
                    m('.w-container',
                        m('.w-row', [
                            m('.w-col.w-col-3'),
                            m('.w-col.w-col-6',
                                m('.fontsize-larger.fontweight-semibold.lineheight-looser.u-marginbottom-30.u-text-center',
                                    'Subscriber Base'
                                )
                            ),
                            m('.w-col.w-col-3')
                        ])
                    )
                ),
                m('.divider.u-margintop-30'),
                m('.card',
                    m('.w-container',
                        m('.w-form', [
                            m('form', {
                                onsubmit: ctrl.submit
                            },
                                m('.u-margintop-20.w-row', [
                                    m('.w-col.w-col-12.u-text-center',
                                        m('.w-row', [
                                            m.component(statusFilter.component, statusFilter.data),
                                            m.component(rewardFilter.component, rewardFilter.data),
                                            m.component(paymentFilter.component, paymentFilter.data),
                                            m.component(textFilter.component, textFilter.data)
                                        ])
                                    )
                                ])
                            )
                        ])
                    )
                ),
                m('.before-footer.bg-gray.section', [
                    m('.w-container', [
                        m('div',
                            m('.w-row', [
                                m('.u-marginbottom-20.u-text-center-small-only.w-col.w-col-6',
                                    m('.w-inline-block.fontsize-base.u-marginright-10', [
                                        m('span.fontweight-semibold',
                                            ctrl.subscriptions.total()
                                        ),
                                        ' people',
                                        m.trust('&nbsp;')
                                    ])
                                ),
                                m('.w-col.w-col-6',
                                    m(`a.alt-link.fontsize-small.u-right[href='/projects/${args.project_id}/subscriptions_report_download']`, {
                                        config: m.route
                                    }, [
                                        m('span.fa.fa-download',
                                            m.trust('&nbsp;')
                                        ),
                                        'Download reports'
                                    ])
                                )
                            ])
                        ),
                        m('.u-marginbottom-60', [
                            m('.card.card-secondary.fontsize-smallest.fontweight-semibold.lineheight-tighter.u-marginbottom-10',
                                m('.w-row', [
                                    m('.table-col.w-col.w-col-3',
                                        m('div',
                                            'Subscriber'
                                        )
                                    ),
                                    m('.table-col.w-col.w-col-2',
                                        m('div',
                                            'Reward'
                                        )
                                    ),
                                    m('.table-col.w-col.w-col-1.u-text-center',
                                        m('div',
                                            'Monthly support'
                                        )
                                    ),
                                    m('.table-col.w-col.w-col-2.u-text-center',
                                        m('div',
                                            'Total supported'
                                        )
                                    ),
                                    m('.table-col.w-col.w-col-2.u-text-center',
                                        m('div',
                                            'Last payment'
                                        )
                                    ),
                                    m('.table-col.w-col.w-col-2.u-text-center',
                                        m('div',
                                            'Signature Status'
                                        )
                                    )
                                ])
                            ),
                            m('.fontsize-small', [
                                _.map(subsCollection, subscription =>
                                    m(dashboardSubscriptionCard, {
                                        subscription
                                    }))
                            ])
                        ])
                    ]),
                    m('.bg-gray.section',
                        m('.w-container',
                            m('.u-marginbottom-60.w-row', [
                                m(loadMoreBtn, {
                                    collection: ctrl.subscriptions,
                                    cssClass: '.w-col-push-4'
                                })
                            ])
                        )
                    )
                ])
            ]);
        }
        return m('', h.loader());
    }
};

export default projectSubscriptionReport;
