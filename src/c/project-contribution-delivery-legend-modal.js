import m from 'mithril';
import h from '../h';

const ProjectContributionDeliveryLegendModal = {
    view: function(ctrl, args) {
        return m('div', [
            m('.modal-dialog-header', [
                m('.fontsize-large.u-text-center',
                    'Status from entrega')
            ]),
            m('.modal-dialog-content', [
                m('.fontsize-smaller.u-marginbottom-30',
                    'All support has, by default, delivery status \'Not sent\'. To assist in your control of rewards delivery, you can change these statuses and filter the support search with the following labels:'
                ),
                m('.u-marginbottom-20', [
                    m('.fontsize-smaller.fontweight-semibold', [
                        'Not sent',
                        m.trust('&nbsp;')
                    ]),
                    m('.fontsize-smaller',
                        'You have not yet sent the reward to the supporter.'
                    )
                ]),
                m('div',
                    m('span.fontsize-smaller.badge.badge-success',
                        'Delivered'
                    )
                ),
                m('.u-marginbottom-20',
                    m('.fontsize-smaller',
                        'You have already sent the reward to the supporter.'
                    )
                ),
                m('.u-marginbottom-20', [
                    m('div',
                        m('span.fontsize-smaller.badge.badge-attention',
                            'Delivery error'
                        )
                    ),
                    m('.fontsize-smaller',
                        'You sent the reward, but there was a problem with the submission (eg incorrect address).'
                    )
                ]),
                m('.u-marginbottom-20', [
                    m('div',
                        m('span.fontsize-smaller.badge.badge-success', [
                            m('span.fa.fa-check-circle',
                                ''
                            ),
                            ' Received'
                        ])
                    ),
                    m('.fontsize-smaller',
                        'The sponsor marked the reward as \'Received\' in your control panel \o/'
                    )
                ])
            ]),
            m('.divider.u-marginbottom-10'),
            m('.fontcolor-secondary.fontsize-smaller.u-marginbottom-30', [
                'Note: even if the reward is not physical (like a digital copy, for example), you can still use the above system!'
            ])
        ]);
    }
};

export default ProjectContributionDeliveryLegendModal;
