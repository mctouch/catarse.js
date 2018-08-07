import m from 'mithril';
import _ from 'underscore'
import h from '../h';
import { catarse } from '../api';
import models from '../models';

const adminReward = {
    controller: function(args) {
        let l;
        const loadShippingFee = () => {
            const shippingFee = m.prop({});

            if (args.contribution.shipping_fee_id) {
                const options = models.shippingFee.getRowOptions(
                    h.idVM.id(
                        args.contribution.shipping_fee_id
                    ).parameters());

                l = catarse.loaderWithToken(options);
                l.load().then(_.compose(shippingFee, _.first));
            }

            return shippingFee;
        };

        return {
            shippingFee: loadShippingFee()
        };
    },

    view: function(ctrl, args) {
        const reward = args.reward(),
            contribution = args.contribution,
            available = parseInt(reward.paid_count) + parseInt(reward.waiting_payment_count),
            shippingFee = ctrl.shippingFee();

        return m('.w-col.w-col-4', [
            m('.fontweight-semibold.fontsize-smaller.lineheight-tighter.u-marginbottom-20', 'Reward'),
            m('.fontsize-smallest.lineheight-looser', reward.id ? [
                `ID: ${reward.id}`,
                m('br'),
                `Delivery's place: ${(shippingFee.destination ? `${shippingFee.destination} R$ ${shippingFee.value}` : 'none')}`,
                m('br'),
                `Send: ${window.I18n.t(`shared.shipping_options.${reward.shipping_options}`)}`,
                m('br'),
                `Minimum value: R$${h.formatNumber(reward.minimum_value, 2, 3)}`,
                m('br'),
                m.trust(`Available: ${available} / ${reward.maximum_contributions || '&infin;'}`),
                m('br'),
                `Waiting confirmation: ${reward.waiting_payment_count}`,
                m('br'),
                `Estimated Delivery: ${h.momentify(reward.deliver_at)}`,
                m('br'),
                m('div', [
                    'Status from Entrega: ',
                    h.contributionStatusBadge(contribution),
                ]),
                (reward.title ? [`Title: ${reward.title}`,
                    m('br')
                ] : ''),
                `description: ${reward.description}`
            ] : 'Support without reward')
        ]);
    }
};

export default adminReward;
