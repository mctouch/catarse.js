import m from 'mithril';
import _ from 'underscore';
import h from '../h';
import inlineError from './inline-error';
import projectVM from '../vms/project-vm';
import commonPaymentVM from '../vms/common-payment-vm';
import subscriptionEditModal from './subscription-edit-modal';

const I18nScope = _.partial(h.i18nScope, 'projects.contributions.edit');

const paymentSlip = {
    controller: function(args) {
        const vm = args.vm,
            isSubscriptionEdit = args.isSubscriptionEdit || m.prop(false),
            slipPaymentDate = projectVM.isSubscription() ? null : vm.getSlipPaymentDate(args.contribution_id),
            loading = m.prop(false),
            error = m.prop(false),
            completed = m.prop(false),
            subscriptionEditConfirmed = m.prop(false),
            showSubscriptionModal = m.prop(false),
            isReactivation = args.isReactivation || m.prop(false);

        const buildSlip = () => {
            vm.isLoading(true);
            m.redraw();

            if (isSubscriptionEdit()
                && !subscriptionEditConfirmed()
                && !isReactivation()) {
                showSubscriptionModal(true);

                return false;
            }

            if (projectVM.isSubscription()) {
                const commonData = {
                    rewardCommonId: args.reward_common_id,
                    userCommonId: args.user_common_id,
                    projectCommonId: args.project_common_id,
                    amount: args.value * 100
                };

                if (isSubscriptionEdit()) {
                    commonPaymentVM.sendSlipPayment(vm, _.extend({}, commonData, { subscription_id: args.subscriptionId() }));

                    return false;
                }

                commonPaymentVM.sendSlipPayment(vm, commonData);

                return false;
            }
            vm.paySlip(args.contribution_id, args.project_id, error, loading, completed);

            return false;
        };

        return {
            vm,
            buildSlip,
            slipPaymentDate,
            loading,
            completed,
            error,
            isSubscriptionEdit,
            showSubscriptionModal,
            subscriptionEditConfirmed,
            isReactivation
        };
    },
    view: function(ctrl, args) {
        const buttonLabel = ctrl.isSubscriptionEdit() && !args.isReactivation() ? window.I18n.t('subscription_edit', I18nScope()) : window.I18n.t('pay_slip', I18nScope());

        return m('.w-row',
                    m('.w-col.w-col-12',
                        m('.u-margintop-30.u-marginbottom-60.u-radius.card-big.card', [
                            projectVM.isSubscription() ? '' : m('.fontsize-small.u-marginbottom-20',
                                ctrl.slipPaymentDate() ? `This bank slip expires on ${h.momentify(ctrl.slipPaymentDate().slip_expiration_date)}.` : 'Loading...'
                            ),
                            m('.fontsize-small.u-marginbottom-40',
                                'In generating the ticket, the director is already counting on his support. Pay through the internet due date, lottery houses, ATMs or bank branch.'
                            ),
                            m('.w-row',
                                m('.w-col.w-col-8.w-col-push-2', [
                                    ctrl.vm.isLoading() ? h.loader() : ctrl.completed() ? '' : m('input.btn.btn-large.u-marginbottom-20', {
                                        onclick: ctrl.buildSlip,
                                        value: buttonLabel,
                                        type: 'submit'
                                    }),
                                    ctrl.showSubscriptionModal()
                                        ? m(subscriptionEditModal,
                                            {
                                                args,
                                                vm: ctrl.vm,
                                                showModal: ctrl.showSubscriptionModal,
                                                confirm: ctrl.subscriptionEditConfirmed,
                                                paymentMethod: 'ticket',
                                                pay: ctrl.buildSlip
                                            }
                                        ) : null,
                                    !_.isEmpty(ctrl.vm.submissionError()) ? m('.card.card-error.u-radius.zindex-10.u-marginbottom-30.fontsize-smaller', m('.u-marginbottom-10.fontweight-bold', m.trust(ctrl.vm.submissionError()))) : '',
                                    ctrl.error() ? m.component(inlineError, { message: ctrl.error() }) : '',
                                    m('.fontsize-smallest.u-text-center.u-marginbottom-30', [
                                        'By supporting, you agree with the',
                                        m('a.alt-link[href=\'/pt/terms-of-use\']',
                                            'Terms of use '
                                        ),
                                        'e ',
                                        m('a.alt-link[href=\'/pt/privacy-policy\']',
                                        'privacy policy'
                                        )
                                    ])
                                ])
                    )
                        ])
            )
        );
    }
};

export default paymentSlip;
