/**
 * window.c.errorContributionModalContent component
 * Render deliver error contribution modal
 *
 */
import m from 'mithril';

const errorContributionModalContent = {
    view: function(ctrl, args) {
        return m('div',

            m('.modal-dialog-header',
                m('.fontsize-large.u-text-center', [
                    m('span.fa.fa-exclamation-triangle',
                        ''
                    ),
                    ' Ops. Sending error!'
                ])
            ),
            m('.modal-dialog-content', [
                m('p.fontsize-small.u-marginbottom-30', [
                    m('span.fontweight-semibold',
                        `You have selected ${args.amount} supports.`
                    ),
                    ' Upon your confirmation, the supporters who made these supports for your project will be notified that there was a problem with sending your rewards.'
                ]),
                m('.w-form', [
                    m('form', [
                        m('.fontsize-smaller',
                            'If you want to add some information in this message, use the space below (ex: you can ask for confirmation of delivery address or explain reasons for the error)'
                        ),
                        m("textarea.height-mini.text-field.w-input[placeholder='Enter your message (optional)']", {
                            value: args.message(),
                            onchange: m.withAttr('value', args.message)
                        })
                    ]),
                ]),
                m('.w-row', [
                    m('.w-col.w-col-1'),
                    m('.w-col.w-col-10',
                        m('.fontsize-small.fontweight-semibold.u-marginbottom-20.u-text-center',
                            'You confirm that there was an error in sending the rewards for the selected backups?'
                        )
                    ),
                    m('.w-col.w-col-1')
                ]),
                m('.w-row', [
                    m('.w-col.w-col-1'),
                    m('.w-col.w-col-5',
                        m('a.btn.btn-medium.w-button', {
                            onclick: () => args.updateStatus('error')
                        },
                            'Sim!'
                        )
                    ),
                    m('.w-col.w-col-5',
                        m('a.btn.btn-medium.btn-terciary.w-button', {
                            onclick: args.displayModal.toggle
                        },
                            'Come back'
                        )
                    ),
                    m('.w-col.w-col-1')
                ])
            ]));
    }
};

export default errorContributionModalContent;
