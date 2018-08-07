import m from 'mithril';
import _ from 'underscore';
import moment from 'moment';
import h from '../h';
import { commonPayment } from '../api';
import models from '../models';

const I18nScope = _.partial(h.i18nScope, 'projects.subscription_fields');

const subscriptionStatusIcon = {
    controller: function(args) {
        const statusClass = {
                active: 'fa-circle.text-success',
                started: 'fa-circle.text-waiting',
                inactive: 'fa-circle.text-error',
                canceled: 'fa-times-circle.text-error',
                canceling: 'fa-times-circle-o.text-error',
                deleted: 'fa-circle.text-error',
                error: 'fa-circle.text-error'
            },
            subscriptionTransition = m.prop(null);

        // get last subscription status transition from '/subscription_status_transitions' from this subscription
        if (args.subscription.id) {
            args.subscription.transition_date = args.subscription.created_at;

    	      const filterRowVM = commonPayment.filtersVM({
              subscription_id: 'eq',
		            project_id: 'eq',
          }).order({
		            created_at: 'desc'
	          }).subscription_id(args.subscription.id).project_id(args.subscription.project_id);

	          const lRew = commonPayment.loaderWithToken(models.subscriptionTransition.getRowOptions(filterRowVM.parameters()));
            lRew.load().then((data) => {
		            args.subscription.transition_date = data && data.length > 0 && _.first(data).created_at ? _.first(data).created_at : args.subscription.created_at;
            });
        }

        return {
            statusClass
        };
    },
    view: function(ctrl, args) {
        const subscription = args.subscription,
            statusClass = ctrl.statusClass,
	            statusToShowTransitionDate = ['started', 'canceling', 'canceled', 'inactive'],
            shouldShowTransitionDate = statusToShowTransitionDate.indexOf(subscription.status) >= 0;

        return m('span', [
            m('span.fontsize-smaller', [
                m(`span.fa.${statusClass[subscription.status] || 'Error'}`,
                  ' '
                ),
                window.I18n.t(`status.${subscription.status}`, I18nScope())
            ]),
	          shouldShowTransitionDate ? m('.fontcolor-secondary.fontsize-mini.fontweight-semibold.lineheight-tightest',
                                                                         `in ${moment(subscription.transition_date).format('DD/MM/YYYY')}`
                                                                        ) : ''
        ]);
    }
};

export default subscriptionStatusIcon;
