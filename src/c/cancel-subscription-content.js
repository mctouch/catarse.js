/**
 * window.c.cancelSubscriptionContent component
 * Render cancel subscription form
 *
 */
import m from 'mithril';
import {
    catarse,
    commonPayment
} from '../api';
import _ from 'underscore';
import h from '../h';
import models from '../models';

const cancelSubscriptionContent = {
    controller: function(args) {
        const canceling = m.prop(false);

        const cancelSubscription = () => {
            const l = commonPayment.loaderWithToken(models.cancelSubscription.postOptions({
                id: args.subscription.id
            }));
            l.load().then(() => {
                canceling(true);
                args.subscription.status = 'canceling';
                m.redraw();
            });
        };

        return {
            cancelSubscription,
            canceling
        };
    },
    view: function(ctrl, args) {
        const successMessage = m('.modal-dialog-content', [
                m('.fontsize-megajumbo.u-text-center.u-marginbottom-20',
              '🙁'
             ),
                m('.fontsize-base.u-marginbottom-20', [
                    'Your subscription to ',
                    m('span.fontweight-semibold',
                  `R$${args.subscription.amount / 100}`
                 ),
                    ' for the project ',
                    m('span.fontweight-semibold',
                  args.subscription.project.project_name
                 ),
                    ` Was canceled. Since your next expiration date is $ {h.momentify (args.subscription.next_charge_at, 'DD / MM / YYYY')}, your signature will still be active to this day. But do not worry, you will not have any more charges on your behalf from now on..`,
                    m('br'),
                    m('br'),
                    'If for any reason you want a refund of your monthly support, please contact ',
                    m(`a.alt-link[href='/users/${args.subscription.project.project_user_id}#about']`,
                  args.subscription.project.owner_name
                 ),
                    '.',
                    m('br'),
                    m('br'),
                    'See you later!'
                ])
            ]),
            contactForm = [
                m('.modal-dialog-content', [
                    m('.modal-dialog-nav-bottom',
                        m('.w-row', [
                            m('.w-col.w-col-2'),
                            m('.u-text-center.w-col.w-col-5',
                                m('a.btn.btn-large.u-marginbottom-20', {
                                    onclick: ctrl.cancelSubscription
                                },
                                    'Cancel subscription'
                                )
                            ),
                            m('.w-col.w-col-3',
                                m('a.btn.btn-large.u-marginbottom-20.btn-terciary.btn-no-border', {
                                    onclick: args.displayModal.toggle
                                },
                                    'Come back'
                                )
                            ),
                            m('.w-col.w-col-2')
                        ])
                    ),
                    m('.fontsize-base', [
                        'Are you sure you want to request the cancellation of your subscription ',
                        m('span.fontweight-semibold',
                            `R$${args.subscription.amount / 100}`
                        ),
                        ' for the project ',
                        m('span.fontweight-semibold',
                            args.subscription.project.project_name
                        ),
                        '?'
                    ])
                ])
            ];

        return m('div', [
            m('.modal-dialog-header',
                m('.fontsize-large.u-text-center', 'Cancel your subscription')
            ),
            ctrl.canceling() ? successMessage : contactForm
        ]);
    }
};

export default cancelSubscriptionContent;
