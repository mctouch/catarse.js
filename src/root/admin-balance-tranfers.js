import m from 'mithril';
import h from '../h';
import _ from 'underscore';
import balanceTransferListVM from '../vms/balance-transfer-list-vm';
import balanceTransferFilterVM from '../vms/balance-transfer-filter-vm';
import adminList from '../c/admin-list';
import adminFilter from '../c/admin-filter';
import filterMain from '../c/filter-main';
import filterDropdown from '../c/filter-dropdown';
import filterDateRange from '../c/filter-date-range';
import filterNumberRange from '../c/filter-number-range';
import modalBox from '../c/modal-box';
import adminBalanceTransferItem from '../c/admin-balance-transfer-item';
import adminBalanceTransferItemDetail from '../c/admin-balance-transfer-item-detail';

const adminBalanceTranfers = {
    controller: function(args) {
        const listVM = balanceTransferListVM,
            filterVM = balanceTransferFilterVM(),
            authorizedListVM = balanceTransferListVM,
            authorizedFilterVM = balanceTransferFilterVM(),
            authorizedCollection = m.prop([]),
            error = m.prop(''),
            selectedAny = m.prop(false),
            filterBuilder = [
                {
                    component: filterMain,
                    data: {
                        vm: filterVM.full_text_index,
                        placeholder: 'Search for email, user ids, transfer ids, and balance events'
                    }
                },
                {
                    component: filterDropdown,
                    data: {
                        label: 'Status',
                        name: 'state',
                        vm: filterVM.state,
                        options: [{
                            value: '',
                            option: 'Any'
                        }, {
                            value: 'pending',
                            option: 'Pendant'
                        }, {
                            value: 'authorized',
                            option: 'Authorized'
                        }, {
                            value: 'processing',
                            option: 'Processing'
                        }, {
                            value: 'transferred',
                            option: 'Concluded'
                        }, {
                            value: 'error',
                            option: 'Error'
                        }, {
                            value: 'rejected',
                            option: 'Rejected'
                        }, {
                            value: 'gateway_error',
                            option: 'Gateway error'
                        }]
                    }
                },
                {
                    component: filterDateRange,
                    data: {
                        label: 'Request date',
                        first: filterVM.created_date.gte,
                        last: filterVM.created_date.lte
                    }

                },
                {
                    component: filterDateRange,
                    data: {
                        label: 'Date of confirmation',
                        first: filterVM.transferred_date.gte,
                        last: filterVM.transferred_date.lte
                    }

                },
                {
                    component: filterNumberRange,
                    data: {
                        label: 'Values ​​between',
                        first: filterVM.amount.gte,
                        last: filterVM.amount.lte
                    }
                }
            ],
            selectedItemsIDs = m.prop([]),
            displayApprovalModal = h.toggleProp(false, true),
            displayManualModal = h.toggleProp(false, true),
            displayRejectModal = h.toggleProp(false, true),
            displayProcessTransfer = h.toggleProp(false, true),
            processingTranfersLoader = h.toggleProp(false, true),
            selectAllLoading = m.prop(false),
            redrawProp = m.prop(false),
            actionMenuToggle = h.toggleProp(false, true),
            isSelected = item_id => _.find(selectedItemsIDs(), i => i.id == item_id),
            selectItem = (item) => {
                if (!_.find(selectedItemsIDs(), i => i.id == item.id)) {
                    selectedItemsIDs().push(item);
                }
                selectedAny(true);
            },
            unSelectItem = (item) => {
                const newIDs = _.reject(selectedItemsIDs(), i => i.id == item.id);
                selectedItemsIDs(newIDs);
                if (_.isEmpty(newIDs)) {
                    selectedAny(false);
                }
            },
            loadAuthorizedBalances = () => {
                authorizedFilterVM.state('authorized');
                authorizedFilterVM.getAllBalanceTransfers(authorizedFilterVM).then((data) => {
                    authorizedCollection(data);
                    m.redraw();
                });
            },
            submit = () => {
                error(false);
                listVM.firstPage(filterVM.parameters()).then(null, (serverError) => {
                    error(serverError.message);
                });

                return false;
            },
            generateWrapperModal = (customAttrs) => {
                const wrapper = {
                    view: function(ctrl, args) {
                        actionMenuToggle(false);
                        return m('', [
                            m('.modal-dialog-header', [
                                m('.fontsize-large.u-text-center', args.modalTitle)
                            ]),
                            m('.modal-dialog-content', [
                                m('.w-row.fontweight-semibold', [
                                    m('.w-col.w-col-6', 'Nome'),
                                    m('.w-col.w-col-3', 'Valor'),
                                    m('.w-col.w-col-3', 'Solicitado em'),
                                ]),
                                _.map(selectedItemsIDs(), (item, index) => m('.divider.fontsize-smallest.lineheight-looser', [
                                    m('.w-row', [
                                        m('.w-col.w-col-6', [
                                            m('span', item.user_name)
                                        ]),
                                        m('.w-col.w-col-3', [
                                            m('span', `R$ ${h.formatNumber(item.amount, 2, 3)}`)
                                        ]),
                                        m('.w-col.w-col-3', [
                                            m('span', h.momentify(item.created_at))
                                        ]),
                                    ])
                                ])),
                                m('.w-row.fontweight-semibold.divider', [
                                    m('.w-col.w-col-6', 'Total'),
                                    m('.w-col.w-col-3',
                                        `R$ ${h.formatNumber(_.reduce(selectedItemsIDs(), (t, i) => t + i.amount, 0), 2, 3)}`),
                                    m('.w-col.w-col-3'),
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
            manualTransferSelectedIDs = () => {
                m.request({
                    method: 'POST',
                    url: '/admin/balance_transfers/batch_manual',
                    data: {
                        transfer_ids: _.uniq(_.map(selectedItemsIDs(), s => s.id))
                    },
                    config: h.setCsrfToken
                }).then((data) => {
                    selectedItemsIDs([]);
                    listVM.firstPage(filterVM.parameters());
                    displayManualModal(false);
                    m.redraw();
                });
            },
            approveSelectedIDs = () => {
                m.request({
                    method: 'POST',
                    url: '/admin/balance_transfers/batch_approve',
                    data: {
                        transfer_ids: _.uniq(_.map(selectedItemsIDs(), s => s.id))
                    },
                    config: h.setCsrfToken
                }).then((data) => {
                    selectedItemsIDs([]);
                    listVM.firstPage(filterVM.parameters());
                    loadAuthorizedBalances();
                    displayApprovalModal(false);
                    m.redraw();
                });
            },
            processAuthorizedTransfers = () => {
                processingTranfersLoader(true);
                m.redraw();
                m.request({
                    method: 'POST',
                    url: '/admin/balance_transfers/process_transfers',
                    data: {},
                    config: h.setCsrfToken
                }).then((data) => {
                    listVM.firstPage(filterVM.parameters());
                    loadAuthorizedBalances();
                    displayProcessTransfer(false);
                    processingTranfersLoader(false);
                    m.redraw();
                });
            },
            rejectSelectedIDs = () => {
                m.request({
                    method: 'POST',
                    url: '/admin/balance_transfers/batch_reject',
                    data: {
                        transfer_ids: _.uniq(_.map(selectedItemsIDs(), s => s.id))
                    },
                    config: h.setCsrfToken
                }).then((data) => {
                    selectedItemsIDs([]);
                    displayRejectModal(false);
                    listVM.firstPage();
                    m.redraw();
                });
            },
            unSelectAll = () => {
                selectedItemsIDs([]);
                selectedAny(false);
            },
            selectAll = () => {
                selectAllLoading(true);
                m.redraw();
                filterVM.getAllBalanceTransfers(filterVM).then((data) => {
                    _.map(_.where(data, { state: 'pending' }), selectItem);
                    selectAllLoading(false);
                    m.redraw();
                });
            },
            inputActions = () => {
                const authorizedSum = h.formatNumber(_.reduce(authorizedCollection(), (memo, item) => memo + item.amount, 0), 2, 3);
                return m('', [
                    m('button.btn.btn-inline.btn-small.btn-terciary.u-marginright-20.w-button', { onclick: selectAll }, (selectAllLoading() ? 'Loading...' : 'Select all')),
                      (selectedItemsIDs().length > 1 ? m('button.btn.btn-inline.btn-small.btn-terciary.u-marginright-20.w-button', { onclick: unSelectAll }, `Deselect All (${selectedItemsIDs().length})`) : ''),
                      (selectedAny() ?
                       m('.w-inline-block', [
                           m('button.btn.btn-inline.btn-small.btn-terciary.w-button', {
                               onclick: actionMenuToggle.toggle
                           }, [
                               `Mark as (${selectedItemsIDs().length})`,
                           ]),
                           (actionMenuToggle() ?
                            m('.card.dropdown-list.dropdown-list-medium.u-radius.zindex-10[id=\'transfer\']', [
                                m('a.dropdown-link.fontsize-smaller[href=\'javascript:void(0);\']', {
                                    onclick: event => displayApprovalModal.toggle()
                                }, 'Approved'),
                                m('a.dropdown-link.fontsize-smaller[href=\'javascript:void(0);\']', {
                                    onclick: event => displayManualModal.toggle()
                                }, 'Manual transfer'),
                                m('a.dropdown-link.fontsize-smaller[href=\'javascript:void(0);\']', {
                                    onclick: event => displayRejectModal.toggle()
                                }, 'Refused')
                            ]) : '')
                       ]) : ''),
                      (authorizedCollection().length > 0 ? m('._w-inline-block.u-right', [
                          m('button.btn.btn-small.btn-inline', {
                              onclick: displayProcessTransfer.toggle
                          }, `Review approved withdrawals(${authorizedCollection().length})`),
                          (displayProcessTransfer() ? m('.dropdown-list.card.u-radius.dropdown-list-medium.zindex-10', [
                              m('.w-form', [
                                  (processingTranfersLoader() ? h.loader() : m('form', [
                                      m('label.fontsize-smaller.umarginbottom-20', `Are you sure you want to review ${authorizedCollection().length} approved withdrawals (total R$ ${authorizedSum}) ?`),
                                      m('button.btn.btn-small', {
                                          onclick: processAuthorizedTransfers
                                      }, 'Review approved withdrawals')
                                  ]))
                              ])
                          ]) : '')
                      ]) : '')
                ]);
            };

        loadAuthorizedBalances();

        return {
            displayApprovalModal,
            displayRejectModal,
            displayManualModal,
            displayProcessTransfer,
            authorizedCollection,
            generateWrapperModal,
            approveSelectedIDs,
            manualTransferSelectedIDs,
            processAuthorizedTransfers,
            rejectSelectedIDs,
            filterVM,
            filterBuilder,
            listVM: {
                hasInputAction: true,
                inputActions,
                list: listVM,
                selectedItemsIDs,
                selectItem,
                unSelectItem,
                selectedAny,
                isSelected,
                redrawProp,
                error
            },
            data: {
                label: 'Orders for service'
            },
            submit
        };
    },
    view: function(ctrl, args) {
        return m('', [
            m(adminFilter, {
                filterBuilder: ctrl.filterBuilder,
                submit: ctrl.submit
            }),
            (ctrl.displayApprovalModal() ? m(modalBox, {
                displayModal: ctrl.displayApprovalModal,
                content: ctrl.generateWrapperModal({
                    modalTitle: 'Approve sacks',
                    ctaText: 'Approve',
                    displayModal: ctrl.displayApprovalModal,
                    onClickCallback: ctrl.approveSelectedIDs
                })
            }) : ''),
            (ctrl.displayManualModal() ? m(modalBox, {
                displayModal: ctrl.displayManualModal,
                content: ctrl.generateWrapperModal({
                    modalTitle: 'Manual transfer of serves',
                    ctaText: 'Approve',
                    displayModal: ctrl.displayManualModal,
                    onClickCallback: ctrl.manualTransferSelectedIDs
                })
            }) : ''),
            (ctrl.displayRejectModal() ? m(modalBox, {
                displayModal: ctrl.displayRejectModal,
                content: ctrl.generateWrapperModal({
                    modalTitle: 'Reject withdrawals',
                    ctaText: 'Reject',
                    displayModal: ctrl.displayRejectModal,
                    onClickCallback: ctrl.rejectSelectedIDs
                })
            }) : ''),
            m(adminList, {
                vm: ctrl.listVM,
                listItem: adminBalanceTransferItem,
                listDetail: adminBalanceTransferItemDetail
            })
        ]);
    }
};

export default adminBalanceTranfers;
