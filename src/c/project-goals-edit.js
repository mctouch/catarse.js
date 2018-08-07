import m from 'mithril';
import models from '../models';
import _ from 'underscore';
import h from '../h';
import {
    commonAnalytics
} from '../api';
import projectGoalEditCard from './project-goal-edit-card';
import projectGoalCard from './project-goal-card';
import projectGoalsVM from '../vms/project-goals-vm';
import popNotification from './pop-notification';
import generateErrorInstance from '../error';
import railsErrorsVM from '../vms/rails-errors-vm';

const I18nScope = _.partial(h.i18nScope, 'projects.dashboard_goal');

const projectGoalsEdit = {
    controller: function(args) {
        const e = generateErrorInstance();
        const mapErrors = [
            ['goals', ['goals.size']]
        ];
        const goals = projectGoalsVM.goals;

        const l = commonAnalytics.loaderWithToken(models.projectSubscribersInfo.postOptions({
            id: args.project.common_id
        }));

        const currentGoal = m.prop();
        const subscribersDetails = m.prop({});
        l.load().then((subData) => {
            subscribersDetails(subData);
            const sortedGoals = _.sortBy(goals(), g => g().value()),
                nextGoal = _.find(sortedGoals, goal => goal().value() > subscribersDetails().amount_paid_for_valid_period);
            currentGoal(nextGoal());
        });
        const showSuccess = m.prop(false);
        const error = m.prop(false);

        projectGoalsVM.fetchGoalsEdit(args.projectId);

        if (railsErrorsVM.railsErrors()) {
            railsErrorsVM.mapRailsErrors(railsErrorsVM.railsErrors(), mapErrors, e);
        }
        return {
            showSuccess,
            e,
            error,
            goals,
            currentGoal,
            addGoal: projectGoalsVM.addGoal
        };
    },

    view: function(ctrl, args) {
        const showSuccess = ctrl.showSuccess,
            error = ctrl.error;
        return m('.w-container',
            m('.w-row', [
                (ctrl.showSuccess() ? m.component(popNotification, {
                    message: 'Meta successfully saves'
                }) : ''),
                (ctrl.error() ? m.component(popNotification, {
                    message: 'Error saving information',
                    error: true
                }) : ''),

                m('.w-col.w-col-8',
                    m('.w-form', [
                        ctrl.e.inlineError('goals'),
                        m('div',
                            m(".card.card-terciary.medium.u-marginbottom-30[id='arrecadacao']", [
                                m('.u-marginbottom-30', [
                                    m("label.fontsize-base.fontweight-semibold[for='name-8']",
                                        'What you will you achieve with the monthly payments of your subscribers?'
                                    ),
                                    m('.fontsize-smaller', [
                                        'Monthly goals are the best way to let your subscribers know how the monthly proceeds will be used and what you are conquering together.',
                                        m.trust('&nbsp;'),
                                        'Remember: once your fundraising is started, you will no longer be able to change your initial fundraising goal.'
                                    ])
                                ]),
                                _.map(ctrl.goals(), (goal) => {
                                    if (goal().editing()) {
                                        return m(projectGoalEditCard, {
                                            goal,
                                            showSuccess,
                                            project: args.project,
                                            currentGoal: ctrl.currentGoal,
                                            error
                                        });
                                    }
                                    return m(projectGoalCard, {
                                        goal,
                                        project: args.project,
                                        currentGoal: ctrl.currentGoal
                                    });
                                }),
                                m('button.btn.btn-large.btn-message', {
                                    onclick: () => {
                                        ctrl.addGoal(args.projectId);
                                    }
                                }, [
                                    '+ ',
                                    m.trust('&nbsp;'),
                                    ' Add monthly goal'
                                ])
                            ])
                        )
                    ])
                ),
                m('.w-col.w-col-4',
                  m('.card.u-radius',
                      [
                          m('.fontsize-small.u-marginbottom-20',
                              [
                                  m('span.fa.fa-lightbulb-o.fa-lg'),
                                  m.trust('&nbsp;'),
                                  'Tips'
                              ]
                      ),
                          m('ul.w-list-unstyled',
                              [
                                  m('li.u-marginbottom-10',
                            m('a.fontsize-smaller.alt-link[href="https://suporte.catarse.me/hc/pt-br/articles/115005632746-Catarse-Assinaturas-FAQ-Realizadores#meta_inicial"][target="_blank"]',
                              'What is the initial monthly goal?'
                            )
                          ),
                                  m('li.u-marginbottom-10',
                            m('a.fontsize-smaller.alt-link[href="https://suporte.catarse.me/hc/pt-br/articles/115005632746-Catarse-Assinaturas-FAQ-Realizadores#meta_futura"][target="_blank"]',
                              'What are the future monthly goals?'
                            )
                          ),
                                  m('li.u-marginbottom-10',
                            m('a.fontsize-smaller.alt-link[href="https://suporte.catarse.me/hc/pt-br/articles/115005632746-Catarse-Assinaturas-FAQ-Realizadores#meta_atual"][target="_blank"]',
                              'What is your current monthly goal?'
                            )
                          ),
                                  m('li.u-marginbottom-10',
                            m('a.fontsize-smaller.alt-link[href="https://suporte.catarse.me/hc/pt-br/articles/115005632746-Catarse-Assinaturas-FAQ-Realizadores#nova_meta"][target="_blank"]',
                              'Can I add new goals after the release?'
                            )
                          ),
                                  m('li.u-marginbottom-10',
                            m('a.fontsize-smaller.alt-link[href="https://suporte.catarse.me/hc/pt-br/articles/115005632746-Catarse-Assinaturas-FAQ-Realizadores#nao_atingir"][target="_blank"]',
                              'What happens if I do not reach my project goal?'
                            )
                          )
                              ]
                      )
                      ]
                  )
                )
            ])
        );
    }
};

export default projectGoalsEdit;
