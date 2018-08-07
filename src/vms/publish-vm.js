import m from 'mithril';
import h from '../h';

const aonTerms = (project, expiresAt) => [
    m('.w-col.w-col-11', [
        m('div', [
            m('span.fontsize-smallest.fontcolor-secondary', '1/9'),
            ' ',
            m('span', {
                style: {
                    'font-weight': ' 600'
                }
            }, 'What you can and can not change on the project page as of the post?')
        ]),
        m('div', [
            m('span.fontweight-semibold', 'You can not change'), ': the name of the person responsible for the project (Name / CPF or Social Reason / CNPJ), the funding modality, the project title, the URL of the project, the project category, the collection goal, the term chosen and the rewards where there are support already made. ',
            m('br'), m('br'),
            m('span.fontweight-semibold', 'You can change'), ': the main video of the campaign, the content of the description, the project image, the phrase of effect, the rewards where there are no supports made, in addition to adding new rewards during the collection'
        ])
    ]),

    m('.w-col.w-col-11', [
        m('div', [
            m('span.fontsize-smallest.fontcolor-secondary', '2/9'),
            ' ',
            m('span.fontweight-semibold', ' All-or-nothing rules')
        ]),
        m('div', ['You chose the all-or-nothing campaign. In this way, you will only receive the funds collected ', m('span.fontweight-semibold', 'if it reaches or exceeds the collection goal'), '. Otherwise, all of your supporters will be reimbursed. You will be responsible for delivering the rewards offered if your project reaches the collection goal.'])
    ]),

    m('.w-col.w-col-11', [
        m('div', [
            m('span.fontsize-smallest.fontcolor-secondary', '3/9'),
            ' ',
            m('span', {
                style: {
                    'font-weight': ' 600'
                }
            }, 'Goal of collection')
        ]),
        m('div', 'The goal can not be changed after the project has been published.'),

    ]),

    m('.w-col.w-col-11', [
        m('div', [
            m('span.fontsize-smallest.fontcolor-secondary', '4/9'),
            ' ',
            m('span', {
                style: {
                    'font-weight': ' 600'
                }
            }, 'Rates')
        ]),
        m('div', [
            'We charge 13% ',
            m('span.fontweight-semibold', 'total amount collected'),
            ' by your project if it reaches or exceeds the target within the campaign deadline. If the project does not reach the goal, no fee will be charged.',
            m('span.fontweight-semibold')
        ])
    ]),

    m('.w-col.w-col-11', [
        m('div', [
            m('span.fontsize-smallest.fontcolor-secondary', '5/9'),
            ' ',
            m('span', {
                style: {
                    'font-weight': ' 600'
                }
            }, 'Prazo da campanha')
        ]),
        m('div', `Your project will be in collection in the Trend until the day ${h.momentify(expiresAt)} at 11:50 p.m. This deadline can not be changed after the publication of the project.`)
    ]),

    m('.w-col.w-col-11', [
        m('div', [
            m('span.fontsize-smallest.fontcolor-secondary', '6/9'),
            ' ',
            m('span', {
                style: {
                    'font-weight': ' 600'
                }
            }, 'Transfer and refund rules'),
            m('div', [
                m.trust('When the deadline for your project comes to an end, you must enter and confirm your bank details. You may change the Bank, Account and the Agency <strong>only if the new registered account is owned by you</strong> . After this confirmation, Trend will deposit the amount collected, already discounted the fee, into your account in 10 business days. If the project does not reach 100% of the target by the deadline, the Trend will reimburse the supporters. <a href="http://suporte.catarse.me/hc/pt-br/articles/202365507" target="blank">Learn more about the repayment process</a>')
            ])
        ]),
        m('div', '')
    ]),


    m('.w-col.w-col-11', [
        m('div', [
            m('span.fontsize-smallest.fontcolor-secondary', '7/9'),
            ' ',
            m('span', {
                style: {
                    'font-weight': ' 600'
                }
            }, 'Responsibility of Trend')
        ]), [m('div', [m('span.fontweight-semibold'), m('span.fontweight-semibold', 'Trend is responsible:'), ' the technological development of the platform, attendance of doubts and problems (both of supporters and directors), for hosting the project on the platform and for ensuring the security of financial transactions.\ ', m('br'), m('br'), m('span.fontweight-semibold', 'Trend is not responsible:'), ' financing, dissemination and execution, nor for the delivery of rewards of the registered projects.'])]
    ]),

    m('.w-col.w-col-11', [
        m('div', [
            m('span.fontsize-smallest.fontcolor-secondary', '8/9'),
            ' ',
            m('span', {
                style: {
                    'font-weight': ' 600'
                }
            }, 'Your responsibilities')
        ]),
        m('div', 'It is your responsibility to receive the money from the campaign and everything related to formatting the project, planning and publicizing the fundraising campaign, mobilizing supporters, executing the project, communicating with supporters, and producing and delivering rewards within the estimated time frame.')
    ]),

    m('.w-col.w-col-11', [
        m('div', [
            m('span.fontsize-smallest.fontcolor-secondary', '9/9'),
            ' ',
            m('span', {
                style: {
                    'font-weight': ' 600'
                }
            }, 'Withdrawals from projects in the air')
        ]),
        m('div', [m('span.fontweight-semibold'), 'TREND reserves the right, in its sole discretion and once notified, to cancel projects and terminate the accounts of PROJECT CREATORS that violate our ', m('a.alt-link[href=\'http://suporte.catarse.me/hc/pt-br/articles/202387638-Diretrizes-para-cria%C3%A7%C3%A3o-de-projetos\'][target=\'_blank\']', 'Game rules'), ' e ', m('a.alt-link[href=\'http://www.catarse.me/terms-of-use\'][target=\'_blank\']', 'Terms of use'), '.'])
    ])
];

