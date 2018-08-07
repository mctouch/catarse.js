import m from 'mithril';
import _ from 'underscore';
import moment from 'moment';
import h from '../h';
import projectVM from '../vms/project-vm';
import projectRewardList from './project-reward-list';
import projectGoalsBox from './project-goals-box';
import projectReport from './project-report';
import projectSuggestedContributions from './project-suggested-contributions';

const projectAbout = {
    view: function(ctrl, args) {
        const project = args.project() || {},
            onlineDays = () => {
                const diff = moment(project.zone_online_date).diff(moment(project.zone_expires_at)),
                    duration = moment.duration(diff);

                return -Math.ceil(duration.asDays());
            };
        const fundingPeriod = () => (project.is_published && h.existy(project.zone_expires_at)) ? m('.funding-period', [
            m('.fontsize-small.fontweight-semibold.u-text-center-small-only', 'Campaign period'),
            m('.fontsize-small.u-text-center-small-only', `${h.momentify(project.zone_online_date)} - ${h.momentify(project.zone_expires_at)} (${onlineDays()} days)`)
        ]) : '';

        const nextStepsCardOptions = () => {
            const isSubscription = projectVM.isSubscription(project);
            const hasRewards = !_.isEmpty(args.rewardDetails());
            const titleText = hasRewards ? 'Rewards' : 'Suggestions for support';

            return [
                isSubscription ? [
                    m('.fontsize-base.fontweight-semibold.u-marginbottom-30', titleText),
                ] : [
                    m('.fontsize-base.u-marginbottom-30.w-hidden-small.w-hidden-tiny', [
                        m('span.fontweight-semibold', titleText),
                        m.trust('&nbsp;'),
                        m('span.badge.fontsize-smaller.badge-success', 'Sets up to 6x')
                    ])
                ],
                hasRewards ? [
                    m.component(projectRewardList, {
                        project: args.project,
                        hasSubscription: args.hasSubscription,
                        rewardDetails: args.rewardDetails
                    })
                ] : [
                    m.component(projectSuggestedContributions, { project: args.project })
                ],
                fundingPeriod()
            ];
        };

        return m('#project-about', [
            m('.project-about.w-col.w-col-8', {
                config: h.UIHelper()
            }, [
                m('p.fontsize-base', [
                    m('strong', 'O projeto'),
                ]),
                m('.fontsize-base[itemprop="about"]', m.trust(h.selfOrEmpty(project.about_html, '...'))),
                project.budget ? [
                    m('p.fontsize-base.fontweight-semibold', 'Budget'),
                    m('p.fontsize-base', m.trust(project.budget))
                ] : '',
                m.component(projectReport)
            ]),
            m('.w-col.w-col-4.w-hidden-small.w-hidden-tiny', [
                projectVM.isSubscription(project) ? (args.subscriptionData() ? m(projectGoalsBox, { goalDetails: args.goalDetails, subscriptionData: args.subscriptionData }) : h.loader()) : '',
                nextStepsCardOptions()
            ])
        ]);
    }
};

export default projectAbout;
