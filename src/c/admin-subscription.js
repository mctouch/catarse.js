import m from 'mithril';
import h from '../h';

const adminSubscription = {
    view: function(ctrl, args) {
        const subscription = args.item;
        return m('.w-row.admin-contribution', [
            m('.fontweight-semibold.fontsize-small',
              `R$${subscription.amount / 100} a month`
             ),
            m('.fontsize-smaller.fontweight-semibold',
              `(${subscription.paid_count} active month)`
             )
        ]);
    }
};

export default adminSubscription;
