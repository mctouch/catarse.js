import m from 'mithril';
import h from '../h';

const footer = {
    view: function() {
        return m('footer.main-footer.main-footer-neg',
            [
                m('section.w-container',
                    m('.w-row',
                        [
                            m('.w-col.w-col-9',
                                m('.w-row',
                                    [
                                        m('.w-col.w-col-4.w-col-small-4.w-col-tiny-4.w-hidden-tiny',
                                            [
                                                m('.footer-full-signature-text.fontsize-small',
                                                    'Welcome'
                                                ),
                                                m('a.link-footer[href=\'http://crowdfunding.catarse.me/quem-somos?ref=ctrse_footer\']',
                                                    ' Who we are'
                                                ),
                                                m('a.link-footer[href=\'http://crowdfunding.catarse.me/paratodos?ref=ctrse_footer\']',
                                                    ' How does it work'
                                                ),
                                                m('a.link-footer[href=\'http://blog.catarse.me\']',
                                                    ' Blog'
                                                ),
                                                m('a.link-footer[href=\'https://www.catarse.me/pt/team?ref=ctrse_footer\']',
                                                    [
                                                        ' Our team ',
                                                        m.trust('&lt;'),
                                                        '3'
                                                    ]
                                                ),
                                                m('a.link-footer[href=\'https://www.catarse.me/pt/press?ref=ctrse_footer\']',
                                                    ' Press'
                                                ),
                                                m('a.u-marginbottom-30.link-footer[href=\'http://ano.catarse.me/2017?ref=ctrse_footer\']',
                                                    ' 2017 Retrospective'
                                                ),
                                                m('.footer-full-signature-text.fontsize-small',
                                                    'Social networks'
                                                ),
                                                m('a.link-footer[href=\'http://facebook.com/catarse.me\']',
                                                    [
                                                        m('span.fa.fa-facebook-square.fa-lg'),
                                                        m.trust('&nbsp;&nbsp;'),
                                                        'Facebook'
                                                    ]
                                                ),
                                                m('a.link-footer[href=\'http://twitter.com/catarse\']',
                                                    [
                                                        m('span.fa.fa-twitter-square.fa-lg'),
                                                        m.trust('&nbsp;&nbsp;'),
                                                        'Twitter'
                                                    ]
                                                ),
                                                m('a.link-footer[href=\'http://instagram.com/catarse\']',
                                                    [
                                                        m('span.fa.fa-instagram.fa-lg'),
                                                        m.trust('&nbsp;&nbsp;'),
                                                        'Instagram'
                                                    ]
                                                ),
                                                m('a.link-footer[href=\'http://github.com/catarse/catarse\']',
                                                    [
                                                        m('span.fa.fa-github-square.fa-lg'),
                                                        m.trust('&nbsp;&nbsp;'),
                                                        'Github'
                                                    ]
                                                )
                                            ]
                                        ),
                                        m('.w-col.w-col-4.w-col-small-4.w-col-tiny-4.footer-full-firstcolumn',
                                            [
                                                m('.footer-full-signature-text.fontsize-small',
                                                    'Help'
                                                ),
                                                m('a.link-footer[href=\'http://suporte.catarse.me?ref=ctrse_footer/\']',
                                                    ' Support Center'
                                                ),
                                                h.getUser() ?
                                                    m('a.link-footer[href=\'https://suporte.catarse.me/hc/pt-br/signin?return_to=https%3A%2F%2Fsuporte.catarse.me%2Fhc%2Fpt-br%2Frequests%2Fnew&locale=19\'][target="_BLANK"]',
                                                      ' Contact'
                                                     )
                                                    :
                                                    m('a.link-footer[href=\'http://suporte.catarse.me/hc/pt-br/requests/new\'][target="_BLANK"]',
                                                      ' Contact'
                                                     ),
                                                m('a.link-footer[href=\'https://www.ofinanciamentocoletivo.com.br/?ref=ctrse_footer\']',
                                                  ' School Catarse'
                                                 ),
                                                m('a.link-footer[href=\'http://crowdfunding.catarse.me/nossa-taxa?ref=ctrse_footer\']',
                                                  ' Our Rate'
                                                 ),
                                                m('a.link-footer[href=\'http://pesquisa.catarse.me/\']',
                                                  ' Portrait FC Brazil 2013/2014'
                                                 ),
                                                m('a.link-footer[href=\'http://suporte.catarse.me/hc/pt-br/articles/115002214043-Responsabilidades-e-Seguran%C3%A7a?ref=ctrse_footer\']',
                                                  ' Responsibilities and Security'
                                                 ),
                                                m('a.link-footer[href=\'https://crowdfunding.catarse.me/legal/termos-de-uso\'][target="_BLANK"]',
                                                  ' Terms of use'
                                                 ),
                                                m('a.link-footer[href=\'https://crowdfunding.catarse.me/legal/politica-de-privacidade\'][target="_BLANK"]',
                                                  ' Privacy policy'
                                                 )
                                            ]
                                        ),
                                        m('.w-col.w-col-4.w-col-small-4.w-col-tiny-4.footer-full-lastcolumn',
                                            [
                                                m('.footer-full-signature-text.fontsize-small',
                                                    'Make a campaign'
                                                ),
                                                m('a.link-footer[href=\'/pt/start?ref=ctrse_footer\']',
                                                    ' Start your project'
                                                ),
                                                m('a.link-footer[href=\'http://crowdfunding.catarse.me/financiamento-coletivo-musica-independente?ref=ctrse_footer\']',
                                                    ' Music not Catarse'
                                                ),
                                                m('a.link-footer[href=\'https://crowdfunding.catarse.me/publicacoes-independentes-financiamento-coletivo?ref=ctrse_footer\']',
                                                    ' Independent Publications'
                                                ),
                                                m('a.u-marginbottom-30.link-footer[href=\'https://crowdfunding.catarse.me/assinaturas?ref=ctrse_footer\']',
                                                    [
                                                        'Signature Subscriptions',
                                                        m.trust('&nbsp;'),
                                                        m('span.badge.badge-success',
                                                        'Novelty‍'
                                                       )
                                                    ]
                                                 ),
                                                m('.footer-full-signature-text.fontsize-small',
                                                    'Support projects in Trend'
                                                ),
                                                m('a.link-footer[href=\'/pt/explore?ref=ctrse_footer\']',
                                                    ' Explore projects'
                                                ),
                                                m('a.w-hidden-main.w-hidden-medium.w-hidden-small.link-footer[href=\'http://blog.catarse.me?ref=ctrse_footer\']',
                                                    ' Blog'
                                                ),
                                                m('a.w-hidden-main.w-hidden-medium.w-hidden-small.link-footer[href=\'http://suporte.catarse.me/hc/pt-br/requests/new\']',
                                                    ' Contact'
                                                ),
                                                m('a.w-hidden-tiny.link-footer[href=\'/pt/explore?filter=score&ref=ctrse_footer\']',
                                                    ' Popular'
                                                ),
                                                m('a.w-hidden-tiny.link-footer[href=\'/pt/explore?filter=online&ref=ctrse_footer\']',
                                                    ' No ar'
                                                ),
                                                m('a.w-hidden-tiny.link-footer[href=\'/pt/explore?filter=finished&ref=ctrse_footer\']',
                                                    ' Finalized'
                                                )
                                            ]
                                        )
                                    ]
                                )
                            ),
                            m('.w-col.w-col-3.column-social-media-footer',
                                [
                                    m('.footer-full-signature-text.fontsize-small',
                                        'Subscribe to our news'
                                    ),
                                    m('.w-form',
                                        m(`form[accept-charset='UTF-8'][action='${h.getNewsletterUrl()}'][id='mailee-form'][method='post']`,
                                            [
                                                m('.w-form.footer-newsletter',
                                                    m('input.w-input.text-field.prefix[id=\'EMAIL\'][label=\'email\'][name=\'EMAIL\'][placeholder=\'Digite seu email\'][type=\'email\']')
                                                ),
                                                m('button.w-inline-block.btn.btn-edit.postfix.btn-attached[style="padding:0;"]',
                                                    m('img.footer-news-icon[alt=\'Icon newsletter\'][src=\'/assets/catarse_bootstrap/icon-newsletter.png\']')
                                                )
                                            ]
                                        )
                                    ),
                                    m('.footer-full-signature-text.fontsize-small',
                                        'Change language'
                                    ),
                                    m('[id=\'google_translate_element\']')
                                ]
                            )
                        ]
                    )
                ),
                m('.w-container',
                    m('.footer-full-copyleft',
                        [
                            m('img.u-marginbottom-20[alt=\'Logo footer\'][src=\'/assets/logo-footer.png\']'),
                            m('.lineheight-loose',
                                m('a.link-footer-inline[href=\'http://github.com/catarse/catarse\']',
                                   ` Made with love | ${new Date().getFullYear()} | Open source`
                                )
                            )
                        ]
                    )
                )
            ]
        );
    }
};

export default footer;
