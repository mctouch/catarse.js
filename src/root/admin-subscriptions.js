import m from 'mithril';
import h from '../h';
import models from '../models';
import _ from 'underscore';
import subscriptionListVM from '../vms/subscription-list-vm';
import subscriptionFilterVM from '../vms/subscription-filter-vm';
import adminList from '../c/admin-list';
import adminFilter from '../c/admin-filter';
import adminSubscriptionItem from '../c/admin-subscription-item';
import adminSubscriptionDetail from '../c/admin-subscription-detail';
import filterDropdown from '../c/filter-dropdown';
import filterMain from '../c/filter-main';
import modalBox from '../c/modal-box';

const adminSubscriptions = {
    controller: function() {
        let listVM = subscriptionListVM,
            filterVM = subscriptionFilterVM,
            error = m.prop(''),
            filterBuilder = [{ // name
                component: filterMain,
                data: {
                    vm: filterVM.search_index,
                    placeholder: 'Search by project, permalink, email, name of the director...'
                },
            }, { // state
                component: filterDropdown,
                data: {
                    label: 'With the status',
                    name: 'status',
                    vm: filterVM.status,
                    options: [{
                        value: '',
                        option: 'Any'
                    }, {
                        value: 'started',
                        option: 'started'
                    }, {
                        value: 'active',
                        option: 'active'
                    }, {
                        value: 'inactive',
                        option: 'inactive'
                    }, {
                        value: 'canceled',
                        option: 'canceled'
                    }, {
                        value: 'canceling',
                        option: 'canceling'
                    }, {
                        value: 'deleted',
                        option: 'deleted'
                    }, {
                        value: 'error',
                        option: 'error'
                    }]
                }
            }],
            submit = () => {
                error(false);
                listVM.firstPage(filterVM.parameters()).then(null, (serverError) => {
                    error(serverError.message);
                });
                return false;
            },
            displayChargebackForm = h.toggleProp(false, true),
            chargebackIds = m.prop(),
            generateIdsToData = () => {
                if (chargebackIds() === undefined) {
                    return null;
                }

                return chargebackIds().split(',').map(str => str.trim());
            },
            toChargebackListVM = models.commonPayments,
            toChargebackCollection = m.prop(),
            processChargebacksLoader = h.toggleProp(false, true),
            displayChargebackConfirmationModal = h.toggleProp(false, true),
            searchChargebackLoader = h.toggleProp(false, true),
            chargebackConfirmationModalContentWrapper = (customAttrs) => {
                const wrapper = {
                    view(ctrl, args) {
                        return m('', [
                            m('.modal-dialog-header', [
                                m('.fontsize-large.u-text-center', args.modalTitle)
                            ]),
                            m('.modal-dialog-content', [
                                m('.w-row.fontweight-semibold', [
                                    m('.w-col.w-col-3', 'ID do gateway'),
                                    m('.w-col.w-col-4', 'Name of the supporter'),
                                    m('.w-col.w-col-2', 'Value'),
                                    m('.w-col.w-col-3', 'Project'),
                                ]),
                                _.map(toChargebackCollection(), (item, index) => m('.divider.fontsize-smallest.lineheight-looser', [
                                    m('.w-row', [
                                        m('.w-col.w-col-3', [
                                            m('span', item.gateway_id)
                                        ]),
                                        m('.w-col.w-col-4', [
                                            m('span', item.billing_data.name)
                                        ]),
                                        m('.w-col.w-col-2', [
                                            m('span', `${h.formatNumber((item.amount/100), 2, 3)}`)
                                        ]),
                                        m('.w-col.w-col-3', [
                                            m('span', item.project.name)
                                        ]),
                                    ])
                                ])),
                                m('.w-row.fontweight-semibold.divider', [
                                    m('.w-col.w-col-6', 'Total'),
                                    m('.w-col.w-col-3', `R$ ${h.formatNumber(_.reduce(toChargebackCollection(), (t, i) => t + (i.amount/100), 0), 2, 3)}`)
                                ]),
                                m('.w-row.u-margintop-40', [
                                    m('.w-col.w-col-1'),
                                    m('.w-col.w-col-5',
                                        m('a.btn.btn-medium.w-button', {
                                            onclick: args.onClickCallback
                                        }, args.ctaText)
                                    ),
                                    m('.w-col.w-col-5',
                                        m('a.btn.btn-medium.btn-terciary.w-button', {
                                            onclick: args.displayModal.toggle
                                        }, 'Come back')
                                    ),
                                    m('.w-col.w-col-1')
                                ])
                            ])
                        ]);
                    }
                };
                return [wrapper, customAttrs];
            },
            searchToChargebackPayments = () => {
                if (chargebackIds() !== undefined && chargebackIds() !== '') {
                    searchChargebackLoader(true);
                    m.redraw();
                    toChargebackListVM.pageSize(30);
                    toChargebackListVM.getPageWithToken({ gateway_id: `in.(${generateIdsToData().join(',')})` }).then((data) => {
                        toChargebackCollection(data);
                        searchChargebackLoader(false);
                        displayChargebackConfirmationModal(true);
                        m.redraw();
                        toChargebackListVM.pageSize(10);
                    });
                }
            },
            processChargebacks = () => {
                if (generateIdsToData() !== null && generateIdsToData().length >= 0) {
                    processChargebacksLoader(true);
                    m.redraw();
                    m.request({
                        method: 'POST',
                        url: '/admin/subscription_payments/batch_chargeback',
                        data: {
                            gateway_payment_ids: generateIdsToData()
                        },
                        config: h.setCsrfToken
                    }).then((data) => {
                        processChargebacksLoader(false);
                        displayChargebackForm(false);
                        displayChargebackConfirmationModal(false);
                        submit(); // just to reload the contribution list
                    });
                }
            },
            inputActions = () => m('', [
                m('.w-inline-block', [
                    m('button.btn-inline.btn.btn-small.btn-terciary', {
                        onclick: displayChargebackForm.toggle
                    }, 'Bulk Chargeback'),
                        (displayChargebackForm() ? m('.dropdown-list.card.u-radius.dropdown-list-medium.zindex-10', [
                            m('.w-form', [
                                (processChargebacksLoader() ?
                                    h.loader()
                                    : m('form', { onsubmit: searchToChargebackPayments }, [
                                        m('label.fontsize-small', 'Enter gateway IDs separated by commas'),
                                        m('textarea.text-field.w-input', { oninput: m.withAttr('value', chargebackIds) }),
                                        m('button.btn.btn-small.w-button', 'Flip backs for chargeback')
                                    ])
                                )
                            ])
                        ]) : '')
                ])
            ]);

        return {
            filterVM,
            filterBuilder,
            displayChargebackConfirmationModal,
            chargebackConfirmationModalContentWrapper,
            processChargebacks,
            listVM: {
                list: listVM,
                hasInputAction: true,
                inputActions,
                error
            },
            data: {
                label: 'About us'
            },
            submit
        };
    },

    view: function(ctrl) {
        const label = 'About us';
        return m('', [
            (ctrl.displayChargebackConfirmationModal() ? m(modalBox, {
                displayModal: ctrl.displayChargebackConfirmationModal,
                content: ctrl.chargebackConfirmationModalContentWrapper({
                    modalTitle: 'Approve chargebacks',
                    ctaText: 'Approve',
                    displayModal: ctrl.displayChargebackConfirmationModal,
                    onClickCallback: ctrl.processChargebacks
                })
            }) : ''),
            m('#admin-root-subscriptions', [
                m.component(adminFilter, {
                    form: ctrl.filterVM.formDescriber,
                    filterBuilder: ctrl.filterBuilder,
                    label,
                    submit: ctrl.submit
                }),
                m.component(adminList, {
                    vm: ctrl.listVM,
                    listItem: adminSubscriptionItem,
                    listDetail: adminSubscriptionDetail
                })
            ])
        ]);
    }
};

export default adminSubscriptions;
