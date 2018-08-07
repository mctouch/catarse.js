/**
 * window.c.projectReportNoRewardReceived component
 * Render project report form
 *
 */
import m from 'mithril';
import h from '../h';
import _ from 'underscore';
import ownerMessageContent from './owner-message-content';
import modalBox from './modal-box';

const projectReportNoRewardReceived = {
    controller: function(args) {
        const formName = 'report-no-reward-received';
        const displayModal = h.toggleProp(false, true);
        const storeId = 'send-message';
        const sendMessage = () => {
            if (!h.getUser()) {
                h.storeAction(storeId, args.project.project_id);
                return h.navigateToDevise(`?redirect_to=/projects/${args.project.project_id}`);
            }

            displayModal(true);
        };

        if (h.callStoredAction(storeId) == args.project().project_id) {
            displayModal(true);
        }

        return {
            displayModal,
            sendMessage,
            formName: args.formName || formName
        };
    },
    view: function(ctrl, args) {
        const contactModalC = [ownerMessageContent, m.prop(_.extend(args.user, {
            project_id: args.project().id
        }))];

        return m('.card.u-radius.u-margintop-20',
            [
                     (ctrl.displayModal() ? m.component(modalBox, {
                         displayModal: ctrl.displayModal,
                         content: contactModalC
                     }) : ''),
	                   m('.w-form',
		                   m('form',
			                   [
				                     m('.report-option.w-radio',
					                     [
						                       m('input.w-radio-input[type=\'radio\']', {
                           value: ctrl.formName,
                           checked: args.displayFormWithName() === ctrl.formName,
                           onchange: m.withAttr('value', args.displayFormWithName)
                       }),
						                       m('label.fontsize-small.fontweight-semibold.w-form-label', {
                           onclick: _ => args.displayFormWithName(ctrl.formName)
                       }, 'I supported this project and have not received the reward yet')
					                     ]
				                      ),
				                     m('.u-margintop-30', {
                         style: {
                             display: args.displayFormWithName() === ctrl.formName ? 'block' : 'none'
                         }
                     },
					                     m('.fontsize-small',
						                     [
							                       'To know about the delivery of your reward, you can send a',
							                       m('a.alt-link', {
                           style: {
                               cursor: 'pointer'
                           },
                           onclick: h.analytics.event({
                               cat: 'project_view',
                               act: 'project_creator_sendmsg',
                               lbl: args.user.id,
                               project: args.project()
                           }, ctrl.sendMessage),
                           text: ' Message directly to the Director'
                       }),
							                       '.',
							                       m('br'),
							                       m('br'),
							                       'Look',
							                       m('a.alt-link', {
                           href: 'https://suporte.catarse.me/hc/pt-br/articles/360000149946-Ainda-n%C3%A3o-recebi-minha-recompensa-E-agora-',
                           target: '_blank'
                       }, ' on here '),
							                       'other tips on tracking this delivery.'
						                     ]
					                      )
				                      )
			                   ]
		                    )
	                    )
            ]);
    }
};

export default projectReportNoRewardReceived;
