import m from 'mithril';
import h from '../../src/h';
import userSubscriptionBox from '../../src/c/user-subscription-box.js';

describe('UserSubscriptionBox', () => {
    let $subscriptionVersionWithNewDataShow, subscriptionData, paymentInfoData;

    describe('view', () => {
        beforeAll(() => {
            subscriptionData = SubscriptionVersionMockery();
            paymentInfoData = PaymentInfoMockery({
                "ticket_expiration_date": '2018-06-20T00:00:00'
            }); // generate with a fixed pass date to avoid yesterday fixed timestamp
            $subscriptionVersionWithNewDataShow = mq(m.component(userSubscriptionBox, {
                subscription: _.extend({}, subscriptionData, {
                    ticket_url: paymentInfoData.ticket_url,
                    ticket_expiration_date: paymentInfoData.ticket_expiration_date,
                    payment_status: paymentInfoData.status
                })
            }));
        });

        it('Should render new payment method of the current paid subscription', () => {
            expect($subscriptionVersionWithNewDataShow.has('.fa.fa-credit-card')).toBeTrue(); 
        });

        it('Should render new value of the current paid subscription', () => {
            expect($subscriptionVersionWithNewDataShow.contains('R$ 10')).toBeTrue(); 
        });

        it('Should render new reward of the current paid subscription', () => {
            expect($subscriptionVersionWithNewDataShow.contains('Notes')).toBeTrue(); 
        });

        it('Should render info about next charge', () => {
            expect($subscriptionVersionWithNewDataShow.contains('The highlighted changes will take effect on the next charge')).toBeTrue();
        });

        it('Should render generate second slip button', () => {
            expect($subscriptionVersionWithNewDataShow.contains('Generate duplicate')).toBeTrue();
        });
    });
});
