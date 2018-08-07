import m from 'mithril';
import _ from 'underscore';
import projectDashboardMenu from '../c/project-dashboard-menu';
import {
    catarse
} from '../api';
import projectsContributionReportVM from '../vms/projects-contribution-report-vm';
import h from '../h';
import models from '../models';

const projectSubscriptionReportDownload = {
    controller: function(args) {
        const catarseVM = projectsContributionReportVM;
        const project = m.prop([{}]);
        catarseVM.project_id(args.project_id);
        const lProject = catarse.loaderWithToken(models.projectDetail.getPageOptions({
            project_id: `eq.${catarseVM.project_id()}`
        }));

        lProject.load().then((data) => {
            project(data);
        });
        return {
            project
        };
    },
    view: function(ctrl, args) {
        return m('.section.project-metrics',
            m('.w-container',
                m('.w-row', [
                    m.component(projectDashboardMenu, {
                        project: m.prop(_.first(ctrl.project()))
                    }),
                    m('.w-col.w-col-2'),
                    m('.w-col.w-col-8',
                        m('.card.u-radius.u-marginbottom-20.card-terciary', [
                            m('.fontsize-small.fontweight-semibold.u-marginbottom-20', [
                                m('span.fa.fa-download',
                                    m.trust('&nbsp;')
                                ),
                                'Download reports'
                            ]),
                            m('.card.u-radius.u-marginbottom-20', [
                                m('span.fontweight-semibold',
                                    m.trust('Attention:')
                                ),
                                'By downloading this data, you agree to store it in a safe place and respect the rights of users as provided in the Terms of Use and the privacy policy of Trend.'
                            ]),
                            m('ul.w-list-unstyled', [
                                m('li.fontsize-smaller.u-marginbottom-10',
                                    m('div', [
                                        'Subscriber Base ',
                                        m.trust('&nbsp;'),
                                        m(`a.alt-link[href='/projects/${args.project_id}/subscriptions_report_for_project_owners.csv']`,
                                            'CSV'
                                        ),
                                        m.trust('&nbsp;'),
                                        '\\',
                                        m.trust('&nbsp;'),
                                        m(`a.alt-link[href='/projects/${args.project_id}/subscriptions_report_for_project_owners.xls']`,
                                            'XLS'
                                        )
                                    ])
                                ),
                                m('li.divider.u-marginbottom-10'),
                                m('li.fontsize-smaller.u-marginbottom-10',
                                    m('div', [
                                        'Confirmed Payment Report',
                                        m.trust('&nbsp;'),
                                        m.trust('&nbsp;'),
                                        m(`a.alt-link[href='/projects/${args.project_id}/subscriptions_monthly_report_for_project_owners.csv']`,
                                            'CSV'
                                        ),
                                        m.trust('&nbsp;'),
                                        '\\',
                                        m.trust('&nbsp;'),
                                        m(`a.alt-link[href='/projects/${args.project_id}/subscriptions_monthly_report_for_project_owners.xls']`,
                                            'XLS'
                                        )
                                    ])
                                )
                            ])
                        ])
                    ),
                    m('.w-col.w-col-2')
                ])
            )
        );
    }
};

export default projectSubscriptionReportDownload;
