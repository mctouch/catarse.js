import m from 'mithril';
import _ from 'underscore';
import { catarse } from '../api';
import projectListVM from '../vms/project-list-vm';
import models from '../models';
import projectFilterVM from '../vms/project-filter-vm';
import adminFilter from '../c/admin-filter';
import adminList from '../c/admin-list';
import adminProjectItem from '../c/admin-project-item';
import adminProjectDetail from '../c/admin-project-detail';
import filterDateRange from '../c/filter-date-range';
import filterNumberRange from '../c/filter-number-range';
import filterMain from '../c/filter-main';
import filterDropdown from '../c/filter-dropdown';

const adminProjects = {
    controller: function() {
        const listVM = projectListVM,
            filterVM = projectFilterVM,
            categories = m.prop([]),
            filters = catarse.filtersVM,
            error = m.prop(''),
            filterBuilder = [{ // name
                component: filterMain,
                data: {
                    vm: filterVM.full_text_index,
                    placeholder: 'Search by project, permalink, email, name of the director...',
                },
            }, { // status
                component: filterDropdown,
                data: {
                    label: 'With the status',
                    index: 'state',
                    name: 'state',
                    vm: filterVM.state,
                    options: [{
                        value: '',
                        option: 'Any'
                    }, {
                        value: 'successful',
                        option: 'successful'
                    }, {
                        value: 'waiting_funds',
                        option: 'waiting_funds'
                    }, {
                        value: 'online',
                        option: 'online'
                    }, {
                        value: 'failed',
                        option: 'failed'
                    }, {
                        value: 'draft',
                        option: 'draft'
                    }]
                }
            },
            { // mode
                component: filterDropdown,
                data: {
                    label: 'Modality',
                    index: 'mode',
                    name: 'mode',
                    vm: filterVM.mode,
                    options: [{
                        value: '',
                        option: 'Any'
                    }, {
                        value: 'one',
                        option: 'Everything or nothing'
                    }, {
                        value: 'flex',
                        option: 'Flex'
                    }, {
                        value: 'sub',
                        option: 'Recurrent'
                    }
                    ]
                }
            },
            { // recommended
                component: filterDropdown,
                data: {
                    label: 'Recommended',
                    index: 'recommended',
                    name: 'recommended',
                    vm: filterVM.recommended,
                    options: [{
                        value: '',
                        option: 'Any'
                    }, {
                        value: true,
                        option: 'Sim'
                    }, {
                        value: false,
                        option: 'No'
                    }
                    ]
                }
            }, { // goal
                component: filterNumberRange,
                data: {
                    label: 'Meta between',
                    first: filterVM.goal.gte,
                    last: filterVM.goal.lte
                }
            },
            { // progress
                component: filterNumberRange,
                data: {
                    label: 'Progress% between',
                    first: filterVM.progress.gte,
                    last: filterVM.progress.lte
                }
            },
            { // updated at
                component: filterDateRange,
                data: {
                    label: 'Updated between',
                    first: filterVM.updated_at.gte,
                    last: filterVM.updated_at.lte
                }
            },
            { // expires_at
                component: filterDateRange,
                data: {
                    label: 'Expire between',
                    first: filterVM.project_expires_at.gte,
                    last: filterVM.project_expires_at.lte
                }
            },
            { // created_at
                component: filterDateRange,
                data: {
                    label: 'Created between',
                    first: filterVM.created_at.gte,
                    last: filterVM.created_at.lte
                }
            }
            ],
            loadCategories = () => models.category.getPage(filters({}).order({
                name: 'asc'
            }).parameters()).then((data) => {
                categories(data);
                const options = _.map(categories(), category => ({ value: category.name, option: category.name }));
                options.unshift({ value: '', option: 'Any of them' });
                filterBuilder.unshift(
                    { // category
                        component: filterDropdown,
                        data: {
                            label: 'Category',
                            index: 'category',
                            name: 'category_name',
                            vm: filterVM.category_name,
                            options
                        }
                    }
              );
            }),
            submit = () => {
                listVM.firstPage(filterVM.parameters()).then(null, (serverError) => {
                    error(serverError.message);
                });
                return false;
            };

        loadCategories();

        return {
            filterVM,
            filterBuilder,
            listVM: {
                list: listVM,
                error
            },
            submit
        };
    },
    view: function(ctrl) {
        const label = 'Projects';

        return m('', [
            m.component(adminFilter, {
                form: ctrl.filterVM.formDescriber,
                filterBuilder: ctrl.filterBuilder,
                label,
                submit: ctrl.submit
            }),
            m.component(adminList, {
                vm: ctrl.listVM,
                filterVM: ctrl.filterVM,
                label,
                listItem: adminProjectItem,
                listDetail: adminProjectDetail
            })
        ]);
    }
};

export default adminProjects;