const flexTerms = project => [
    m('.w-col.w-col-11', [
        m('div', [
            m('span.fontsize-smallest.fontcolor-secondary', '1/9'),
            ' ',
            m('span.fontweight-semibold', 'What you can and can not change on the project page as of the post?')
        ]),
        m('div', [
            m('span.fontweight-semibold', 'You can not change'),
            ': the identity of the person in charge of the project (Name / CPF or Social Reason / CNPJ), the funding modality, the project title, the URL of the project, the project category, the collection goal, the deadline has defined), and the rewards where there is support already made.',
            m('br'), m('br'),
            m('span.fontweight-semibold', 'You can change'),
            ': the main video of the campaign, the content of the description, the project image, the phrase of effect, the rewards where there are no supports made, in addition to adding new rewards during the collection'
        ])
    ]),

    m('.w-col.w-col-11', [
        m('div', [
            m('span.fontsize-smallest.fontcolor-secondary', '2/9'),
            ' ',
            m('span.fontweight-semibold', 'FLEX Rules')
        ]),
        m('div', 'You have chosen the flexible campaign. In this way, you will receive all the funds collected from the supporters at the end of the campaign term (discounting the Catarse fee) and must comply with the execution of the project and with the delivery of the rewards offered regardless of how much to collect.')
    ]),
    m('.w-col.w-col-11', [
        m('div', [
            m('span.fontsize-smallest.fontcolor-secondary', '3/9'),
            ' ',
            m('span.fontweight-semibold', 'Goal of collection')
        ]),
        m('div', 'The goal can not be changed after the project has been published.')
    ]),
    m('.w-col.w-col-11', [
        m('div', [
            m('span.fontsize-smallest.fontcolor-secondary', '4/9'),
            ' ',
            m('span.fontweight-semibold', 'Rates')
        ]),
        m('div', [
            'At the end of the campaign, we will charge 13% ',
            m('span.fontweight-semibold', 'total amount collected.')
        ])
    ]),
    m('.w-col.w-col-11', [
        m('div', [
            m('span.fontsize-smallest.fontcolor-secondary', '5/9'),
            ' ',
            m('span.fontweight-semibold', 'Campaign deadline')
        ]),
        m('div', 'Once set, the closing period can not be changed. If you started the campaign with the deadline, you should set it during the campaign, and you can leave the campaign open for a maximum of 12 months.')
    ]),
    m('.w-col.w-col-11', [
        m('div', [
            m('span.fontsize-smallest.fontcolor-secondary', '6/9'),
            ' ',
            m('span.fontweight-semibold', 'Deadline for transfer')
        ]),
        m('div', m.trust('When the deadline for your project comes to an end, you must enter and confirm your bank details. You may change the Bank, Account and the Agency <strong>only if the new registered account is owned by you</strong> . Upon confirmation, Catarse will deposit into your checking account within 10 business days. The amount deposited will already be considering the discount of 13% of the rate.'))
    ]),
    m('.w-col.w-col-11', [
        m('div', [
            m('span.fontsize-smallest.fontcolor-secondary', '7/9'),
            ' ',
            m('span.fontweight-semibold', 'Responsibility of Trend')
        ]), [m('div', [m('span.fontweight-semibold'), m('span.fontweight-semibold', 'Trend is responsible:'), ' the technological development of the platform, attendance of doubts and problems (both of supporters and directors), for hosting the project on the platform and for ensuring the security of financial transactions.\ ', m('br'), m('br'), m('span.fontweight-semibold', 'Catarse is not responsible:'), 'financing, dissemination and execution, nor for the delivery of rewards of the registered projects.'])]
    ]),
    m('.w-col.w-col-11', [
        m('div', [
            m('span.fontsize-smallest.fontcolor-secondary', '8/9'),
            ' ',
            m('span.fontweight-semibold', 'Your responsibilities')
        ]),
        m('div', 'It is your responsibility to receive the money from the campaign and everything related to formatting the project, planning and publicizing the fundraising campaign, mobilizing supporters, executing the project, communicating with supporters, and producing and delivering rewards within the estimated time frame.')
    ]),
    m('.w-col.w-col-11', [
        m('div', [
            m('span.fontsize-smallest.fontcolor-secondary', '9/9'),
            ' ',
            m('span', {
                style: {
                    'font-weight': ' 600'
                }
            }, 'Withdrawals from projects in the air')
        ]),
        m('div', [m('span.fontweight-semibold'), 'TREND reserves the right, in its sole discretion and once notified, to cancel projects and terminate the accounts of PROJECT CREATORS that violate our ', m('a.alt-link[href=\'http://suporte.catarse.me/hc/pt-br/articles/202387638-Diretrizes-para-cria%C3%A7%C3%A3o-de-projetos\'][target=\'_blank\']', 'Game rules'), ' e ', m('a.alt-link[href=\'http://www.catarse.me/terms-of-use\'][target=\'_blank\']', 'Terms of use'), '.'])
    ])
];

