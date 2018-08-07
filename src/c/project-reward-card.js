import m from 'mithril';
import _ from 'underscore';
import h from '../h';
import rewardVM from '../vms/reward-vm';
import projectVM from '../vms/project-vm';

const I18nScope = _.partial(h.i18nScope, 'projects.contributions');

const projectRewardCard = {
    controller: function(args) {
        const storeKey = 'selectedReward',
            reward = args.reward,
            vm = rewardVM,
            descriptionExtended = m.prop(0),
            selectedDestination = m.prop(''),
            toggleDescriptionExtended = (rewardId) => {
                if (descriptionExtended() === rewardId) {
                    descriptionExtended(0);
                } else {
                    descriptionExtended(rewardId);
                }

                return false;
            };

        const setInput = (el, isInitialized) => (!isInitialized ? el.focus() : false);

        const selectDestination = (destination) => {
            selectedDestination(destination);

            const shippingFee = vm.shippingFeeForCurrentReward(selectedDestination)
                ? Number(vm.shippingFeeForCurrentReward(selectedDestination).value)
                : 0;
            const rewardMinValue = Number(vm.selectedReward().minimum_value);
            vm.applyMask(`${h.formatNumber(shippingFee + rewardMinValue, 2, 3)}`);
        };

        // @TODO: move submit, fee & value logic to VM
        const submitContribution = () => {
            const valueFloat = h.monetaryToFloat(vm.contributionValue);
            const shippingFee = rewardVM.hasShippingOptions(vm.selectedReward()) ? vm.shippingFeeForCurrentReward(selectedDestination) : { value: 0 };

            if (!selectedDestination() && rewardVM.hasShippingOptions(vm.selectedReward())) {
                vm.error('Please select a valid freight option.');
            } else if (valueFloat < vm.selectedReward().minimum_value + shippingFee.value) {
                vm.error(`The support amount for this reward must be at least R $${vm.selectedReward().minimum_value} ${projectVM.isSubscription(projectVM.currentProject()) ? '' : `+ freight R$${h.formatNumber(shippingFee.value, 2, 3)}`} `);
            } else {
                vm.error('');
                const valueUrl = window.encodeURIComponent(String(valueFloat).replace('.', ','));

                if (projectVM.isSubscription(projectVM.currentProject())) {
                    vm.contributionValue(valueFloat);
                    m.route(`/projects/${projectVM.currentProject().project_id}/subscriptions/checkout`, { contribution_value: valueFloat, reward_id: vm.selectedReward().id });

                    return false;
                }

                h.navigateTo(`/projects/${projectVM.currentProject().project_id}/contributions/fallback_create?contribution%5Breward_id%5D=${vm.selectedReward().id}&contribution%5Bvalue%5D=${valueUrl}&contribution%5Bshipping_fee_id%5D=${shippingFee.id}`);
            }

            return false;
        };
        const isRewardOpened = () => vm.selectedReward() && vm.selectedReward().id === reward.id;
        const isRewardDescriptionExtended = () => descriptionExtended() === reward.id;
        const isLongDescription = () => reward.description.length > 110;
        if (h.getStoredObject(storeKey)) {
            const {
                value
            } = h.getStoredObject(storeKey);

            h.removeStoredObject(storeKey);
            vm.selectedReward(reward);
            vm.contributionValue(h.applyMonetaryMask(`${value},00`));
            submitContribution();
        }

        vm.getStates();

        return {
            setInput,
            reward,
            submitContribution,
            toggleDescriptionExtended,
            isRewardOpened,
            isLongDescription,
            isRewardDescriptionExtended,
            selectDestination,
            selectedDestination,
            error: vm.error,
            applyMask: vm.applyMask,
            selectReward: vm.selectReward,
            locationOptions: vm.locationOptions,
            contributionValue: vm.contributionValue
        };
    },
    view: function(ctrl, args) {
        // FIXME: MISSING ADJUSTS
        // - add draft admin modifications
        const reward = ctrl.reward,
            project = args.project,
            isSub = projectVM.isSubscription(project);
        return m(`div[class="${h.rewardSouldOut(reward) || args.hasSubscription() ? 'card-gone' : `card-reward ${project.open_for_contributions ? 'clickable' : ''}`} card card-secondary u-marginbottom-10"]`, {
            onclick: h.analytics.event({
                cat: 'contribution_create',
                act: 'contribution_reward_click',
                lbl: reward.minimum_value,
                project,
                extraData: {
                    reward_id: reward.id,
                    reward_value: reward.minimum_value
                }
            }, ctrl.selectReward(reward)),
            config: ctrl.isRewardOpened(reward) ? h.scrollTo() : Function.prototype
        }, [
            m('.u-marginbottom-20', [
                m('.fontsize-base.fontweight-semibold', `R$ ${h.formatNumber(reward.minimum_value)} or more${isSub ? ' a month' : ''}`)
            ]),
            m('.fontsize-smaller.fontweight-semibold',
              reward.title
             ),

            m(`.fontsize-smaller.reward-description${h.rewardSouldOut(reward) ? '' : '.fontcolor-secondary'}`, {
                class: ctrl.isLongDescription()
                    ? ctrl.isRewardOpened()
                    ? `opened ${ctrl.isRewardDescriptionExtended() ? 'extended' : ''}`
                    : ''
                : 'opened extended'
            }, m.trust(h.simpleFormat(h.strip(reward.description)))),
            ctrl.isLongDescription() && ctrl.isRewardOpened() ? m('a[href="javascript:void(0);"].alt-link.fontsize-smallest.gray.link-more.u-marginbottom-20', {
                onclick: () => ctrl.toggleDescriptionExtended(reward.id)
            }, [
                ctrl.isRewardDescriptionExtended() ? 'less ' : 'more ',
                m('span.fa.fa-angle-down', {
                    class: ctrl.isRewardDescriptionExtended() ? 'reversed' : ''
                })
            ]) : '',
            isSub ? null : m('.u-marginbottom-20.w-row', [
                m('.w-col.w-col-6', !_.isEmpty(reward.deliver_at) ? [
                    m('.fontcolor-secondary.fontsize-smallest',
                      m('span', 'Expected delivery:')
                     ),
                    m('.fontsize-smallest',
                      h.momentify(reward.deliver_at, 'MMM/YYYY')
                     )
                ] : ''),
                m('.w-col.w-col-6', rewardVM.hasShippingOptions(reward) || reward.shipping_options === 'presential' ? [
                    m('.fontcolor-secondary.fontsize-smallest',
                      m('span',
                        'Send:'
                       )
                     ),
                    m('.fontsize-smallest',
                      window.I18n.t(`shipping_options.${reward.shipping_options}`, I18nScope())
                     )
                ] : '')
            ]),
            reward.maximum_contributions > 0 ? [
                (h.rewardSouldOut(reward) ? m('.u-margintop-10', [
                    m('span.badge.badge-gone.fontsize-smaller', 'Out of stock')
                ]) : m('.u-margintop-10', [
                    m('span.badge.badge-attention.fontsize-smaller', [
                        m('span.fontweight-bold', 'Limited'),
                        project.open_for_contributions ? ` (${h.rewardRemaning(reward)} de ${reward.maximum_contributions} available)` : ''
                    ])
                ]))
            ] : '',
            m('.fontcolor-secondary.fontsize-smallest.fontweight-semibold',
              h.pluralize.apply(
                  null,
                  isSub ? [reward.paid_count, ' subscriber', ' subscribers'] : [reward.paid_count, ' support', ' supports'])
             ),
            reward.waiting_payment_count > 0 ? m('.maximum_contributions.in_time_to_confirm.clearfix', [
                m('.pending.fontsize-smallest.fontcolor-secondary', h.pluralize(reward.waiting_payment_count, ' support in confirmation period', ' support in confirmation period.'))
            ]) : '',
            project.open_for_contributions && !h.rewardSouldOut(reward) && !args.hasSubscription() ? [
                ctrl.isRewardOpened() ? m('.w-form', [
                    m('form.u-margintop-30', {
                        onsubmit: ctrl.submitContribution
                    }, [
                        m('.divider.u-marginbottom-20'),
                        rewardVM.hasShippingOptions(reward) ? m('div', [
                            m('.fontcolor-secondary.u-marginbottom-10',
                              'Local by delivery'
                             ),
                            m('select.positive.text-field.w-select', {
                                onchange: m.withAttr('value', ctrl.selectDestination),
                                value: ctrl.selectedDestination()
                            },
                              _.map(
                                  ctrl.locationOptions(reward, ctrl.selectedDestination),
                                  option => m('option',
                                              { selected: option.value === ctrl.selectedDestination(), value: option.value },
                                      [
                                          `${option.name} `,
                                          option.value != '' ? `+R$${h.formatNumber(option.fee, 2, 3)}` : null
                                      ]
                                             )
                              )
                             )
                        ]) : '',
                        m('.fontcolor-secondary.u-marginbottom-10',
                          `Value of support${isSub ? ' monthly' : ''}`
                         ),
                        m('.w-row.u-marginbottom-20', [
                            m('.w-col.w-col-3.w-col-small-3.w-col-tiny-3',
                              m('.back-reward-input-reward.placeholder', 'R$')
                             ),
                            m('.w-col.w-col-9.w-col-small-9.w-col-tiny-9',
                              m('input.w-input.back-reward-input-reward[type="tel"]', {
                                  config: ctrl.setInput,
                                  onkeyup: m.withAttr('value', ctrl.applyMask),
                                  value: ctrl.contributionValue()
                              })
                             )
                        ]),
                        m('input.w-button.btn.btn-medium[type="submit"][value="Continuar >"]'),
                        ctrl.error().length > 0 ? m('.text-error', [
                            m('br'),
                            m('span.fa.fa-exclamation-triangle'),
                            ` ${ctrl.error()}`
                        ]) : ''
                    ])
                ]) : ''
            ] : ''
        ]);
    }
};

export default projectRewardCard;
