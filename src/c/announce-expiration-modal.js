import m from 'mithril';

const announceExpirationModal = {
    view: function(ctrl, args) {
        return m('div', [
            m('.modal-dialog-content', [
                m('.fontsize-large.u-text-center.u-marginbottom-30.fontweight-semibold',
                    'You confirm?'
                ),
                m('.fontsize-large.u-text-center.u-marginbottom-30', [
                    'Your collection will end on the day  ',
                    m('span.expire-date',
                        args.expirationDate
                    ),
                    ', at 11:50 p.m. Until then, you can capture resources and stay strong in your campaign! Once your deadline has expired, you will need to confirm your bank details. We will then deposit the money into your account within 10 business days.'
                ])
            ]),
            m('.modal-dialog-nav-bottom',
                m('.w-row', [
                    m('.w-col.w-col-2'),
                    m('.w-col.w-col-4', [
                        m("input[id='anchor'][name='anchor'][type='hidden'][value='announce_expiration']"),
                        m("input.btn.btn.btn-large[id='budget-save'][name='commit'][type='submit'][value='Sim']")
                    ]),
                    m('.w-col.w-col-4',
                        m('button.btn.btn-large.btn-terciary', {
                            onclick: args.displayModal.toggle
                        },
                            ' No'
                        )
                    ),
                    m('.w-col.w-col-2')
                ])
            )
        ]);
    }
};

export default announceExpirationModal;
