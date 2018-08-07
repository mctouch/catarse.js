import m from 'mithril';
import _ from 'underscore';
import { catarse, commonProject } from '../api';
import models from '../models';
import h from '../h';
import projectDataTable from './project-data-table';
import projectDataChart from './project-data-chart';
import projectContributorCard from './project-contributor-card';
import projectVM from '../vms/project-vm';

const I18nScope = _.partial(h.i18nScope, 'projects.contributions');

const projectContributions = {
    controller: function(args) {
        const contributionsPerDay = m.prop([]),
            listVM = projectVM.isSubscription(args.project()) ? commonProject.paginationVM(models.projectSubscriber) : catarse.paginationVM(models.contributor),
            filterStats = catarse.filtersVM({
                project_id: 'eq'
            }),
            subFilterVM = catarse.filtersVM({
                status: 'in',
                project_id: 'eq'
            }),
            filterVM = catarse.filtersVM({
                project_id: 'eq'
            }),
            groupedCollection = (collection = []) => {
                let grouped = [
                      []
                    ],
                    group = 0;

                _.map(collection, (item, index) => {
                    if (grouped[group].length >= 3) {
                        group += 1;
                        grouped[group] = [];
                    }

                    grouped[group].push(item);
                });

                return grouped;
            },
            contributionsStats = m.prop({});

        if (projectVM.isSubscription(args.project())) {
            subFilterVM.project_id(args.project().common_id).status('active');
        } else {
            filterVM.project_id(args.project().project_id);
        }

        filterStats.project_id(args.project().project_id);

        if (!listVM.collection().length) {
            listVM.firstPage(projectVM.isSubscription(args.project()) ? subFilterVM.parameters() : filterVM.parameters());
        }
        // TODO: Abstract table fetch and contruction logic to contributions-vm to avoid insights.js duplicated code.
        const lContributionsPerDay = catarse.loader(models.projectContributionsPerDay.getRowOptions(filterStats.parameters()));
        lContributionsPerDay.load().then(contributionsPerDay);

        const contributionsPerLocationTable = [
            ['State', 'Support', 'R $ supported (% do total)']
        ];
        const buildPerLocationTable = contributions => (!_.isEmpty(contributions)) ? _.map(_.first(contributions).source, (contribution) => {
            const column = [];

            column.push(contribution.state_acronym || 'Other/other');
            column.push(contribution.total_contributions);
            column.push([contribution.total_contributed, [ // Adding row with custom comparator => read project-data-table description
                m(`input[type="hidden"][value="${contribution.total_contributed}"`),
                'R$ ',
                h.formatNumber(contribution.total_contributed, 2, 3),
                m('span.w-hidden-small.w-hidden-tiny', ` (${contribution.total_on_percentage.toFixed(2)}%)`)
            ]]);
            return contributionsPerLocationTable.push(column);
        }) : [];

        const lContributionsPerLocation = catarse.loader(models.projectContributionsPerLocation.getRowOptions(filterStats.parameters()));
        lContributionsPerLocation.load().then(buildPerLocationTable);

        const lContributionsStats = catarse.loader(models.projectContributiorsStat.getRowOptions(filterStats.parameters()));
        lContributionsStats.load().then(data => contributionsStats(_.first(data)));

        return {
            listVM,
            filterVM,
            groupedCollection,
            lContributionsStats,
            contributionsPerLocationTable,
            lContributionsPerLocation,
            contributionsPerDay,
            lContributionsPerDay,
            contributionsStats
        };
    },
    view: function(ctrl, args) {
        const list = ctrl.listVM,
            stats = projectVM.isSubscription(args.project()) ? args.subscriptionData() : ctrl.contributionsStats(),
            groupedCollection = ctrl.groupedCollection(list.collection());

        return m('#project_contributions', m('#contributions_top', [
            m('.section.w-section',
                    m('.w-container',
                        m('.w-row', ctrl.lContributionsStats() ? h.loader() : !_.isEmpty(stats) ? [
                            m('.u-marginbottom-20.u-text-center-small-only.w-col.w-col-6', [
                                m('.fontsize-megajumbo',
                                    projectVM.isSubscription(args.project()) ? stats.total_subscriptions : stats.total
                                ),
                                m('.fontsize-large',
                                    window.I18n.t(`people_back.${args.project().mode}`, I18nScope())
                                )
                            ]),
                            m('.w-col.w-col-6',
                                m('.card.card-terciary.u-radius',
                                    m('.w-row', [
                                        m('.u-marginbottom-20.w-col.w-sub-col.w-col-6.w-col-small-6', [
                                            m('.fontweight-semibold.u-marginbottom-10',
                                                window.I18n.t(`new_backers.${args.project().mode}`, I18nScope())
                                            ),
                                            m('.fontsize-largest.u-marginbottom-10',
                                                `${Math.floor(stats.new_percent)}%`
                                            ),
                                            m('.fontsize-smallest',
                                                window.I18n.t(`new_backers_explanation.${args.project().mode}`, I18nScope())
                                            )
                                        ]),
                                        m('.w-col.w-sub-col.w-col-6.w-col-small-6', [
                                            m('.divider.u-marginbottom-20.w-hidden-main.w-hidden-medium.w-hidden-small'),
                                            m('.fontweight-semibold.u-marginbottom-10',
                                                window.I18n.t(`recurring_backers.${args.project().mode}`, I18nScope())
                                            ),
                                            m('.fontsize-largest.u-marginbottom-10',
                                                `${Math.ceil(stats.returning_percent)}%`
                                            ),
                                            m('.fontsize-smallest',
                                                window.I18n.t(`recurring_backers_explanation.${args.project().mode}`, I18nScope())
                                            )
                                        ])
                                    ])
                                )
                            )
                        ] : '')
                    )
                ),
            m('.divider.w-section'),
            m('.section.w-section', m('.w-container', [
                m('.fontsize-large.fontweight-semibold.u-marginbottom-40.u-text-center', window.I18n.t(`backers.${args.project().mode}`, I18nScope())),
                m('.project-contributions.w-clearfix', _.map(groupedCollection, (group, idx) => m('.w-row', _.map(group, contribution => m('.project-contribution-item.w-col.w-col-4', [
                    m(projectContributorCard, { project: args.project, contribution, isSubscription: projectVM.isSubscription(args.project()) })
                ]))))),
                m('.w-row.u-marginbottom-40.u-margintop-20', [
                    m('.w-col.w-col-2.w-col-push-5', [!list.isLoading() ?
                            list.isLastPage() ? '' : m('button#load-more.btn.btn-medium.btn-terciary', {
                                onclick: list.nextPage
                            }, 'Load more') : h.loader(),
                    ])
                ])
            ]))
        ]),
            (projectVM.isSubscription(args.project()) ? '' :
            m('.before-footer.bg-gray.section.w-section', m('.w-container', [
                m('.w-row.u-marginbottom-60', [
                    m('.w-col.w-col-12.u-text-center', {
                        style: {
                            'min-height': '300px'
                        }
                    }, [!ctrl.lContributionsPerDay() ? m.component(projectDataChart, {
                        collection: ctrl.contributionsPerDay,
                        label: 'R $ collected per day',
                        dataKey: 'total_amount',
                        xAxis: item => h.momentify(item.paid_at),
                        emptyState: 'Unaccounted support'
                    }) : h.loader()]),
                ]),
                m('.w-row',
                    m('.w-col.w-col-12.u-text-center', [
                        m('.fontweight-semibold.u-marginbottom-10.fontsize-large.u-text-center', 'Where does the support come from?'),
                        (!ctrl.lContributionsPerLocation() ? !_.isEmpty(_.rest(ctrl.contributionsPerLocationTable)) ? m.component(projectDataTable, {
                            table: ctrl.contributionsPerLocationTable,
                            defaultSortIndex: -2
                        }) : '' : h.loader())
                    ])
                )
            ]))));
    }
};

export default projectContributions;
