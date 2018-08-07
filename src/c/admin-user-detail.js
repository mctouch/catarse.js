/**
 * window.c.AdminUserDetail component
 * Return action inputs to be used inside AdminList component.
 *
 * Example:
 * m.component(c.AdminList, {
 *     data: {},
 *     listDetail: c.AdminUserDetail
 * })
 */
import m from 'mithril';
import _ from 'underscore';
import models from '../models';
import adminExternalAction from './admin-external-action';
import userVM from '../vms/user-vm';
import adminResetPassword from './admin-reset-password';
import adminInputAction from './admin-input-action';
import adminNotificationHistory from './admin-notification-history';
import adminUserBalanceTransactionsList from './admin-user-balance-transactions-list';
import h from '../h';
import { catarse } from '../api';

const adminUserDetail = {
    controller: function(args) {
        return {
            actions: {
                reset: {
                    property: 'password',
                    callToAction: 'Reset',
                    innerLabel: 'New User Password:',
                    outerLabel: 'Redefine password',
                    placeholder: 'ex: 123mud@r',
                    model: models.user
                },
                ban: {
                    updateKey: 'id',
                    callToAction: 'Ban user',
                    innerLabel: 'Are you sure you want to ban the user?',
                    outerLabel: 'Ban user',
                    model: models.user
                },
                reactivate: {
                    property: 'deactivated_at',
                    updateKey: 'id',
                    callToAction: 'Reactivate',
                    innerLabel: 'Are you sure you want to re-enable this user?',
                    successMessage: 'User reactivated successfully!',
                    errorMessage: 'User could not be reactivated!',
                    outerLabel: 'Reactivate user',
                    forceValue: null,
                    model: models.user
                }
            },
        };
    },
    view: function(ctrl, args) {
        const actions = ctrl.actions,
            item = args.item,
            details = args.details,
            banUser = (builder, id) => _.extend({}, builder, {
                requestOptions: {
                    url: (`/users/${id}/ban`),
                    method: 'POST'
                }
            }),
            addOptions = (builder, id) => _.extend({}, builder, {
                requestOptions: {
                    url: (`/users/${id}/new_password`),
                    method: 'POST'
                }
            });

        return m('#admin-contribution-detail-box', [
            m('.divider.u-margintop-20.u-marginbottom-20'),
            m('.w-row.u-marginbottom-30', [
                m.component(adminResetPassword, {
                    data: addOptions(actions.reset, item.id),
                    item
                }),
                m.component(adminExternalAction, {
                    data: banUser(actions.ban, item.id),
                    item
                }),
                (item.deactivated_at) ?
                    m.component(adminInputAction, { data: actions.reactivate, item }) : ''
            ]),
            m('.w-row.card.card-terciary.u-radius', [
                m(adminNotificationHistory, {
                    user: item,
                    wrapperClass: '.w-col.w-col-4'
                }),
                m(adminUserBalanceTransactionsList, { user_id: item.id })
            ]),
        ]);
    }
};

export default adminUserDetail;