const subTerms = project => [
    m('.w-col.w-col-11', [
        m('div', [
            m('span.fontcolor-secondary.fontsize-smallest',
                '1/9'
            ),
            m.trust('&nbsp;'),
            m('span.fontweight-semibold',
                'What you can and can not change on the project page as of the post?'
            )
        ]),
        m('div', [
            m('span.fontweight-semibold',
                'You can not change:'
            ),
            ' the identity of the person in charge of the project (Name / CPF or Corporate Name / CNPJ), a Financing method, the title of the project, the URL (link) of the project, the category chosen, the collection goals already reached and the rewards where there are already supported.',
            m('br'),
            m('br'),
            m('span.fontweight-semibold',
                'You can change: '
            ),
            'the content of the project description, the main campaign video, project images, effect phrase, rewards where there are no supports made, and adding new rewards and new goals during fundraising.'
        ])
    ]),
    m('.w-col.w-col-11', [
        m('div', [
            m('span.fontcolor-secondary.fontsize-smallest',
                '2/9'
            ),
            m('span.fontweight-semibold',
                'Rules of the Subscription Mode'
            )
        ]),
        m('div',
            'You have chosen Signature mode. In this way, you will receive in real time, in the balance of your Catarse account, the funds collected by your subscribers. You are responsible for delivering the rewards offered to your subscribers.'
        )
    ]),

    m('.w-col.w-col-11', [
        m('div', [
            m('span.fontcolor-secondary.fontsize-smallest',
                '3/9'
            ),
            m.trust('&nbsp;'),
            m('span.fontweight-semibold',
                'Collection goals'
            )
        ]),
        m('div',
            'You can only change future collection targets during the air campaign. That is, your active collection goal and your goals already achieved can not be changed.'
        )
    ]),

    m('.w-col.w-col-11', [
        m('div', [
            m('span.fontcolor-secondary.fontsize-smallest',
                '4/9'
            ),
            m.trust('&nbsp;'),
            m('span.fontweight-semibold',
                'Rates'
            )
        ]),
        m('div', [
            'We charge 13% on all amounts collected in your subscription campaign. ',
            m('span.fontweight-semibold')
        ])
    ]),

    m('.w-col.w-col-11', [
        m('div', [
            m('span.fontcolor-secondary.fontsize-smallest',
                '5/9'
            ),
            m.trust('&nbsp;'),
            m('span.fontweight-semibold',
                'Campaign deadline'
            )
        ]),
        m('div',
            'At Trend Subscriptions you can keep your campaign on the air for as long as you want.'
        )
    ]),

    m('.w-col.w-col-11', [
        m('div', [
            m('span.fontcolor-secondary.fontsize-smallest',
                '6/9'
            ),
            m.trust('&nbsp;'),
            m('span.fontweight-semibold',
                'Money Transfer Rules'
            )
        ]),
        m('div', [
            'You can make 01 monthly withdrawal (which is what we call transferring your balance in the Trend to your registered bank account). As soon as you request the withdrawal, Catarse will deposit the amount, with the discount of the rate, into your checking account within 10 business days.',
            m.trust('&nbsp;')
        ])
    ]),
    m('.w-col.w-col-11', [
        m('div', [
            m('span.fontcolor-secondary.fontsize-smallest',
                '7/9'
            ),
            m.trust('&nbsp;'),
            m('span.fontweight-semibold',
                'Responsibility of Catharsis'
            )
        ]),
        m('div', [
            m('span.fontweight-semibold'),
            m('span.fontweight-semibold',
                'Catarse is responsible:'
            ),
            m.trust('&nbsp;'),
            'the technological development of the platform, attendance of doubts and problems (both of supporters and directors), for hosting the project on the platform and for ensuring the security of financial transactions.',
            m('br'),
            m('br'),
            m('span.fontweight-semibold',
                'Trend is not responsible:'
            ),
            m.trust('&nbsp;'),
            'financing, dissemination and execution, nor for the delivery of rewards of the registered projects.'
        ])
    ]),
    m('.w-col.w-col-11', [
        m('div', [
            m('span.fontcolor-secondary.fontsize-smallest',
                '8/9'
            ),
            m.trust('&nbsp;'),
            m('span.fontweight-semibold',
                'Your responsibilities'
            )
        ]),
        m('div', [
            m('span.fontweight-semibold'),
            m('span.fontweight-semibold'),
            'It is your responsibility to receive the money from the campaign and everything related to formatting the project, planning and publicizing the fundraising campaign, mobilizing supporters, executing the project, communicating with supporters, and producing and delivering rewards within the estimated time frame.'
        ])
    ]),
    m('.w-col.w-col-11', [
        m('div', [
            m('span.fontcolor-secondary.fontsize-smallest',
                '9/9'
            ),
            m.trust('&nbsp;'),
            m('span.fontweight-semibold',
                'Withdrawals from projects in the air'
            )
        ]),
        m('div', [
            m('span.fontweight-semibold'),
            'TREND reserves the right, in its sole discretion and once notified, to cancel projects and terminate the accounts of PROJECT CREATORS that violate our ',
            m("a.alt-link[href='http://suporte.catarse.me/hc/pt-br/articles/202387638-Diretrizes-para-cria%C3%A7%C3%A3o-de-projetos'][target='_blank']",
                'Game rules'
            ),
            ' e ',
            m("a.alt-link[href='http://www.catarse.me/terms-of-use'][target='_blank']",
                'Terms of use'
            ),
            '.'
        ])
    ])
];

const publishVM = {
    flexTerms,
    subTerms,
    aonTerms
};

export default publishVM;
