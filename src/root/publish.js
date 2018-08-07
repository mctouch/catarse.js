import m from 'mithril';
import _ from 'underscore';
import moment from 'moment';
import { catarse } from '../api';
import models from '../models';
import h from '../h';
import projectDashboardMenu from '../c/project-dashboard-menu';
import publishVM from '../vms/publish-vm';

const I18nScope = _.partial(h.i18nScope, 'projects.publish');

const publish = {
    controller: function(args) {
        const filtersVM = catarse.filtersVM({
                project_id: 'eq'
            }),
            projectAccount = m.prop([]),
            projectDetails = m.prop([]),
            loader = catarse.loaderWithToken;

        filtersVM.project_id(args.root.getAttribute('data-id'));

        const l = loader(models.projectDetail.getRowOptions(filtersVM.parameters())),
            accountL = loader(models.projectAccount.getRowOptions(filtersVM.parameters()));
        l.load().then(projectDetails);
        accountL.load().then(projectAccount);

        const expiresAt = () => {
            const project = _.first(projectDetails());
            return moment().add(project.online_days, 'days');
        };

        const acceptedIndex = m.prop(0);

        return {
            l,
            accountL,
            acceptedIndex,
            expiresAt,
            filtersVM,
            projectAccount,
            projectDetails
        };
    },
    view: function(ctrl, args) {
        const project = _.first(ctrl.projectDetails()),
            acceptedIndex = ctrl.acceptedIndex,
            account = _.first(ctrl.projectAccount());

        const terms = project.mode === 'flex' ? publishVM.flexTerms(project) :
          project.mode === 'one' ? publishVM.aonTerms(project, ctrl.expiresAt()) :
                                   publishVM.subTerms(project);

        return [project && account ? [
            (project.is_owner_or_admin ? m.component(projectDashboardMenu, {
                project: m.prop(project),
                hidePublish: true
            }) : ''),
            m(`.w-section.section-product.${project.mode}`),
            m('.w-section.section', [
                m('.w-container', [
                    m('.w-row', [
                        m('.w-col.w-col-3'),
                        m('.w-col.w-col-6', [
                            m('.u-text-center', [
                                m('img.u-marginbottom-20[src=\'/assets/catarse_bootstrap/launch-icon.png\'][width=\'94\']'),
                                m('.fontsize-large.fontweight-semibold.u-marginbottom-20', 'Ready to launch your campaign?'),
                                m('.fontsize-base.u-marginbottom-30', /'We've prepared a list with important information for you to check before putting your project in the air.!'/)
                            ])
                        ]),
                        m('.w-col.w-col-3')
                    ])
                ])
            ]),
            m('.divider'),
            m('.w-section.section-one-column.bg-gray.section.before-footer', [
                m('.w-container', [
                    m('.card.medium.u-marginbottom-60.card-terciary', [
                        m('.w-row', [
                            m('.w-col.w-col-6.w-clearfix', [
                                m(`img.card-project-thumb.u-right[src=${project.large_image}]`)
                            ]),
                            m('.w-col.w-col-6', [
                                m('.u-marginbottom-30.fontsize-base', [
                                    m('div', [m('span.fontweight-semibold', 'Título: '), project.name]),
                                    m('div', [m('span.fontweight-semibold', 'Link: '), `www.catarse.me/${project.permalink}`]),
                                    m('div', [m('span.fontweight-semibold', 'Financing method: '), window.I18n.t(project.mode, I18nScope())]),
                                    (project.mode !== 'sub' ?
                                        m('div', [m('span.fontweight-semibold', 'Goal of collection: '), `R$ ${h.formatNumber(project.goal, 2, 3)}`]) :
                                        ''),
                                    (project.online_days !== null) ? m('div', [m('span.fontweight-semibold', `Deadline: ${project.online_days} ${(project.online_days > 1) ? 'days' : 'day'}`)]) : '',
                                    m('div', [m('span.fontweight-semibold', 'Responsible: '), account.owner_name]),
                                    m('div', [m('span.fontweight-semibold', 'CPF/CNPJ: '), account.owner_document])
                                ])
                            ])
                        ]),
                        m('.u-text-center', [
                            m('.w-row', [
                                m('.w-col.w-col-1'),
                                m('.w-col.w-col-10', [
                                    m('.divider.u-marginbottom-10'),
                                    m('.fontsize-small.fontcolor-secondary', /'The above data can not be changed after the project goes live. If you need to make changes, navigate to the sidebar and come back here when you're all set!'/)
                                ]),
                                m('.w-col.w-col-1')
                            ])
                        ])
                    ]),
                    m('.card.medium.u-radius.u-marginbottom-60', [
                        m('.u-text-center.u-marginbottom-60', [
                            m('.fontsize-large.fontweight-semibold', 'Remember our rules'),
                            m('.w-row', [
                                m('.w-col.w-col-2'),
                                m('.w-col.w-col-8', [
                                    m('.fontsize-small', ['Before posting, click on the circles below and confirm that you are aware of how Catarse works. Any questions, ', m (' a.alt-link [href = "http://suporte.catarse.me/hc/en-us/requests/new"] [target = "_blank"] ',' sign in contact'), '!'])
                                ]),
                                m('.w-col.w-col-2')
                            ])
                        ]),

                        _.map(terms, (term, index) => m(`.u-marginbottom-30.fontsize-base${(index <= acceptedIndex()) ? '' : '.w-hidden.publish-rules'}`, [
                            m('.w-row', [
                                m('.w-col.w-col-1.u-text-center', [
                                    m('div', [
                                        m((index + 1 > acceptedIndex()) ? 'a.w-inline-block.checkbox-big' : 'a.w-inline-block.checkbox-big.checkbox--selected.fa.fa-check.fa-lg', {
                                            onclick: () => {
                                                if (index >= acceptedIndex()) {
                                                    acceptedIndex(acceptedIndex() + 1);
                                                }
                                            }
                                        })
                                    ])
                                ]),
                                term
                            ])
                        ]))

                    ]),
                    (acceptedIndex() >= terms.length ?
                    m('.w-row.publish-btn-section', [
                        m('.w-col.w-col-4'),
                        m('.w-col.w-col-4', [
                            m(`a.btn.btn-large.u-marginbottom-20[href=/${project.mode === 'flex' ? 'flexible_projects' : 'projects'}/${project.project_id}/push_to_online]`, 'Publicar agora!'),
                            m('.u-text-center.fontsize-smaller', [
                                'When you publish your project, you are accepting ',
                                m('a.alt-link[href=\'/terms-of-use\'][target=\'_blank\']', 'Terms of use'),
                                ' e ',
                                m('a.alt-link[href=\'/privacy-policy\'][target=\'_blank\']', 'Privacy policy')
                            ])
                        ]),
                        m('.w-col.w-col-4')
                    ]) : '')
                ])
            ])
        ] : h.loader()];
    }
};

export default publish;
