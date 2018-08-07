import m from 'mithril';
import h from '../h';
import models from '../models';
import { catarse } from '../api';
import _ from 'underscore';
import contributionListVM from '../vms/contribution-list-vm';
import contributionFilterVM from '../vms/contribution-filter-vm';
import adminList from '../c/admin-list';
import adminFilter from '../c/admin-filter';
import adminContributionItem from '../c/admin-contribution-item';
import adminContributionDetail from '../c/admin-contribution-detail';
import filterMain from '../c/filter-main';
import filterDropdown from '../c/filter-dropdown';
import filterNumberRange from '../c/filter-number-range';
import filterDateRange from '../c/filter-date-range';
import modalBox from '../c/modal-box';

const adminContributions = {
    controller: function() {
        let listVM = contributionListVM,
            filterVM = contributionFilterVM,
            error = m.prop(''),
            filterBuilder = [{ // full_text_index
                component: filterMain,
                data: {
                    vm: filterVM.full_text_index,
                    placeholder: 'Search by Design, Email, User and Support Ids...'
                }
            }, { // delivery_status
                component: filterDropdown,
                data: {
                    label: 'Status from entrega',
                    name: 'delivery_status',
                    vm: filterVM.delivery_status,
                    options: [{
                        value: '',
                        option: 'Any'
                    }, {
                        value: 'delivered',
                        option: 'delivered'
                    }, {
                        value: 'undelivered',
                        option: 'undelivered'
                    }, {
                        value: 'error',
                        option: 'error'
                    }, {
                        value: 'received',
                        option: 'received'
                    }]
                }
            }, { // state
                component: filterDropdown,
                data: {
                    label: 'With the status',
                    name: 'state',
                    vm: filterVM.state,
                    options: [{
                        value: '',
                        option: 'Any'
                    }, {
                        value: 'paid',
                        option: 'paid'
                    }, {
                        value: 'refused',
                        option: 'refused'
                    }, {
                        value: 'pending',
                        option: 'pending'
                    }, {
                        value: 'pending_refund',
                        option: 'pending_refund'
                    }, {
                        value: 'refunded',
                        option: 'refunded'
                    }, {
                        value: 'chargeback',
                        option: 'chargeback'
                    }, {
                        value: 'deleted',
                        option: 'deleted'
                    }]
                }
            }, { // gateway
                component: filterDropdown,
                data: {
                    label: 'gateway',
                    name: 'gateway',
                    vm: filterVM.gateway,
                    options: [{
                        value: '',
                        option: 'Any'
                    }, {
                        value: 'Pay me',
                        option: 'Pay me'
                    }, {
                        value: 'MoIP',
                        option: 'MoIP'
                    }, {
                        value: 'PayPal',
                        option: 'PayPal'
                    }, {
                        value: 'Credits',
                        option: 'Credits'
                    }]
                }
            }, { // value
                component: filterNumberRange,
                data: {
                    label: 'Values ​​between',
                    first: filterVM.value.gte,
                    last: filterVM.value.lte
                }
            }, { // created_at
                component: filterDateRange,
                data: {
                    label: 'Support period',
                    first: filterVM.created_at.gte,
                    last: filterVM.created_at.lte
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
                if (chargebackIds() == undefined) {
                    return null;
                }

                return chargebackIds().split(',').map(str => str.trim());
            },
            processChargebacksLoader = h.toggleProp(false, true),
            displayChargebackConfirmationModal = h.toggleProp(false, true),
            searchChargebackLoader = h.toggleProp(false, true),
            toChargebackListVM = models.contributionDetail,
            toChargebackCollection = m.prop(),
            chargebackConfirmationModalContentWrapper = (customAttrs) => {
                const wrapper = {
                    view: function(ctrl, args) {
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
                                            m('span', item.user_name)
                                        ]),
                                        m('.w-col.w-col-2', [
                                            m('span', `${h.formatNumber(item.value, 2, 3)}`)
                                        ]),
                                        m('.w-col.w-col-3', [
                                            m('span', item.project_name)
                                        ]),
                                    ])
                                ])),
                                m('.w-row.fontweight-semibold.divider', [
                                    m('.w-col.w-col-6', 'Total'),
                                    m('.w-col.w-col-3', `R$ ${h.formatNumber(_.reduce(toChargebackCollection(), (t, i) => t + i.value, 0), 2, 3)}`)
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
                if (chargebackIds() != undefined && chargebackIds() != '') {
                    searchChargebackLoader(true);
                    m.redraw();
                    toChargebackListVM.pageSize(30);
                    toChargebackListVM.getPageWithToken({ gateway: 'eq.Pay me', gateway_id: `in.(${generateIdsToData().join(',')})` }).then((data) => {
                        toChargebackCollection(data);
                        searchChargebackLoader(false);
                        displayChargebackConfirmationModal(true);
                        m.redraw();
                        toChargebackListVM.pageSize(10);
                    });
                }
            },
            processChargebacks = () => {
                if (generateIdsToData() != null && generateIdsToData().length >= 0) {
                    processChargebacksLoader(true);
                    m.redraw();
                    m.request({
                        method: 'POST',
                        url: '/admin/contributions/batch_chargeback',
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
                                (processChargebacksLoader()
                                    ? h.loader()
                                    : m('form', {onsubmit: searchToChargebackPayments }, [
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
                label: 'Support'
            },
            submit
        };
    },

    view: function(ctrl) {
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
            m('#admin-root-contributions', [
                m.component(adminFilter, {
                    form: ctrl.filterVM.formDescriber,
                    filterBuilder: ctrl.filterBuilder,
                    submit: ctrl.submit
                }),
                m.component(adminList, {
                    vm: ctrl.listVM,
                    listItem: adminContributionItem,
                    listDetail: adminContributionDetail
                })
            ])
        ]);
    }
};

export default adminContributions;
