/**
 * window.c.cancelProjectModalContent component
 * Render cancel project modal
 *
 */
import m from 'mithril';
import h from '../h';

const cancelProjectModalContent = {
    controller: function(args) {
        const checkError = m.prop(false),
            showRedactor = m.prop(false),
            check = m.prop(''),
            commentHtml = m.prop(''),
            showNextModal = () => {
                if (check() === 'cancel-project') {
                    showRedactor(true);
                } else {
                    checkError(true);
                }
                return false;
            };

        return {
            showNextModal,
            commentHtml,
            showRedactor,
            checkError,
            check
        };
    },

    view: function(ctrl, args) {
        return m(`form.cancel-project-modal.modal-dialog-content[accept-charset='UTF-8'][action='/pt/projects/${args.project.id}'][id='edit_project_${args.project.id}'][method='post'][novalidate='novalidate']`,
            ctrl.showRedactor() ? [
                m("input[name='utf8'][type='hidden'][value='✓']"),
                m("input[name='_method'][type='hidden'][value='patch']"),
                m(`input[name='authenticity_token'][type='hidden'][value='${h.authenticityToken()}']`),
                m("input[id='anchor'][name='anchor'][type='hidden'][value='posts']"),
                m("input[id='cancel_project'][name='cancel_project'][type='hidden'][value='true']"),
                m('.fontsize-smaller.u-marginbottom-20',
                    'Tell me why you're canceling your campaign. Essa mensagem será enviada por email para os seus apoiadores e estará pública na aba "News" do seu projeto no Catarse.'
                ),
                m('.w-form', [
                    m("label.string.required.field-label.field-label.fontweight-semibold[for='project_posts_attributes_0_title']",
                        'Title'
                    ),
                    m("input.string.required.w-input.text-field.w-input.text-field.positive[id='project_posts_attributes_0_title'][name='project[posts_attributes][0][title]'][type='text']"),
                    m("label.string.optional.field-label.field-label.fontweight-semibold[for='project_posts_attributes_0_comment']",
                        'Text'
                    ),
                    h.redactor('project[posts_attributes][0][comment_html]', ctrl.commentHtml)
                ]),
                m('div',
                    m('.w-row', [
                        m('.w-col.w-col-3'),
                        m('.u-text-center.w-col.w-col-6', [
                            m("input.btn.btn-inactive.btn-large.u-marginbottom-20[name='commit'][type='submit'][value='Cancel campaign']"),
                            m(".fontsize-small.link-hidden-light[id='modal-close']", {
                                onclick: args.displayModal.toggle
                            },
                                'Cancel'
                            )
                        ]),
                        m('.w-col.w-col-3')
                    ])
                )
            ] : [
                m('.fontsize-small.u-marginbottom-20', [
                    'Upon cancellation, your campaign will expire and your supporters will be refunded within the next 24 hours.',
                    m('span.fontweight-semibold',
                        'This action can not be undone!'
                    ),
                    m('br'),
                    m('span.fontweight-semibold')
                ]),
                m('.fontsize-small.u-marginbottom-10', [
                    'If you are sure you want to cancel your project, please confirm by writing ',
                    m('span.fontweight-semibold.text-error',
                        'cancel-project '
                    ),
                    'in the field below. Then we will ask you to write a message to the supporters and your project will then be canceled.',
                    m('span.fontweight-semibold.text-error')
                ]),
                m('.w-form', [
                    m('input.positive.text-field.u-marginbottom-40.w-input[maxlength=\'256\'][type=\'text\']', {
                        class: !ctrl.checkError() ? false : 'error',
                        placeholder: 'cancel-project',
                        onchange: m.withAttr('value', ctrl.check)
                    })
                ]),
                m('div',
                    m('.w-row', [
                        m('.w-col.w-col-3'),
                        m('.u-text-center.w-col.w-col-6', [
                            m('button.btn.btn-inactive.btn-large.u-marginbottom-20', {
                                onclick: ctrl.showNextModal
                            }, 'Next step >'),
                            m('a.fontsize-small.link-hidden-light[href=\'#\']', {
                                onclick: args.displayModal.toggle
                            },
                                'Cancel'
                            )
                        ]),
                        m('.w-col.w-col-3')
                    ])
                )
            ]);
    }
};

export default cancelProjectModalContent;
