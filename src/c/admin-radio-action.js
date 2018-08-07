import m from 'mithril';
import _ from 'underscore';
import h from '../h';
import { catarse } from '../api';

const adminRadioAction = {
    controller: function(args) {
        const builder = args.data,
            complete = m.prop(false),
            data = {},
            error = m.prop(false),
            fail = m.prop(false),
            item = args.item(),
            description = m.prop(item.description || ''),
            key = builder.getKey,
            newID = m.prop(''),
            getFilter = {},
            setFilter = {},
            radios = m.prop([]),
            getAttr = builder.radios,
            getKey = builder.getKey,
            getKeyValue = args.getKeyValue,
            updateKey = builder.updateKey,
            updateKeyValue = args.updateKeyValue,
            validate = builder.validate,
            selectedItem = builder.selectedItem || m.prop();

        setFilter[updateKey] = 'eq';
        const setVM = catarse.filtersVM(setFilter);
        setVM[updateKey](updateKeyValue);

        getFilter[getKey] = 'eq';
        const getVM = catarse.filtersVM(getFilter);
        getVM[getKey](getKeyValue);

        const getLoader = catarse.loaderWithToken(builder.getModel.getPageOptions(getVM.parameters()));

        const setLoader = catarse.loaderWithToken(builder.updateModel.patchOptions(setVM.parameters(), data));

        const updateItem = (data) => {
            if (data.length > 0) {
                const newItem = _.findWhere(radios(), {
                    id: data[0][builder.selectKey]
                });
                selectedItem(newItem);
            } else {
                error({
                    message: 'No items updated'
                });
            }
            complete(true);
        };

        const populateRadios = (data) => {
            const emptyState = builder.addEmpty;

            radios(data);

            if (!_.isUndefined(emptyState)) {
                radios().unshift(emptyState);
            }
        };

        const fetch = () => {
            getLoader.load().then(populateRadios, error);
        };

        const submit = () => {
            if (newID()) {
                const validation = validate(radios(), newID());
                if (_.isUndefined(validation)) {
                    data[builder.selectKey] = newID() === -1 ? null : newID();
                    setLoader.load().then(updateItem, error);
                } else {
                    complete(true);
                    error({
                        message: validation
                    });
                }
            }
            return false;
        };

        const unload = (el, isinit, context) => {
            context.onunload = () => {
                complete(false);
                error(false);
                newID('');
            };
        };

        const setDescription = (text) => {
            description(text);
            m.redraw();
        };

        fetch();

        return {
            complete,
            description,
            setDescription,
            error,
            setLoader,
            getLoader,
            newID,
            submit,
            toggler: h.toggleProp(false, true),
            unload,
            radios
        };
    },
    view: function(ctrl, args) {
        const data = args.data,
            item = args.item(),
            btnValue = (ctrl.setLoader() || ctrl.getLoader()) ? 'please wait...' : data.callToAction;

        return m('.w-col.w-col-2', [
            m('button.btn.btn-small.btn-terciary', {
                onclick: ctrl.toggler.toggle
            }, data.outerLabel), (ctrl.toggler()) ?
            m('.dropdown-list.card.u-radius.dropdown-list-medium.zindex-10', {
                config: ctrl.unload
            }, [
                m('form.w-form', {
                    onsubmit: ctrl.submit
                }, (!ctrl.complete()) ? [
                    (ctrl.radios()) ?
                    _.map(ctrl.radios(), (radio, index) => m('.w-radio', [
                        m(`input#r-${index}.w-radio-input[type=radio][name="admin-radio"][value="${radio.id}"]`, {
                            checked: radio.id === (item[data.selectKey] || item.id),
                            onclick: () => {
                                ctrl.newID(radio.id);
                                ctrl.setDescription(radio.description);
                            }
                        }),
                        m(`label.w-form-label[for="r-${index}"]`, `R$${radio.minimum_value}`)
                    ])) : h.loader(),
                    m('strong', 'description'),
                    m('p', ctrl.description()),
                    m(`input.w-button.btn.btn-small[type="submit"][value="${btnValue}"]`)
                ] : (!ctrl.error()) ? [
                    m('.w-form-done[style="display:block;"]', [
                        m('p', 'Reward changed successfully!')
                    ])
                ] : [
                    m('.w-form-error[style="display:block;"]', [
                        m('p', ctrl.error().message)
                    ])
                ])
            ]) : ''
        ]);
    }
};

export default adminRadioAction;
