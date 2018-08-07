import m from 'mithril';
import _ from 'underscore';
import { catarse } from '../api';
import models from '../models';
import h from '../h';
import projectDashboardMenu from '../c/project-dashboard-menu';
import projectContributionReportHeader from '../c/project-contribution-report-header';
import projectContributionReportContent from '../c/project-contribution-report-content';
import projectsContributionReportVM from '../vms/projects-contribution-report-vm';
import FilterMain from '../c/filter-main';
import FilterDropdown from '../c/filter-dropdown';
import downloadReports from '../c/download-reports';
import InfoProjectContributionLegend from '../c/info-project-contribution-legend';
import ProjectContributionStateLegendModal from '../c/project-contribution-state-legend-modal';
import ProjectContributionDeliveryLegendModal from '../c/project-contribution-delivery-legend-modal';

const projectContributionReport = {
    controller: function(args) {
        const listVM = catarse.paginationVM(models.projectContribution, 'id.desc', {
                Prefer: 'count=exact'
            }),
            filterVM = projectsContributionReportVM,
            project = m.prop([{}]),
            rewards = m.prop([]),
            showDownloads = m.prop(false),
            contributionStateOptions = m.prop([]),
            reloadSelectOptions = (projectState) => {
                let opts = [{
                    value: '',
                    option: 'Everybody'
                }];

                const optionsMap = {
                    online: [{
                        value: 'paid',
                        option: 'Confirmed'
                    },
                    {
                        value: 'pending',
                        option: 'Initiated'
                    },
                    {
                        value: 'refunded,chargeback,deleted,pending_refund',
                        option: 'Answered'
                    },
                    ],
                    waiting_funds: [{
                        value: 'paid',
                        option: 'Confirmed'
                    },
                    {
                        value: 'pending',
                        option: 'Initiated'
                    },
                    {
                        value: 'refunded,chargeback,deleted,pending_refund',
                        option: 'Answered'
                    },
                    ],
                    failed: [{
                        value: 'refunded',
                        option: 'Refunded'
                    }],
                    successful: [{
                        value: 'paid',
                        option: 'Confirmed'
                    },
                    {
                        value: 'refunded,chargeback,deleted,pending_refund',
                        option: 'Answered'
                    },
                    ]
                };

                opts = opts.concat(optionsMap[projectState] || []);

                contributionStateOptions(opts);
            },
            submit = () => {
                if (filterVM.reward_id() === 'null') {
                    listVM.firstPage(filterVM.withNullParameters()).then(null);
                } else {
                    listVM.firstPage(filterVM.parameters()).then(null);
                }

                return false;
            },
            filterBuilder = [{
                component: FilterMain,
                data: {
                    inputWrapperClass: '.w-input.text-field',
                    btnClass: '.btn.btn-medium',
                    vm: filterVM.full_text_index,
                    placeholder: 'Search by name or email of the supporter'
                }
            },
            {
                label: 'reward_filter',
                component: FilterDropdown,
                data: {
                    label: 'Reward',
                    onchange: submit,
                    name: 'reward_id',
                    vm: filterVM.reward_id,
                    wrapper_class: '.w-sub-col.w-col.w-col-3',
                    options: []
                }
            },
            {
                label: 'delivery_filter',
                component: FilterDropdown,
                data: {
                    custom_label: [InfoProjectContributionLegend, {
                        content: [ProjectContributionDeliveryLegendModal],
                        text: 'Status from entrega'
                    }],
                    onchange: submit,
                    name: 'delivery_status',
                    vm: filterVM.delivery_status,
                    wrapper_class: '.w-sub-col.w-col.w-col-3',
                    options: [{
                        value: '',
                        option: 'Everybody'
                    },
                    {
                        value: 'undelivered',
                        option: 'Not delivered'
                    },
                    {
                        value: 'delivered',
                        option: 'Delivered'
                    },
                    {
                        value: 'error',
                        option: 'Sending error'
                    },
                    {
                        value: 'received',
                        option: 'Received'
                    }
                    ]
                }
            },
            {
                label: 'survey_filter',
                component: FilterDropdown,
                data: {
                    label: 'Questionnaire Status',
                    onchange: submit,
                    name: 'survey_status',
                    vm: filterVM.survey_status,
                    wrapper_class: '.w-col.w-col-3',
                    options: [{
                        value: '',
                        option: 'Everybody'
                    },
                    {
                        value: 'not_sent',
                        option: 'Not sent'
                    },
                    {
                        value: 'sent,answered',
                        option: 'Sent'
                    },
                    {
                        value: 'sent',
                        option: 'Not answered'
                    },
                    {
                        value: 'answered',
                        option: 'Answered'
                    }
                    ]
                }
            },
            {
                label: 'payment_state',
                component: FilterDropdown,
                data: {
                    custom_label: [InfoProjectContributionLegend, {
                        text: 'Support Status',
                        content: [ProjectContributionStateLegendModal, {
                            project
                        }]
                    }],
                    name: 'state',
                    onchange: submit,
                    vm: filterVM.state,
                    wrapper_class: '.w-sub-col.w-col.w-col-3',
                    options: contributionStateOptions
                }
            }
            ];

        filterVM.project_id(args.project_id);

        const lReward = catarse.loaderWithToken(models.rewardDetail.getPageOptions({
            project_id: `eq.${filterVM.project_id()}`
        }));
        const lProject = catarse.loaderWithToken(models.projectDetail.getPageOptions({
            project_id: `eq.${filterVM.project_id()}`
        }));

        lReward.load().then(rewards);
        lProject.load().then((data) => {
            project(data);
            reloadSelectOptions(_.first(data).state);
        });

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

        if (!listVM.collection().length) {
            if (m.route.param('rewardId')) {
                filterVM.reward_id(m.route.param('rewardId'));
            }
            listVM.firstPage(filterVM.parameters());
        }

        return {
            listVM,
            filterVM,
            filterBuilder,
            submit,
            lProject,
            rewards,
            project,
            showDownloads,
            mapRewardsToOptions
        };
    },
    view: function(ctrl) {
        const list = ctrl.listVM;

        if (!ctrl.lProject()) {
            return m('', [
                m.component(projectDashboardMenu, {
                    project: m.prop(_.first(ctrl.project()))
                }),
                ctrl.showDownloads() ? m(downloadReports, {
                    project: m.prop(_.first(ctrl.project())),
                    rewards: ctrl.rewards()
                }) : [
                    m(`.w-section.section-product.${_.first(ctrl.project()).mode}`),
                    m.component(projectContributionReportHeader, {
                        submit: ctrl.submit,
                        filterBuilder: ctrl.filterBuilder,
                        form: ctrl.filterVM.formDescriber,
                        mapRewardsToOptions: ctrl.mapRewardsToOptions,
                        filterVM: ctrl.filterVM
                    }),
                    m.component(projectContributionReportContent, {
                        submit: ctrl.submit,
                        list,
                        showDownloads: ctrl.showDownloads,
                        filterVM: ctrl.filterVM,
                        project: m.prop(_.first(ctrl.project()))
                    })
                ]
            ]);
        }
        return m('', h.loader());
    }
};

export default projectContributionReport;
