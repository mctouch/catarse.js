import m from 'mithril';

const nationalityRadio = {
    controller: function(args) {
        const defaultCountryID = args.defaultCountryID,
            defaultForeignCountryID = args.defaultForeignCountryID,
            international = args.international;

        return {
            defaultCountryID,
            defaultForeignCountryID,
            international
        };
    },
    view: function(ctrl, args) {
        const international = ctrl.international,
            fields = args.fields;

        return m('div',
            m('.w-row', [
                m('.w-col.w-col-4',
                    m('.fontsize-small.fontweight-semibold',
                        'Nationality:'
                    )
                ),
                m('.w-col.w-col-4',
                    m('.fontsize-small.w-radio', [
                        m("input.w-radio-input[name='nationality'][type='radio']", {
                            checked: !international(),
                            onclick: () => {
                                fields.countryID(ctrl.defaultCountryID);
                                international(false);
                            }
                        }),
                        m('label.w-form-label',
                            'Australian (a)'
                        )
                    ])
                ),
                m('.w-col.w-col-4',
                    m('.fontsize-small.w-radio', [
                        m("input.w-radio-input[name='nationality'][type='radio']", {
                            checked: international(),
                            onclick: () => {
                                if (fields.countryID() === ctrl.defaultCountryID) {
                                    fields.countryID(ctrl.defaultForeignCountryID); // USA
                                }
                                international(true);
                            }
                        }),
                        m('label.w-form-label',
                            'International'
                        )
                    ])
                )
            ])
        );
    }
};

export default nationalityRadio;
