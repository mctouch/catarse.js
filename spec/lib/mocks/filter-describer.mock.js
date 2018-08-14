beforeAll(function(){
  FilterDescriberMock = function(filterMain, filterDropdown, filterNumberRange, filterDateRange){
    var describer = [
      { //full_text_index
        component: filterMain,
        data: {
          vm: m.prop(),
          placeholder: 'Search by project, email, user and support ids ...'
        }
      },
      { //state
        component: filterDropdown,
        data: {
          label: 'With the status',
          name: 'state',
          vm: m.prop(),
          options: [
            {value: '', option: 'Any'},
            {value: 'paid', option: 'paid'},
            {value: 'refused', option: 'refused'},
            {value: 'pending', option: 'pending'},
            {value: 'pending_refund', option: 'pending_refund'},
            {value: 'refunded', option: 'refunded'},
            {value: 'chargeback', option: 'chargeback'},
            {value: 'deleted', option: 'deleted'}
          ]
        }
      },
      { //gateway
        component: filterDropdown,
        data: {
          label: 'gateway',
          name: 'gateway',
          vm: m.prop(),
          options: [
            {value: '', option: 'Any'},
            {value: 'Pay me', option: 'Pay me'},
            {value: 'MoIP', option: 'MoIP'},
            {value: 'PayPal', option: 'PayPal'},
            {value: 'Credits', option: 'Créditos'}
          ]
        }
      },
      { //value
        component: filterNumberRange,
        data: {
          label: 'Values ​​between',
          first: m.prop(),
          last: m.prop()
        }
      },
      { //created_at
        component: filterDateRange,
        data: {
          label: 'Support period',
          first: m.prop(),
          last: m.prop()
        }
      }
    ];

    return describer;
  };
});
