/**
  * window.c.projectReportDisrespectRules component
  * Render project report form
  *
  */
import m from 'mithril';
import _ from 'underscore';
import models from '../models';
import h from '../h';
import inlineError from './inline-error';

const projectReportDisrespectRules = {
    controller: function(args) {
        const formName = 'report-disrespect-rules';
        const reasonError = m.prop(false);
        const detailsError = m.prop(false);
        const validate = () => {
            let ok = true;
            detailsError(false);
            reasonError(false);
            if (_.isEmpty(args.reason())) {
                reasonError(true);
                ok = false;
            }
            if (_.isEmpty(args.details())) {
                detailsError(true);
                ok = false;
            }
            return ok;
        };

        return {
            formName: args.formName || formName,
            reasonError,
            detailsError,
            sendReport: args.sendReport.bind(args.sendReport, validate),
        };
    },
    view: function(ctrl, args) {
        return m('.card.u-radius.u-margintop-20',
          m('.w-form',
            m('form', {
                onsubmit: ctrl.sendReport,
                config: args.checkScroll
            },
                [
                    m('.report-option.w-radio',
                        [
                            m('input.w-radio-input[type=\'radio\']', {
                                value: ctrl.formName,
                                checked: args.displayFormWithName() === ctrl.formName,
                                onchange: m.withAttr('value', args.displayFormWithName)
                            }),
                            m('label.fontsize-small.fontweight-semibold.w-form-label[for=\'radio\']', {
                                onclick: _ => args.displayFormWithName(ctrl.formName)
                            }, 'This project violates our rules..')
                        ]
                   ),
                    m('.fontsize-smaller.fontcolor-secondary',
                        [
                            'All projects in Trend Notion need to respect our ',
                            m('a.alt-link.fontweight-semibold[href=\'http://suporte.catarse.me/hc/pt-br/articles/202387638\'][target=\'_blank\']',
                          'Project Creation Guidelines'
                         ),
                            ', among them do not offer forbidden rewards, do not abuse SPAM, do not use explicit sex scenes or nudity without authorization.'
                        ]
                   ),
                    m('.u-margintop-30', {
                        style: {
                            display: args.displayFormWithName() === ctrl.formName ? 'block' : 'none'
                        }
                    },
                        [
                            m('select.text-field.positive.w-select[required=\'required\']', {
                                onchange: m.withAttr('value', args.reason),
                                class: {
                                    error: ctrl.reasonError()
                                }
                            },
                                [
                                    m('option[value=\'\']',
                                'Select a reason'
                               ),
                                    m('option[value=\'Forbidden Rewards\']',
                                'Forbidden Rewards'
                               ),
                                    m('option[value=\'Slander, libel, defamation or discrimination\']',
                                'Slander, libel, defamation or discrimination'
                               ),
                                    m('option[value=\'Scope of Prohibited Project\']',
                                'Scope of Prohibited Project'
                               ),
                                    m('option[value=\'Explicit free sex scenes\']',
                                'Explicit free sex scenes'
                               ),
                                    m('option[value=\'Disclosure of nudity materials without authorization\']',
                                'Disclosure of nudity materials without authorization'
                               )
                                ]
                         ),
                        (
                            ctrl.reasonError() ? m(inlineError, { message: 'Select a reason' }) : ''
                        ),
                            m('.u-marginbottom-40',
                                [
                                    m('.fontsize-smaller.fontweight-semibold',
                                'Details of the complaint *'
                               ),
                                    m('textarea.text-field.positive.w-input[maxlength=\'5000\'][required=\'required\']', {
                                        onchange: m.withAttr('value', args.details),
                                        placeholder: 'Please give more details to help us identify the problem',
                                        class: {
                                            error: ctrl.detailsError()
                                        }
                                    }),
                              (
                                    ctrl.detailsError() ? m(inlineError, { message: 'Please report the complaint details' }) : ''
                              )
                                ]
                         ),
                            m('input.btn.btn-medium.btn-inline.btn-dark.w-button[type=\'submit\'][value=\'Send Complaint\']', {
                                disabled: args.submitDisabled()
                            })
                        ]
                   )
                ]
             )
           ));
    }
};

export default projectReportDisrespectRules;
