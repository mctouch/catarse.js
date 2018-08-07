import m from 'mithril';
import _ from 'underscore';
import h from '../h';

const projectGoalsBox = {
    controller: function(args) {
        const subscriptionData = args.subscriptionData() || {
                amount_paid_for_valid_period: 0
            },
            initialGoalIndex = args.goalDetails().length > 0 ? _.findIndex(args.goalDetails(), goal => goal.value > subscriptionData.amount_paid_for_valid_period) : 0,
            currentGoalIndex = m.prop(initialGoalIndex),
            nextGoal = () => {
                if (currentGoalIndex() < args.goalDetails().length - 1) {
                    currentGoalIndex((currentGoalIndex() + 1));
                }
            },
            previousGoal = () => {
                if (currentGoalIndex() > 0) {
                    currentGoalIndex((currentGoalIndex() - 1));
                    m.redraw();
                }
            };
        // amount is higher than max goal
        if (currentGoalIndex() === -1) {
            currentGoalIndex(args.goalDetails().length - 1);
        }
        return { currentGoalIndex, nextGoal, previousGoal, subscriptionData };
    },
    view: function(ctrl, args) {
        const goals = args.goalDetails().length > 0 ? args.goalDetails() : [{
                title: 'N/A',
                value: '',
                description: ''
            }],
            subscriptionData = ctrl.subscriptionData,
            currentGoalIndex = ctrl.currentGoalIndex,
            goalPercentage = (subscriptionData.amount_paid_for_valid_period / goals[currentGoalIndex()].value) * 100;

        return m('div',
          m(`.card.u-marginbottom-30.u-radius${args.style}`, [
              m('.w-clearfix', [
                  m('.u-right', [
                      m('button.btn.btn-inline.btn-small.btn-terciary.fa.fa-angle-left.w-button', { onclick: ctrl.previousGoal, class: currentGoalIndex() === 0 ? 'btn-desactivated' : '' }),
                      m('button.btn.btn-inline.btn-small.btn-terciary.fa.fa-angle-right.w-button', { onclick: ctrl.nextGoal, class: currentGoalIndex() === goals.length - 1 ? 'btn-desactivated' : '' })
                  ]),
                  m('.fontsize-base.fontweight-semibold.u-marginbottom-20.w-hidden-small.w-hidden-tiny',
                    m('span',
                        'Goals'
                    )
                )
              ]),
              m('.fontsize-small.fontweight-semibold', [
                  m('span.fontcolor-secondary.fontsize-smallest.u-right',
                    `${currentGoalIndex() + 1} de ${goals.length}`
                ),
                  goals[currentGoalIndex()].title
              ]),
              m('.u-marginbottom-10', [
                  m('.meter',
                    m('.meter-fill', {
                        style: {
                            width: `${(goalPercentage > 100 ? 100 : goalPercentage)}%`
                        }
                    })
                ),
                  m('.fontsize-smaller.fontweight-semibold.u-margintop-10',
                    `R$${subscriptionData.amount_paid_for_valid_period} de R$${goals[currentGoalIndex()].value} a month`
                )
              ]),
              m('.fontsize-smaller', [
                  goals[currentGoalIndex()].description
              ])
          ]));
    }
};

export default projectGoalsBox;
