import m from 'mithril';
import userVM from '../vms/user-vm';
import { catarse } from '../api';
import _ from 'underscore';
import models from '../models';
import h from '../h';
import popNotification from './pop-notification';
import UserOwnerBox from './user-owner-box';
import inlineError from './inline-error';
import userSettingsVM from '../vms/user-settings-vm';

const userBankForm = {
    controller: function(args) {
        const parsedErrors = args.parsedErrors;
        const fields = args.fields,
            user = args.user,
            bankAccount = m.prop({}),
            banks = m.prop(),
            banksLoader = catarse.loader(models.bank.getPageOptions()),
            showOtherBanks = h.toggleProp(false, true),
            showOtherBanksInput = m.prop(false),
            popularBanks = [{
                id: '51',
                code: '001',
                name: 'Bank of Brazil SA.'
            }, {
                id: '131',
                code: '341',
                name: 'Itaú Unibanco SA.'
            }, {
                id: '122',
                code: '104',
                name: 'Federal Savings Bank'
            }, {
                id: '104',
                code: '033',
                name: 'Banco Santander (Brasil) SA.'
            }, {
                id: '127',
                code: '399',
                name: 'HSBC Bank Brasil SA - Multiple Bank'
            }, {
                id: '23',
                code: '237',
                name: 'Investments'
            }];

        userVM.getUserBankAccount(user.id).then((data) => {
            if (!_.isEmpty(_.first(data))) {
                bankAccount(_.first(data));
                fields.bank_account_id(bankAccount().bank_account_id);
                fields.account(bankAccount().account);
                fields.account_digit(bankAccount().account_digit);
                fields.agency(bankAccount().agency);
                fields.agency_digit(bankAccount().agency_digit);
                fields.bank_id(bankAccount().bank_id);
                fields.bank_account_type(bankAccount().account_type);
                args.bankCode(bankAccount().bank_id);
            } else {
                fields.bank_account_type('account_current');
            }
        });
        banksLoader.load().then(banks);

        return {
            bankInput: args.bankInput,
            bankCode: args.bankCode,
            banks,
            banksLoader,
            showOtherBanksInput,
            showOtherBanks,
            popularBanks,
            bankAccount,
            parsedErrors
        };
    },
    view: function(ctrl, args) {
        let user = args.user,
            fields = args.fields,
            bankAccount = ctrl.bankAccount();
        return m('div', [
            m('.w-row', [
                m(`.w-col.w-col-5.w-sub-col${ctrl.showOtherBanksInput() ? '.w-hidden' : ''}[id='bank_select']`,
                  m('.input.select.required.user_bank_account_bank_id', [
                      m('label.field-label.fontsize-smaller',
                        'Bank'
                       ),
                      m('select.select.required.w-input.text-field.bank-select.positive[id=\'user_bank_account_attributes_bank_id\']', {
                          name: 'user[bank_account_attributes][bank_id]',
                          class: ctrl.parsedErrors.hasError('bank_id') ? 'error' : false,
                          onchange: (e) => {
                              m.withAttr('value', ctrl.bankCode)(e);
                              ctrl.showOtherBanksInput(ctrl.bankCode() == '0');
                          }
                      }, [
                          m('option[value=\'\']', {
                              selected: fields.bank_id() === ''
                          }),
                          (_.map(ctrl.popularBanks, bank => (fields.bank_id() != bank.id ? m(`option[value='${bank.id}']`, {
                              selected: fields.bank_id() == bank.id
                          },
                                                                                             `${bank.code} . ${bank.name}`) : ''))),
                          (fields.bank_id() === '' || _.find(ctrl.popularBanks, bank => bank.id === fields.bank_id()) ? '' :
                           m(`option[value='${fields.bank_id()}']`, {
                               selected: true
                           },
                             `${bankAccount.bank_code} . ${bankAccount.bank_name}`
                            )
                          ),
                          m('option[value=\'0\']',
                            'Outro'
                           )
                      ]),
                      m('.fontsize-smaller.text-error.u-marginbottom-20.fa.fa-exclamation-triangle.w-hidden[data-error-for=\'user_bank_account_attributes_bank_id\']',
                        ' Select a bank'
                       ),
                      ctrl.parsedErrors.inlineError('bank_id')
                  ])
                 ),
                (ctrl.showOtherBanksInput() ?
                 m('.w-col.w-col-5.w-sub-col',
                   m('.w-row.u-marginbottom-20[id=\'bank_search\']',
                     m('.w-col.w-col-12', [
                         m('.input.string.optional.user_bank_account_input_bank_number', [
                             m('label.field-label.fontsize-smaller',
                               'Bank Number (3 numbers)'
                              ),
                             m('input.string.optional.w-input.text-field.bank_account_input_bank_number[id=\'user_bank_account_attributes_input_bank_number\'][maxlength=\'3\'][size=\'3\'][type=\'text\']', {
                                 name: 'user[bank_account_attributes][input_bank_number]',
                                 value: ctrl.bankInput(),
                                 onchange: m.withAttr('value', ctrl.bankInput)
                             }),
                             m('.fontsize-smaller.text-error.u-marginbottom-20.fa.fa-exclamation-triangle.w-hidden[data-error-for=\'user_bank_account_attributes_input_bank_number\']',

                               ' Invalid bank number'
                              )
                         ]),
                         m('a.w-hidden-small.w-hidden-tiny.alt-link.fontsize-smaller[href=\'javascript:void(0);\'][id=\'show_bank_list\']', {
                             onclick: ctrl.showOtherBanks.toggle
                         }, [
                             'Search by name  ',
                             m.trust('&nbsp;'),
                             m.trust('&gt;')
                         ]),
                         m('a.w-hidden-main.w-hidden-medium.alt-link.fontsize-smaller[href=\'javascript:void(0);\'][id=\'show_bank_list\']', {
                             onclick: ctrl.showOtherBanks.toggle
                         }, [
                             'Search by name  ',
                             m.trust('&nbsp;'),
                             m.trust('&gt;')
                         ])
                     ])
                    )
                  ) : ''),
                (ctrl.showOtherBanks() ?
                 m('.w-row[id=\'bank_search_list\']',
                   m('.w-col.w-col-12',
                     m('.select-bank-list[data-ix=\'height-0-on-load\']', {
                         style: {
                             height: '395px'
                         }
                     },
                       m('.card.card-terciary', [
                           m('.fontsize-small.fontweight-semibold.u-marginbottom-10.u-text-center',
                             'Select your bank below'
                            ),
                           m('.fontsize-smaller', [
                               m('.w-row.card.card-secondary.fontweight-semibold', [
                                   m('.w-col.w-col-3.w-col-small-3.w-col-tiny-3',
                                     m('div',
                                       'Number'
                                      )
                                    ),
                                   m('.w-col.w-col-9.w-col-small-9.w-col-tiny-9',
                                     m('div',
                                       'Name'
                                      )
                                    )
                               ]),
                               (!_.isEmpty(ctrl.banks()) ?
                                _.map(ctrl.banks(), bank => m('.w-row.card.fontsize-smallest', [
                                    m('.w-col.w-col-3.w-col-small-3.w-col-tiny-3',
                                      m(`a.link-hidden.bank-resource-link[data-code='${bank.code}'][data-id='${bank.id}'][href='javascript:void(0)']`, {
                                          onclick: () => {
                                              ctrl.bankInput(bank.code);
                                              ctrl.showOtherBanks.toggle();
                                          }
                                      },
                                        bank.code
                                       )
                                     ),
                                    m('.w-col.w-col-9.w-col-small-9.w-col-tiny-9',
                                      m(`a.link-hidden.bank-resource-link[data-code='${bank.code}'][data-id='${bank.id}'][href='javascript:void(0)']`, {
                                          onclick: () => {
                                              ctrl.bankInput(bank.code);
                                              ctrl.showOtherBanks.toggle();
                                          }
                                      },
                                        `${bank.code} . ${bank.name}`
                                       )
                                     )
                                ])) : '')
                           ])
                       ])
                      )
                    )
                  ) : ''),
                m('.w-col.w-col-7',
                  m('.w-row', [
                      m('.w-col.w-col-7.w-col-small-7.w-col-tiny-7.w-sub-col-middle', [
                          m('label.text.required.field-label.field-label.fontweight-semibold.force-text-dark.fontsize-smaller[for=\'user_bank_account_attributes_agency\']',
                            'Agency'
                           ),
                          m('input.string.required.w-input.text-field.positive[id=\'user_bank_account_attributes_agency\'][type=\'text\']', {
                              value: fields.agency(),
                              class: ctrl.parsedErrors.hasError('agency') ? 'error' : false,
                              name: 'user[bank_account_attributes][agency]',
                              onchange: m.withAttr('value', fields.agency)
                          }),
                          ctrl.parsedErrors.inlineError('agency')
                      ]),
                      m('.w-col.w-col-5.w-col-small-5.w-col-tiny-5', [
                          m('label.text.optional.field-label.field-label.fontweight-semibold.force-text-dark.fontsize-smaller[for=\'user_bank_account_attributes_agency_digit\']',
                            'Agency digit'
                           ),
                          m('input.string.optional.w-input.text-field.positive[id=\'user_bank_account_attributes_agency_digit\'][type=\'text\']', {
                              value: fields.agency_digit(),
                              class: ctrl.parsedErrors.hasError('agency_digit') ? 'error' : false,
                              name: 'user[bank_account_attributes][agency_digit]',
                              onchange: m.withAttr('value', fields.agency_digit)
                          }),
                          ctrl.parsedErrors.inlineError('agency_digit')
                      ])
                  ])
                 )
            ]),
            m('.w-row', [
                m('.w-col.w-col-5.w-sub-col', [
                    m('label.field-label.fontweight-semibold.fontsize-smaller',
                      'Account Type'
                     ),
                    m('.input.select.required.user_bank_account_account_type', [
                        m('select.select.required.w-input.text-field.bank-select.positive[id=\'user_bank_account_attributes_account_type\']', {
                            name: 'user[bank_account_attributes][account_type]',
                            class: ctrl.parsedErrors.hasError('account_type') ? 'error' : false,
                            onchange: m.withAttr('value', fields.bank_account_type)
                        }, [
                            m('option[value=\'account_current\']', {
                                selected: fields.bank_account_type() === 'account_current'
                            }, 'Current account'),
                            m('option[value=\'savings account\']', {
                                Selected: fields.bank_account_type() === 'savings account'
                            }, 'Savings account'),
                            m('option[value=\'account_current_content\']', {
                                selected: fields.bank_account_type() === 'account_current_content'
                            }, 'Joint checking account'),
                            m('option[value=\'account_poupanca_conjunta\']', {
                                selected: fields.bank_account_type() === 'account_poupanca_conjunta'
                            }, 'Joint savings account'),
                        ]),
                        ctrl.parsedErrors.inlineError('account_type')
                    ])
                ]),
                m('.w-col.w-col-7',
                  m('.w-row', [
                      m('.w-col.w-col-7.w-col-small-7.w-col-tiny-7.w-sub-col-middle', [
                          m('label.text.required.field-label.field-label.fontweight-semibold.force-text-dark.fontsize-smaller[for=\'user_bank_account_attributes_account\']',
                            'Account No.'
                           ),
                          m('input.string.required.w-input.text-field.positive[id=\'user_bank_account_attributes_account\'][type=\'text\']', {
                              value: fields.account(),
                              class: ctrl.parsedErrors.hasError('account') ? 'error' : false,
                              onchange: m.withAttr('value', fields.account),
                              name: 'user[bank_account_attributes][account]'
                          }),
                          ctrl.parsedErrors.inlineError('account')
                      ]),
                      m('.w-col.w-col-5.w-col-small-5.w-col-tiny-5', [
                          m('label.text.required.field-label.field-label.fontweight-semibold.force-text-dark.fontsize-smaller[for=\'user_bank_account_attributes_account_digit\']',
                            'Account Digit'
                           ),
                          m('input.string.required.w-input.text-field.positive[id=\'user_bank_account_attributes_account_digit\'][type=\'text\']', {
                              value: fields.account_digit(),
                              class: ctrl.parsedErrors.hasError('account_digit') ? 'error' : false,
                              onchange: m.withAttr('value', fields.account_digit),
                              name: 'user[bank_account_attributes][account_digit]'
                          }),
                          ctrl.parsedErrors.inlineError('account_digit')
                      ])
                  ])
                 )
            ]),
            (bankAccount.bank_account_id ?
             m('input[id=\'user_bank_account_attributes_id\'][type=\'hidden\']', {
                 name: 'user[bank_account_attributes][id]',
                 value: fields.bank_account_id()
             }) : '')
        ]);
    }
};

export default userBankForm;
