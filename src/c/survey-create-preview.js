import m from 'mithril';
import _ from 'underscore';
import h from '../h';
import rewardCardBig from './reward-card-big';

const I18nScope = _.partial(h.i18nScope, 'activerecord.attributes.address');

const surveyCreatePreview = {
    controller: function(args) {
        const openQuestions = _.filter(args.surveyVM.dashboardQuestions(), { type: 'open' }),
            multipleChoiceQuestions = _.filter(args.surveyVM.dashboardQuestions(), { type: 'multiple' });
        const togglePreview = () => {
            args.showPreview.toggle();
            h.scrollTop();
        };

        return {
            togglePreview,
            multipleChoiceQuestions,
            openQuestions
        };
    },
    view: function(ctrl, args) {
        return m('.section.u-marginbottom-40',
            m('.section.u-text-center',
                m('.w-container',
                    m('.w-row', [
                        m('.w-col.w-col-2'),
                        m('.w-col.w-col-8', [
                            m('.fontsize-larger.fontweight-semibold.lineheight-looser',
                                'Review the questionnaire'
                            ),
                            m('.fontsize-base',
                                'Your supporters will receive a link to the questionnaire below by email. See if everything is correct before sending it!'
                            )
                        ]),
                        m('.w-col.w-col-2')
                    ])
                )
            ),


            m('.section',
                m('.w-container',
                    m('.w-row', [
                        m('.w-col.w-col-1'),
                        m('.w-col.w-col-10',
                            m('.card.card-terciary.medium.u-marginbottom-30', [
                                (args.confirmAddress ?
                                m('.u-marginbottom-30.w-form', [
                                    m('.fontcolor-secondary.fontsize-base.fontweight-semibold',
                                        'Reward delivery address'
                                    ),
                                    m('.fontcolor-secondary.fontsize-smaller.u-marginbottom-30',
                                        'To where Directors name should send your reward when you are ready.'
                                    ),
                                    m('form', [
                                        m('.w-row', [
                                            m('.w-sub-col.w-col.w-col-6', [
                                                m('label.field-label.fontweight-semibold',
                                                    'country / Country'
                                                ),
                                                m('select.positive.text-field.w-select', [
                                                    m("option[value='']",
                                                        'Select...'
                                                    )
                                                ])
                                            ]),
                                            m('.w-col.w-col-6',
                                                m('.w-row', [
                                                    m('.w-sub-col-middle.w-col.w-col-6.w-col-small-6.w-col-tiny-6'),
                                                    m('.w-col.w-col-6.w-col-small-6.w-col-tiny-6')
                                                ])
                                            )
                                        ]),
                                        m('div', [
                                            m('label.field-label.fontweight-semibold',
                                                'Street'
                                            ),
                                            m("input.positive.text-field.w-input[type='email']")
                                        ]),
                                        m('.w-row', [
                                            m('.w-sub-col.w-col.w-col-4', [
                                                m('label.field-label.fontweight-semibold',
                                                    'Number'
                                                ),
                                                m("input.positive.text-field.w-input[type='email']")
                                            ]),
                                            m('.w-sub-col.w-col.w-col-4', [
                                                m('label.field-label.fontweight-semibold',
                                                    'Complement'
                                                ),
                                                m("input.positive.text-field.w-input[type='email']")
                                            ]),
                                            m('.w-col.w-col-4', [
                                                m('label.field-label.fontweight-semibold',
                                                    'Neighborhood'
                                                ),
                                                m("input.positive.text-field.w-input[type='email']")
                                            ])
                                        ]),
                                        m('.w-row', [
                                            m('.w-sub-col.w-col.w-col-4', [
                                                m('label.field-label.fontweight-semibold',
                                                    'CEP'
                                                ),
                                                m("input.positive.text-field.w-input[type='email']")
                                            ]),
                                            m('.w-sub-col.w-col.w-col-4', [
                                                m('label.field-label.fontweight-semibold',
                                                    'City'
                                                ),
                                                m("input.positive.text-field.w-input[type='email']")
                                            ]),
                                            m('.w-col.w-col-4', [
                                                m('label.field-label.fontweight-semibold',
                                                    'State'
                                                ),
                                                m('select.positive.text-field.w-select', [
                                                    m("option[value='']",
                                                        'Select...'
                                                    )
                                                ])
                                            ])
                                        ]),
                                        m('.w-row', [
                                            m('.w-sub-col.w-col.w-col-6', [
                                                m('label.field-label.fontweight-semibold',
                                                    'telephone'
                                                ),
                                                m("input.positive.text-field.w-input[type='email']")
                                            ]),
                                            m('.w-col.w-col-6')
                                        ])
                                    ])
                                ]) : ''),

                                _.map(ctrl.multipleChoiceQuestions, question =>
                                m('.u-marginbottom-30.w-form', [
                                    m('.fontcolor-secondary.fontsize-base.fontweight-semibold',
                                      question.question
                                    ),
                                    m('.fontcolor-secondary.fontsize-smaller.u-marginbottom-20',
                                      question.description
                                    ),
                                    m('form', [
                                        _.map(question.survey_question_choices_attributes(), choice =>
                                        m('.fontsize-small.w-radio', [
                                            m("input.w-radio-input[type='radio'][value='Radio']"),
                                            m('label.w-form-label',
                                              choice.option
                                            )
                                        ]))
                                    ])
                                ])),
                                _.map(ctrl.openQuestions, question =>
                                m('.u-marginbottom-30.w-form', [
                                    m('.fontcolor-secondary.fontsize-base.fontweight-semibold',
                                      question.question
                                    ),
                                    m('.fontcolor-secondary.fontsize-smaller.u-marginbottom-20',
                                        question.description
                                    ),
                                    m('form',
                                        m("input.positive.text-field.w-input[placeholder='Your answer'][type='text']")
                                    )
                                ]))
                            ])
                        ),
                        m('.w-col.w-col-1')
                    ])
                )
            ),
            m('.section', [
                m('.u-marginbottom-30.w-row', [
                    m('.w-col.w-col-2'),
                    m('.w-col.w-col-8', [
                        m('.u-marginbottom-30.u-text-center', [
                            m('.fontsize-small.fontweight-semibold.u-marginbottom-10',
                                `The above questionnaire will be sent to ${args.reward.paid_count} reward supporters`
                            ),
                            m(rewardCardBig, { reward: args.reward })
                        ]),
                        m('.card.card-message.fontsize-small.u-marginbottom-30.u-radius', [
                            m('span.fontweight-semibold',
                                'OBS:'
                            ),
                            m.trust('&nbsp;'),
                            'Questions will automatically be resubmitted to those who do not respond within 4 days. If supporters continue without submitting responses, the questionnaire will be resent twice more.'
                        ])
                    ]),
                    m('.w-col.w-col-2')
                ]),
                m('.u-marginbottom-20.w-row', [
                    m('.w-col.w-col-3'),
                    m('.w-sub-col.w-col.w-col-4',
                        m("a.btn.btn-large[href='javascript:void(0);']", { onclick: args.sendQuestions }, [
                            m('span.fa.fa-paper-plane',
                                ''
                            ),
                            ' ',
                            m.trust('&nbsp;'),
                            'Submit'
                        ])
                    ),
                    m('.w-col.w-col-2',
                        m("a.btn.btn-large.btn-terciary[href='javascript:void(0);']", { onclick: ctrl.togglePreview },
                            'Edit'
                        )
                    ),
                    m('.w-col.w-col-3')
                ])
            ])
        );
    }
};

export default surveyCreatePreview;
