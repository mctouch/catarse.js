/**
 * window.c.OnlineSuccessModalContent component
 * Render online success message
 *
 */
import m from 'mithril';

const onlineSuccessModalContent = {
    view: function(ctrl, args) {
        return m('.modal-dialog-content.u-text-center', [
            m('.fa.fa-check-circle.fa-5x.text-success.u-marginbottom-40'),
            m('p.fontsize-larger.lineheight-tight', 'Your campaign is in the air !!! Congratulations on that first big step. Good luck on your journey. ;)')
        ]);
    }
};

export default onlineSuccessModalContent;
