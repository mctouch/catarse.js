import m from 'mithril';

const projectReminderCount = {
    view: function(ctrl, args) {
        const project = args.resource;
        return m('#project-reminder-count.card.u-radius.u-text-center.medium.u-marginbottom-80', [
            m('.fontsize-large.fontweight-semibold', 'Total of people who clicked on the Remember me button'),
            m('.fontsize-smaller.u-marginbottom-30', 'An email reminder is sent before the end of your campaign, inviting people to support you on the final stretch.!'),
            m('.fontsize-jumbo', project.reminder_count)
        ]);
    }
};

export default projectReminderCount;
