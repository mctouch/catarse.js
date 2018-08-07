import m from 'mithril';
import models from '../models';
import { catarse } from '../api';
import _ from 'underscore';
import h from '../h';
import userVM from '../vms/user-vm';
import projectCard from './project-card';
import inlineError from './inline-error';
import loadMoreBtn from './load-more-btn';

const userContributed = {
    controller: function(args) {
        const contributedProjects = m.prop(),
            user_id = args.userId,
            pages = catarse.paginationVM(models.project),
            error = m.prop(false),
            loader = m.prop(true),
            contextVM = catarse.filtersVM({
                project_id: 'in'
            });

        userVM.getPublicUserContributedProjects(user_id, null).then((data) => {
            contributedProjects(data);
            if (!_.isEmpty(contributedProjects())) {
                contextVM.project_id(_.pluck(contributedProjects(), 'project_id')).order({
                    online_date: 'desc'
                });

                models.project.pageSize(9);
                pages.firstPage(contextVM.parameters()).then(() => {
                    loader(false);
                });
            } else {
                loader(false);
            }
        }).catch((err) => {
            error(true);
            loader(false);
            m.redraw();
        });

        return {
            projects: pages,
            error,
            loader
        };
    },
    view: function(ctrl, args) {
        const projects_collection = ctrl.projects.collection();
        return (ctrl.error() ? m.component(inlineError, { message: 'Error loading projects.' }) : ctrl.loader() ? h.loader() : m('.content[id=\'contributed-tab\']',
            [
                  (!_.isEmpty(projects_collection) ? _.map(projects_collection, project => m.component(projectCard, {
                      project,
                      ref: 'user_contributed',
                      showFriends: false
                  })) :
                    m('.w-container',
                        m('.u-margintop-30.u-text-center.w-row',
                            [
                                m('.w-col.w-col-3'),
                                m('.w-col.w-col-6',
                                    [
                                        m('.fontsize-large.u-marginbottom-30',
                                                'Well, now ... you have not yet supported any project in Trend!'),
                                        m('.w-row',
                                            [
                                                m('.w-col.w-col-3'),
                                                m('.w-col.w-col-6',
                                                    m('a.btn.btn-large[href=\'/explore\']',
                                                        'How about supporting now??'
                                                    )
                                                ),
                                                m('.w-col.w-col-3')
                                            ]
                                        )
                                    ]
                                ),
                                m('.w-col.w-col-3')
                            ]
                        )
                    )
                  ),

                  (!_.isEmpty(projects_collection) ?
                  m('.w-row.u-marginbottom-40.u-margintop-30', [
                      m(loadMoreBtn, { collection: ctrl.projects, cssClass: '.w-col-push-5' })
                  ]) : '')
            ]
              ))
              ;
    }
};

export default userContributed;
