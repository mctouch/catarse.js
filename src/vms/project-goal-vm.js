import m from 'mithril';
import projectVM from './project-vm';
import generateErrorInstance from '../error';

const e = generateErrorInstance();

const fields = {
    mode: m.prop(''),
    online_days: m.prop(''),
    goal: m.prop('')
};

const fillFields = (data) => {
    fields.mode(data.mode || 'one');
    fields.online_days(data.online_days || '');
    fields.goal(data.goal);
};

const updateProject = (project_id) => {
    const projectData = {
        mode: fields.mode(),
        online_days: fields.online_days(),
        goal: fields.goal()
    };

    return projectVM.updateProject(project_id, projectData);
};

const genClickChangeMode = mode => () => {
    fields.mode(mode);
    fields.online_days('');
    if (mode == 'flex') {
        e.inlineError('online_days', false);
    }
};

const projectGoalVM = {
    fields,
    fillFields,
    updateProject,
    e,
    genClickChangeMode
};

export default projectGoalVM;
