/**
 * window.c.projectReportInfringesIntellectulaProperty component
 * Render project report form
 *
 */
import m from 'mithril';
import _ from 'underscore';
import { catarse } from '../api';
import models from '../models';
import h from '../h';
import inlineError from './inline-error';

const projectReportInfringesIntellectualProperty = {
    controller: function(args) {
        const formName = 'report-infringes-intellectual-property',
            relationWithViolatedPropertyError = m.prop(false),
            fullNameError = m.prop(false),
            fullAddressError = m.prop(false),
            projectInfringesError = m.prop(false),
            detailsError = m.prop(false),
            termsAgreedError = m.prop(false),
            validate = () => {
                relationWithViolatedPropertyError(_.isEmpty(args.relationWithViolatedProperty()));
                fullNameError(_.isEmpty(args.fullName()));
                fullAddressError(_.isEmpty(args.fullAddress()));
                projectInfringesError(_.isEmpty(args.projectInfringes()));
                detailsError(_.isEmpty(args.details()));
                termsAgreedError(!args.termsAgreed());

                if (!relationWithViolatedPropertyError() &&
                          !fullNameError() &&
                          !fullAddressError() &&
                          !projectInfringesError() &&
                          !detailsError() &&
                          !termsAgreedError()
                     ) {
                    args.reason('This project infringes intellectual property');
                    return true;
                }
                return false;
            };

        return {
            formName: args.formName || formName,
            relationWithViolatedPropertyError,
            fullNameError,
            fullAddressError,
            projectInfringesError,
            detailsError,
            termsAgreedError,
            sendReport: args.sendReport.bind(args.sendReport, validate)
        };
    },
    view: function(ctrl, args) {
        const assertError = (condition, message) => condition ? m(inlineError, { message }) : '';

        return m('.card.u-radius.u-margintop-20',
	               m('.w-form',
		               [
			                 m('form', {
                     onsubmit: ctrl.sendReport,
                     config: ctrl.checkScroll
                 },
				                 [
					                   m('.report-option.w-radio',
						                   [
							                     m('input.w-radio-input[type=\'radio\']', {
                         value: ctrl.formName,
                         onchange: m.withAttr('value', args.displayFormWithName),
                         checked: args.displayFormWithName() === ctrl.formName
                     }),
							                     m('label.fontsize-small.fontweight-semibold.w-form-label', {
                         onclick: () => args.displayFormWithName(ctrl.formName)
                     }, 'This project infringes intellectual property')
						                   ]
					                    ),
					                   m('.fontsize-smaller.fontcolor-secondary',
						                   'The project is in some way infringing its intellectual property rights.'
					                    ),
					                   m('.u-margintop-30', {
                       style: {
                           display: args.displayFormWithName() === ctrl.formName ? 'block' : 'none'
                       }
                   },
						                   [
							                     m('.u-marginbottom-30',
								                     [
									                       m('.fontsize-smaller.fontweight-semibold.u-marginbottom-10',
										                       'Your relationship to the property being violated *'
									                        ),
									                       m('.fontsize-smaller.fontcolor-secondary.u-marginbottom-10.card.u-radius.card-message',
										                       [
											                         m('span.fontweight-bold',
												                         'Important:'
											                          ),
											                         'The complaint must be made by the',
											                         m.trust('&nbsp;'),
											                         'person, company or legal guardian',
											                         m.trust('&nbsp;'),
											                         'by the right involved. If this is not your case, please notify the owner of the property that you believe is being violated.'
										                       ]
									                        ),
									                       m('.u-marginbottom-10.w-radio',
										                       [
											                         m('input.w-radio-input[type=\'radio\']', {
                             value: 'Sou dono dos direitos',
                             checked: args.relationWithViolatedProperty() === 'I own the rights',
                             onchange: m.withAttr('value', args.relationWithViolatedProperty)
                         }),
											                         m('label.fontsize-smaller.w-form-label', {
                             onclick: () => args.relationWithViolatedProperty('I own the rights')
                         }, 'I own the rights')
										                       ]
									                        ),
									                       m('.u-marginbottom-10.w-radio',
										                       [
											                         m('input.w-radio-input[type=\'radio\']', {
                             value: 'I represent the rights holder.',
                             checked: args.relationWithViolatedProperty() === 'I represent the rights holder.',
                             onchange: m.withAttr('value', args.relationWithViolatedProperty)
                         }),
											                         m('label.fontsize-smaller.w-form-label', {
                             onclick: () => args.relationWithViolatedProperty('I represent the rights holder.')
                         }, 'I represent the rights holder.')
										                       ]
									                        ),
                             assertError(ctrl.relationWithViolatedPropertyError(), 'Indicate your relationship to the violated property')
								                     ]
							                      ),
							                     m('.fontsize-smaller.fontweight-semibold',
								                     'Full name *'
							                      ),
							                     m('input.text-field.positive.w-input[maxlength=\'256\'][type=\'text\']', {
                         onchange: m.withAttr('value', args.fullName),
                         class: {
                             error: ctrl.fullNameError()
                         }
                     }),
                           assertError(ctrl.fullNameError(), 'Enter your full name'),
							                     m('.w-row',
								                     [
									                       m('._w-sub-col.w-col.w-col-6',
										                       [
											                         m('.fontsize-smaller.fontweight-semibold',
												                         'CPF'
											                          ),
											                         m('input.text-field.positive.w-input[maxlength=\'256\'][type=\'text\']', {
                             onchange: m.withAttr('value', args.CPF)
                         })
										                       ]
									                        ),
									                       m('.w-col.w-col-6',
										                       [
											                         m('.fontsize-smaller.fontweight-semibold',
												                         'Telefone'
											                          ),
											                         m('input.text-field.positive.w-input[maxlength=\'256\'][type=\'text\']', {
                             onchange: m.withAttr('value', args.telephone)
                         })
										                       ]
									                        )
								                     ]
							                      ),
							                     m('.w-row',
								                     [
									                       m('._w-sub-col.w-col.w-col-6',
										                       [
											                         m('.fontsize-smaller.fontweight-semibold',
												                         'Company name (if applicable)'
											                          ),
											                         m('input.text-field.positive.w-input[maxlength=\'256\'][type=\'text\']', {
                             onchange: m.withAttr('value', args.businessName)
                         })
										                       ]
									                        ),
									                       m('.w-col.w-col-6',
										                       [
											                         m('.fontsize-smaller.fontweight-semibold',
												                         'CNPJ (if applicable)'
											                          ),
											                         m('input.text-field.positive.w-input[maxlength=\'256\'][type=\'text\']', {
                             onchange: m.withAttr('value', args.CNPJ)
                         })
										                       ]
									                        )
								                     ]
							                      ),
							                     m('.w-row',
								                     [
									                       m('._w-sub-col.w-col.w-col-6',
										                       [
											                         m('.fontsize-smaller.fontweight-semibold',
												                         'Position (if applicable)'
											                          ),
											                         m('input.text-field.positive.w-input[maxlength=\'256\'][type=\'text\']', {
                             onchange: m.withAttr('value', args.businessRole)
                         })
										                       ]
									                        ),
									                       m('.w-col.w-col-6')
								                     ]
							                      ),
							                     m('.fontsize-smaller.fontweight-semibold',
								                     'Complete address *'
							                      ),
							                     m('input.text-field.positive.w-input[maxlength=\'256\'][type=\'text\']', {
                         onchange: m.withAttr('value', args.fullAddress),
                         class: {
                             error: ctrl.fullAddressError()
                         }
                     }),
                           assertError(ctrl.fullAddressError(), 'Enter your full address'),
							                     m('.fontsize-smaller.fontweight-semibold',
								                     'This project is infringing *'
							                      ),
							                     m('select.text-field.positive.w-select', {
                         onchange: m.withAttr('value', args.projectInfringes),
                         class: {
                             error: ctrl.projectInfringesError()
                         }
                     },
								                     [
									                       m('option[value=\'\']',
										                       'select an option'
									                        ),
									                       m('option[value=\'Brands\']',
										                       'Brands'
									                        ),
									                       m('option[value=\'Patents\']',
										                       'Patents'
									                        ),
									                       m('option[value=\'Industrial draw\']',
										                       'Industrial draw'
									                        ),
									                       m('option[value=\'Copyright\']',
										                       'Copyright'
									                        ),
									                       m('option[value=\'Software rights\']',
										                       'Software rights'
									                        ),
									                       m('option[value=\'Industrial model\']',
										                       'Industrial model'
									                        )
								                     ]
							                      ),
                           assertError(ctrl.projectInfringesError(), 'Indicate an option'),
							                     m('.u-marginbottom-30',
								                     [
									                       m('.fontsize-smaller.fontweight-semibold',
										                       'Details of the complaint *'
									                        ),
									                       m('textarea.text-field.positive.w-input[maxlength=\'5000\']', {
                           onchange: m.withAttr('value', args.details),
                           placeholder: 'Please give more details to help us identify the problem',
                           class: {
                               error: ctrl.detailsError()
                           }
                       }),
                             assertError(ctrl.detailsError(), 'Please report the complaint details')
								                     ]
							                      ),
                                   /*
							                     m('.u-marginbottom-30',
								                     [
									                       m('.fontsize-smaller.fontweight-semibold',
										                       'Corroborative documents'
									                        ),
									                       m('.fontsize-smaller.fontcolor-secondary',
										                       'Upload documents that can help with reporting. If you have more than 01 document, please put all in a single compressed file.'
									                        )
								                     ]
							                      ), */
							                     m('.u-marginbottom-40',
								                     [
									                       m('.w-checkbox',
										                       [
											                         m('input.w-checkbox-input[id=\'checkbox\'][type=\'checkbox\']', {
                             value: args.termsAgreed(),
                             onchange: () => args.termsAgreed(!args.termsAgreed()),
                             checked: args.termsAgreed()
                         }),
											                         m('label.fontsize-smaller.w-form-label[for=\'checkbox\']',
												                         'I assure you, with the knowledge that sending complaints with misleading content may be punishable by law, that the information I provide here is true.'
											                          )
										                       ]
									                        ),
                             assertError(ctrl.termsAgreedError(), 'Please confirm the field above to send the report')
								                     ]
							                      ),
							                     m('input.btn.btn-medium.btn-inline.btn-dark.w-button[type=\'submit\'][value=\'Send Complaint\']', {
                         disabled: args.submitDisabled()
                     })
						                   ]
					                    )
				                 ]
			                  )
		               ]
	                )
                );
    }
};

export default projectReportInfringesIntellectualProperty;
